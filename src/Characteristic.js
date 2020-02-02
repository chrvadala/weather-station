const BluezDBus = require("./BluezDBus")

const IF_GATT_CHAR = 'org.bluez.GattCharacteristic1'

module.exports = class Characteristic extends BluezDBus {
  constructor(service, bus, path) {
    super(bus, path, IF_GATT_CHAR)
    this._service = service
  }

  get value() {
    return this.props.value
  }

  get flags() {
    return this.props.flags
  }

  get notifying() {
    return this.props.notifying
  }

  get UUID() {
    return this.props.UUID
  }

  get service(){
    return this._service.UUID
  }

  toString() {
    return`${this.service} > ${this.UUID}`
  }

  async startNotify() {
    await this.call('startNotify')
  }

  async stopNotify() {
    await this.call('stopNotify')
  }
}
