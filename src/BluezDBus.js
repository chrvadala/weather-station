const EventEmitter = require('events');
const {upperFirst} = require("./utils");
const {lowerFirst} = require("./utils");
const debug = require('debug')('weather-sensors')

const IF_PROPS = 'org.freedesktop.DBus.Properties'
const BLUEZ_NAME = 'org.bluez'

module.exports = class BluezDBus extends EventEmitter {
  constructor(bus, path, iface) {
    super()
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
      debug('changed props on %s -> %o', iface, changedProps)
      if (iface !== this.iface) return
      for (const propKey in changedProps) {
        const lowerPropKey = lowerFirst(propKey)
        const value = changedProps[propKey].value
        this.props[lowerPropKey] = value
        this.emit(`prop:${lowerPropKey}`, value)
      }
    })
    const props = await propsProxy.GetAll(this.iface)
    for (const propKey in props) {
      this.props[lowerFirst(propKey)] = props[propKey].value
    }
    debug('found props %o', props)

    this.objectProxy = objectProxy
    this.ifaceProxy = ifaceProxy
    this.propsProxy = propsProxy
  }

  async call(method, ...args) {
    return this.ifaceProxy[upperFirst(method)]()
  }
}
