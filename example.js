const WeatherStation = require('./src/WeatherStation')
const ADAPTER = 'hci0'
const ADDRESS = 'D8:B6:F5:80:A1:C4'

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
