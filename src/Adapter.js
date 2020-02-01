const BluezDBus = require("./BluezDBus")
const Device = require("./Device")
const IF_ADAPTER = 'org.bluez.Adapter1'

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = class Adapter extends BluezDBus {
  constructor(adapter, bus, path) {
    super(bus, `${path}/${adapter}`, IF_ADAPTER)
  }

  get address() {
    return this.props.Address
  }

  get addressType() {
    return this.props.AddressType
  }

  get name() {
    return this.props.Name
  }

  get alias() {
    return this.props.Alias
  }

  get powered() {
    return this.props.Powered
  }

  get discoverable() {
    return this.props.Discoverable
  }

  get discoverableTimeout() {
    return this.props.DiscoverableTimeout
  }

  get discovering() {
    return this.props.Discovering
  }

  get UUIDs() {
    return this.props.UUIDs
  }

  async startDiscovery() {
    await this.call('StartDiscovery')
  }

  async stopDiscovery() {
    await this.call('StopDiscovery')
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
      // console.debug(devices)
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
