const BluezDBus = require("./BluezDBus")
const Characteristic = require("./Characteristic")

const IF_GATT_SERVICE = 'org.bluez.GattService1'

module.exports = class Service extends BluezDBus {
  constructor(bus, path) {
    super(bus, path, IF_GATT_SERVICE)
  }

  get primary() {
    return this.props.Primary
  }

  get UUID() {
    return this.props.UUID
  }

  async characteristics() {
    const charObjs = this.objectProxy.nodes
      .map(path => new Characteristic(this.bus, path))

    for (const obj of charObjs) {
      await obj.init()
    }

    return charObjs
  }

  toString() {
    return this.UUID
  }
}
