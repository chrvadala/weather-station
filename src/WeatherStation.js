const EventEmitter = require('events');
const Bluetooth = require('./Bluetooth')
const {buildIndex} = require('./utils')
const debug = require('debug')('weather-station')

const BLEWS_ATTR_DEVICE_INFORMATION = '74e78e02-c6a4-11e2-b7a9-0002a5d5c51b'
const BLEWS_ATTR_INDOOR_AND_CH1_TO_3_TH_DATA = '74e78e10-c6a4-11e2-b7a9-0002a5d5c51b'
const BLEWS_ATTR_CH4_TO_7_TH_DATA = '74e78e14-c6a4-11e2-b7a9-0002a5d5c51b'
const BLEWS_ATTR_SETTINGS_DATA = '74e78e2c-c6a4-11e2-b7a9-0002a5d5c51b'

const WEATHER_UUIDS = new Set([
  '74e78e01-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e02-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e03-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e04-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e10-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e20-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e2c-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e14-c6a4-11e2-b7a9-0002a5d5c51b',
])

module.exports = class WeatherStation extends EventEmitter {
  constructor(address, ble) {
    super()
    this.address = address
    this.ble = ble || new Bluetooth()

    this.adapter = null
    this.device = null
    this.characteristics = null
  }

  async bind() {
    if (this.adapter) throw new Error('Already bound')

    const adapter = this.adapter = await this.ble.defaultAdapter()
    debug('selected adapter %s', adapter.toString())

    if (!adapter.discovering) {
      debug('discover not running, so start discovery')
      await adapter.startDiscovery()
    }

    await adapter.waitDevice(this.address)
    const device = this.device = await adapter.getDevice(this.address)
    debug('selected device %s', device.toString())
    device.on('connect', () => this.emit('connect'))
    device.on('disconnect', () => this.emit('disconnect'))

    await device.connect()
    debug('connected')

    const characteristics = this.characteristics = buildIndex(await device.characteristics(), c => c.UUID)
    for (const UUID in characteristics) {
      if (WEATHER_UUIDS.has(UUID)) {
        await characteristics[UUID].startNotify()
      }
    }

    characteristics[BLEWS_ATTR_INDOOR_AND_CH1_TO_3_TH_DATA].on('prop:value', value => {
      this.emit('data', decodeCH1toCH3(value))
    })
  }

  async unbind() {
    if (!this.adapter) throw new Error('Not bound')
    await this.adapter.stopDiscovery()
    await this.device.disconnect()
    this.device.removeAllListeners()
    this.characteristics[BLEWS_ATTR_INDOOR_AND_CH1_TO_3_TH_DATA].removeAllListeners()

    this.adapter = null
    this.device = null
    this.characteristics = null
  }

  async destroy() {
    await this.ble.destroy()
  }
}


function convTemp(int) {
  return int === 32767 ? null : int / 10
}

function decodeCH1toCH3(value) {
  const buffer = Buffer.from(value)
  switch (buffer[0]) {
    case 0x01:
      debug('ch1-3 decode 0x01', buffer)
      return {
        base_temp: convTemp(buffer.readInt16LE(1)),
        sensor1_temp: convTemp(buffer.readInt16LE(3)),
        sensor2_temp: convTemp(buffer.readInt16LE(5)),
        sensor3_temp: convTemp(buffer.readInt16LE(7)),
      }

    case 0x82:
      debug('ch1-3 decode 0x82', buffer)
      return {
        base_temp_max: convTemp(buffer.readInt16LE(4)),
        base_temp_min: convTemp(buffer.readInt16LE(6)),
        sensor1_temp_max: convTemp(buffer.readInt16LE(8)),
        sensor1_temp_min: convTemp(buffer.readInt16LE(10)),
        sensor2_temp_max: convTemp(buffer.readInt16LE(12)),
        sensor2_temp_min: convTemp(buffer.readInt16LE(14)),
        sensor3_temp_max: convTemp(buffer.readInt16LE(16)),
        sensor3_temp_min: convTemp(buffer.readInt16LE(18)),
      }
  }
}
