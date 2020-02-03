const Database = require('better-sqlite3')

const db = new Database('database/property.db', {
    // verbose: console.log,
    fileMustExist: false
})

db.pragma('journal_mode = WAL')

const tableName = "landRegistry"
const tableColumns = "inspireID TEXT PRIMARY KEY, coordinates TEXT NOT NULL, latitude DOUBLE NOT NULL, longitude DOUBLE NOT NULL"
const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${tableColumns})`)
createTable.run()

const indexInspire = db.prepare('CREATE INDEX IF NOT EXISTS landRegistry_inspireID ON landRegistry (inspireID ASC)')
indexInspire.run()

const indexLatLng = db.prepare('CREATE INDEX IF NOT EXISTS landRegistry_lat_lng ON landRegistry (latitude ASC, longitude ASC)')
indexLatLng.run()

module.exports = db
