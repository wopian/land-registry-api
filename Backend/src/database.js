const Database = require('better-sqlite3')

const db = new Database('database/property.db', { 
    verbose: console.log,
    fileMustExist: false
})

db.pragma('journal_mode = WAL')

const tableName = "landRegistry"
const tableColumns = "inspireID TEXT PRIMARY KEY, coordinates TEXT NOT NULL, latitude TEXT NOT NULL, longitude TEXT NOT NULL"
const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${tableColumns})`)
createTable.run()

// TODO: Create Index for lat/long
//`CREATE INDEX landRegistry_lat_lng ON landRegistry (latitude, longitude)`

module.exports = db