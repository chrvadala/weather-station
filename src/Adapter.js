const BluezDBus = require("./BluezDBus")
const Device = require("./Device")
const IF_ADAPTER = 'org.bluez.Adapter1'
const {pause} = require('./utils')
const debug = require('debug')('weather-sensors')

module.exports = class Adapter extends BluezDBus {
  constructor(adapter, bus, path) {
    super(bus, `${path}/${adapter}`, IF_ADAPTER)
  }

  get address() {
    return this.props.address
  }

  get addressType() {
    return this.props.addressType
  }

  get name() {
    return this.props.name
  }

  get alias() {
    return this.props.alias
  }

  get powered() {
    return this.props.powered
  }

  get discoverable() {
    return this.props.discoverable
  }

  get discoverableTimeout() {
    return this.props.discoverableTimeout
  }

  get discovering() {
    return this.props.discovering
  }

  get UUIDs() {
    return this.props.UUIDs
  }

  async startDiscovery() {
    await this.call('startDiscovery')
  }

  async stopDiscovery() {
    await this.call('stopDiscovery')
  }

  async devices() {
    return this.objectProxy.nodes
      .map(path => path
        .substr(this.path.length + 1 + 'dev_'.length)
        .replace(/_/g, ':')
      )
  }

  async waitDevice(device) {
    let found = false
    while (!found) {
      const devices = await this.devices()
      debug('devices found %o', devices)
      found = devices.includes(device)
      await pause(1000)
    }
  }

  async getDevice(address) {
    const o = new Device(address, this.bus, this.path)
    await o.init()
    return o
  }

  toString() {
    return `${this.name} [${this.address}]`
  }
}
