# weather-station (WIP)
Connector able to download weather data from an Oregon Scientific EMR211X station, leveraging on Bluetooth Low Energy connection

# Example
````javascript
const WeatherStation = require('weather-station')
const {pause} = require('weather-station/src/utils')
const ADDRESS = '00:00:00:00:00:00' //bluetooth low energy address

async function main() {
  const station = new WeatherStation(ADDRESS)

  station.on('data', console.log)
  station.on('connect', () => console.log('connected'))
  station.on('disconnect', () => console.log('disconnected'))

  await station.bind()
  await pause(15000)
  await station.unbind()
}


main()
  .then(console.log)
  .catch(console.error)
````

# References
- https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/gatt-api.txt
- https://www.instructables.com/id/Connect-Raspberry-Pi-to-Oregon-Scientific-BLE-Weat/
