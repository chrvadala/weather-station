const BluezDBus = require("./BluezDBus")
const Service = require("./Service")

const IF_DEVICE = 'org.bluez.Device1'

module.exports = class Device extends BluezDBus {
  constructor(device, bus, path) {
    device = `dev_${device.replace(/:/g, '_')}`
    super(bus, `${path}/${device}`, IF_DEVICE)
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

  get paired() {
    return this.props.paired
  }

  get trusted() {
    return this.props.trusted
  }

  get blocked() {
    return this.props.blocked
  }

  get legacyPairing() {
    return this.props.legacyPairing
  }

  get RSSI() {
    return this.props.RSSI
  }

  get connected() {
    return this.props.connected
  }

  get UUIDs() {
    return this.props.UUIDs
  }

  get servicesResolved() {
    return this.props.servicesResolved
  }

  async connect() {
    this.call('connect')
    this.emit('connect')
  }

  async disconnect() {
    this.call('disconnect')
    this.emit('disconnect')
  }

  async pair() {
    this.call('pair')
  }

  async cancelPair() {
    this.call('cancelPair')
  }

  async services() {
    //TODO wait services resolved
    const serviceObjs = this.objectProxy.nodes
      .map(path => new Service(this.bus, path))

    for (const obj of serviceObjs) {
      await obj.init()
    }

    return serviceObjs
  }

  async characteristics(){
    const chars = []
    const services = await this.services()
    for (const service of services) {
      const characteristics = await service.characteristics()
      chars.push(...characteristics)
    }
    return chars
  }

  toString() {
    return `${this.name} [${this.address}]`
  }
}
