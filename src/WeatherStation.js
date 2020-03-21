const EventEmitter = require('events');
const {createBluetooth} = require('node-ble')
const debug = require('debug')('weather-station')

const SERVICE = '74e7fe00-c6a4-11e2-b7a9-0002a5d5c51b'
const CHARACTERISTICS = new Set([
  '74e78e01-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e02-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e03-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e04-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e10-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e20-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e2c-c6a4-11e2-b7a9-0002a5d5c51b',
  '74e78e14-c6a4-11e2-b7a9-0002a5d5c51b',
])

const CHARACTERISTIC_CH1_TO_3 = '74e78e10-c6a4-11e2-b7a9-0002a5d5c51b'

module.exports = class WeatherStation extends EventEmitter {
  constructor(adapter, address) {
    super()
    this.adapter = adapter
    this.address = address

    this.bound = false
    this.ready = false

    this._runningAdapter = null
    this._runningDevice = null
    this._destroy = null
  }

  async bind() {
    if (this.bound) throw new Error('Already bound')
    this.bound = true

    const {bluetooth, destroy} = createBluetooth()

    debug('getAdapter')
    const adapter = await bluetooth.getAdapter(this.adapter)

    debug('startDiscovery')
    await adapter.startDiscovery()

    debug('waitDevice')
    const device = await adapter.waitDevice(this.address)
    device.on('connect', () => this.emit('connect'))
    device.on('disconnect', () => this.emit('disconnect'))

    debug('connect')
    await device.connect()

    debug('get gatt server')
    const gattServer = await device.gatt()

    debug('get service')
    const service = await gattServer.getPrimaryService(SERVICE)

    for (const char of CHARACTERISTICS) {
      debug('start notification on %s', char)
      const characteristic = await service.getCharacteristic(char)
      await characteristic.startNotifications()
    }

    const characteristic = await service.getCharacteristic(CHARACTERISTIC_CH1_TO_3)
    characteristic.on('valuechanged', value => {
      debug('valued changed %s', value)
      this.emit('data', WeatherStation.decodeCH1toCH3(value))
    })

    this._runningAdapter = adapter
    this._runningDevice = device
    this._runningCharacteristic = characteristic
    this._destroy = destroy

    this.ready = true
  }

  async unbind() {
    if (!this.ready) throw new Error('Not ready')
    if (!this.bound) throw new Error('Not bound')

    await this._runningAdapter.stopDiscovery()
    await this._runningDevice.disconnect()
    await this._runningCharacteristic.removeAllListeners()
    this._destroy()

    this._runningAdapter = null
    this._runningDevice = null
    this._runningCharacteristic = null
    this.ready = false
    this.bound = false
  }

  static decodeCH1toCH3(buffer) {
    const convTemp = value => value === 32767 ? null : value / 10
    switch (buffer[0]) {
      case 0x01:
        debug('ch1-3 decode 0x01', buffer)
        return {
          type: 'current',
          base_temp: convTemp(buffer.readInt16LE(1)),
          sensor1_temp: convTemp(buffer.readInt16LE(3)),
          sensor2_temp: convTemp(buffer.readInt16LE(5)),
          sensor3_temp: convTemp(buffer.readInt16LE(7)),
        }

      case 0x82:
        debug('ch1-3 decode 0x82', buffer)
        return {
          type: 'minmax',
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
}
