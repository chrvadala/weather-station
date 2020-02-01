const BluezDBus = require("./BluezDBus")
const Service = require("./Service")

const IF_DEVICE = 'org.bluez.Device1'

module.exports = class Device extends BluezDBus {
  constructor(device, bus, path) {
    device = `dev_${device.replace(/:/g, '_')}`
    super(bus, `${path}/${device}`, IF_DEVICE)
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

  get paired() {
    return this.props.Paired
  }

  get trusted() {
    return this.props.Trusted
  }

  get blocked() {
    return this.props.Blocked
  }

  get legacyPairing() {
    return this.props.LegacyPairing
  }

  get RSSI() {
    return this.props.RSSI
  }

  get connected() {
    return this.props.Connected
  }

  get UUIDs() {
    return this.props.UUIDs
  }

  get servicesResolved() {
    return this.props.ServicesResolved
  }

  async connect() {
    this.call('Connect')
  }

  async disconnect() {
    this.call('Disconnect')
  }

  async pair() {
    this.call('Pair')
  }

  async cancelPair() {
    this.call('cancelPair')
  }

  async services() {
    const serviceObjs = this.objectProxy.nodes
      .map(path => new Service(this.bus, path))

    for (const obj of serviceObjs) {
      await obj.init()
    }

    return serviceObjs
  }

  toString() {
    return `${this.name} [${this.address}]`
  }
}
