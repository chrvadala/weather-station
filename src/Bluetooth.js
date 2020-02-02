const Adapter = require("./Adapter")
const dbus = require('dbus-next');

const BLUEZ_NAME = 'org.bluez'
const BLUEZ_PATH = '/org/bluez'

module.exports = class Bluetooth {
  constructor(bus, path) {
    this.bus = bus || dbus.systemBus();
    this.path = path || BLUEZ_PATH
  }

  async adapters() {
    const oBluez = await this.bus.getProxyObject(BLUEZ_NAME, this.path);
    return oBluez.nodes.map(path => path.substr(this.path.length + 1))
  }

  async defaultAdapter() {
    const adapters = await this.adapters()
    if (adapters.length === 0) {
      throw new Error('No Available adapters')
    }
    return await this.getAdapter(adapters[0])
  }

  async getAdapter(adapter) {
    const o = new Adapter(adapter, this.bus, this.path)
    await o.init()
    return o
  }

  async destroy(){
    await this.bus.disconnect()
  }
}


