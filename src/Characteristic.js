const BluezDBus = require("./BluezDBus")

const IF_GATT_CHAR = 'org.bluez.GattCharacteristic1'

module.exports = class Characteristic extends BluezDBus {
  constructor(bus, path) {
    super(bus, path, IF_GATT_CHAR)
  }

  get value() {
    return this.props.Value
  }

  get flags() {
    return this.props.Flags
  }

  get notifying() {
    return this.props.Notifying
  }

  get UUID() {
    return this.props.UUID
  }

  toString() {
    return this.UUID
  }

  async startNotify() {
    await this.call('StartNotify')
  }

  async stopNotify() {
    await this.call('StopNotify')
  }
}
