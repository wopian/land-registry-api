const { readdir, readFileSync } = require('fs')
const { join, basename } = require('path')
const { cli } = require('cli-ux')
const OSPoint = require('ospoint')
const db = require('../src/database')

const action = cli.action
const geoJSON = join(__dirname, '../geoJSON')

const insert = db.prepare('REPLACE INTO landRegistry (inspireID, coordinates, latitude, longitude) VALUES (@inspireID, @coordinates, @latitude, @longitude)')

readdir(geoJSON, async (err, files) => {
    if (err) console.error(err)

    const fileCount = files.length

    for (const [i, file] of files.entries()) {
        const raw = readFileSync(join(geoJSON, file))
        const { features } = JSON.parse(raw)

        const featuresCount = features.length
        action.start(`${i + 1}/${fileCount} ${basename(file)} | Inserting GeoJSON features`)

        features.forEach(({ INSPIREID, coordinates }, index ) => {
            //action.start(`${i + 1}/${fileCount} ${basename(file)} | ${index + 1}/${featuresCount} Preparing data for insert`)

            // Data structured EASTING,NORTHING
            // Method wants NORTHING,EASTING
            const startPoint = new OSPoint(coordinates[0][0][1], coordinates[0][0][0])
            const { longitude, latitude } = startPoint.toWGS84()

            insert.run({
                inspireID: INSPIREID.toString(),
                coordinates: JSON.stringify(coordinates[0]),
                latitude,
                longitude
            })
        })
    }
})
