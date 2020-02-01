const Bluetooth = require('./src/Bluetooth')
const ADDRESS = 'D8:B6:F5:80:A1:C4'

async function main() {
  const ble = new Bluetooth()
  console.log(await ble.adapters())
  const adapter = await ble.defaultAdapter()

  if (!adapter.discovering) {
    await adapter.startDiscovery()
  }
  console.log(adapter.toString())

  await adapter.waitDevice(ADDRESS)

  // console.log(await adapter.devices())

  const device = await adapter.getDevice(ADDRESS)

  // console.log(device.props)

  await device.connect()

  console.log('connected', device.toString())

  const services = await device.services()


  const wholeChars = {}
  for (const service of services) {
    console.log(service.toString())
    const characteristics = await service.characteristics()

    for (const char of characteristics) {
      wholeChars[char.UUID] = char
      console.log(char.toString())
    }
    console.log('---------')
  }


  const weatherUUIDs = [
    '74e78e01-c6a4-11e2-b7a9-0002a5d5c51b',
    '74e78e02-c6a4-11e2-b7a9-0002a5d5c51b',
    '74e78e03-c6a4-11e2-b7a9-0002a5d5c51b',
    '74e78e04-c6a4-11e2-b7a9-0002a5d5c51b',
    '74e78e10-c6a4-11e2-b7a9-0002a5d5c51b',
    '74e78e20-c6a4-11e2-b7a9-0002a5d5c51b',
    '74e78e2c-c6a4-11e2-b7a9-0002a5d5c51b',
    '74e78e14-c6a4-11e2-b7a9-0002a5d5c51b',
  ]

  for (const UUID of weatherUUIDs) {
    wholeChars[UUID].startNotify()
  }


}


main()
  .then(console.log)
  .catch(console.error)
