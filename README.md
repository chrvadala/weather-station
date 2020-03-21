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
- **0.x** - WIP - Work In Progress

## Contributors
- [chrvadala](https://github.com/chrvadala) (author)

## References
- https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/gatt-api.txt
- https://www.instructables.com/id/Connect-Raspberry-Pi-to-Oregon-Scientific-BLE-Weat/

## Troubleshooting
### Permission Denied
Adds the following file into `/etc/dbus-1/system.d/bluetooth.conf`

```
<policy user="<insert-user-here>">
  <allow own="org.bluez"/>
  <allow send_destination="org.bluez"/>
  <allow send_interface="org.bluez.GattCharacteristic1"/>
  <allow send_interface="org.bluez.GattDescriptor1"/>
  <allow send_interface="org.freedesktop.DBus.ObjectManager"/>
  <allow send_interface="org.freedesktop.DBus.Properties"/>
</policy>
```

Then `sudo systemctl restart bluetooth`
