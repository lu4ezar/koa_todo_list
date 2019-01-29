const mongoose = require('mongoose')
const { url, database } = require('./config.json')

const dbPath = `mongodb://${url}/${database}`

mongoose
  .connect(dbPath, { useNewUrlParser: true })
  .catch(err => console.log('mongoose connect error, mongodb is unavailable'))

const db = mongoose.connection

db.once('open', () => console.log('db connection ok'))
  .on('disconnected', () => console.log('db disconnected'))
  .on('close', () => console.log('Database connection closed.'))
process.on('SIGINT', () => {
  db.close(() => {
    console.log('connection closed app terminated')
    process.exit(0)
  })
})

exports.dropCollection = col => {
  db.dropCollection(col)
    .then(col => console.log(`collection ${col} was dropped`))
    .catch(err =>
      console.log(`collection was not dropped, there is an error: ${err}`)
    )
}
