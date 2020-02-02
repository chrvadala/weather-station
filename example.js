const WeatherStation = require('./src/WeatherStation')
const {pause} = require('./src/utils')
const ADDRESS = 'D8:B6:F5:80:A1:C4'

async function main() {
  const station = new WeatherStation(ADDRESS)

  station.on('data', console.log)
  station.on('connect', () => console.log('connected'))
  station.on('disconnect', () => console.log('disconnected'))

  await station.bind()
  await pause(15000)
  await station.unbind()
  //
  // await station.destroy()
}


main()
  .then(console.log)
  .catch(console.error)
