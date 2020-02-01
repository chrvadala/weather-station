const IF_PROPS = 'org.freedesktop.DBus.Properties'
const BLUEZ_NAME = 'org.bluez'

module.exports = class BluezDBus {
  constructor(bus, path, iface) {
    this.bus = bus
    this.path = path
    this.iface = iface

    this.ifaceProxy = null
    this.propsProxy = null
    this.props = {}
  }

  async init() {
    const objectProxy = await this.bus.getProxyObject(BLUEZ_NAME, this.path);
    const ifaceProxy = await objectProxy.getInterface(this.iface)
    const propsProxy = await objectProxy.getInterface(IF_PROPS)

    propsProxy.on('PropertiesChanged', (iface, changedProps, invalidated) => {
      console.debug(iface, changedProps, invalidated)
      if (iface !== this.iface) return
      for (const propKey in changedProps) {
        this.props[propKey] = changedProps[propKey].value
      }
    })
    const props = await propsProxy.GetAll(this.iface)
    for (const propKey in props) {
      this.props[propKey] = props[propKey].value
    }
    // console.debug(this.props)

    this.objectProxy = objectProxy
    this.ifaceProxy = ifaceProxy
    this.propsProxy = propsProxy
  }

  async call(method, ...args) {
    return this.ifaceProxy[method]()
  }
}
