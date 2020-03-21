# weather-station
Connector able to download weather data from an Oregon Scientific EMR211X station, leveraging on Bluetooth Low Energy connection

[![chrvadala](https://img.shields.io/badge/website-chrvadala-orange.svg)](https://chrvadala.github.io)
[![npm](https://img.shields.io/npm/v/weather-station.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/weather-station)
[![Downloads](https://img.shields.io/npm/dm/weather-station.svg)](https://www.npmjs.com/package/weather-station)
[![Donate](https://img.shields.io/badge/donate-PayPal-green.svg)](https://www.paypal.me/chrvadala/25)

## Install
```sh
yarn add weather-station
```

## Example
Before running the following script, configure your permissions https://github.com/chrvadala/node-ble#provide-permissions

````javascript
const WeatherStation = require('weather-station')
const ADAPTER = 'hci0'
const ADDRESS = '00:00:00:00:00:00' //Oregon Scientific EMR211X Bluetooth address

async function main() {
  const station = new WeatherStation(ADAPTER, ADDRESS)

  station.on('data', console.log)
  station.on('connect', () => console.log('connected'))
  station.on('disconnect', () => console.log('disconnected'))

  await station.bind()
  await new Promise(resolve => setTimeout(resolve, 5000))
  await station.unbind()
}

main()
  .then(console.log)
  .catch(console.error)
}
````

```sh
connected
{ base_temp: 21.6,
  sensor1_temp: -17.7,
  sensor2_temp: null,
  sensor3_temp: null }
{ base_temp_max: 23.7,
  base_temp_min: 20.3,
  sensor1_temp_max: 25.6,
  sensor1_temp_min: -19.3,
  sensor2_temp_max: null,
  sensor2_temp_min: null,
  sensor3_temp_max: null,
  sensor3_temp_min: null }
disconnected
```

## DEBUG
```sh
DEBUG=weather-station node example.js
```

## Changelog
- **0.x** - Beta version
- **1.0** - First official version

## Contributors
- [chrvadala](https://github.com/chrvadala) (author)

## References
- https://www.instructables.com/id/Connect-Raspberry-Pi-to-Oregon-Scientific-BLE-Weat/
- https://github.com/chrvadala/node-ble#references
