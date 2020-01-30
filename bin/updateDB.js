const { readdir, readFileSync } = require('fs')
const { join, basename } = require('path')
const { cli } = require('cli-ux')
const db = require('../src/database')
const OSPoint = require('ospoint')

const action = cli.action
const geoJSON = join(__dirname, '../geoJSON')

const insert = db.prepare('REPLACE INTO landRegistry (inspireID, coordinates, latitude, longitude) VALUES (@inspireID, @coordinates, @latitude, @longitude)')

readdir(geoJSON, async (err, files) => {
    if (err) console.error(err)

    const fileCount = files.length
    action.start(`0/${fileCount} Inserting GeoJSON files into database`)

    for (const [i, file] of files.entries()) {
        const raw = readFileSync(join(geoJSON, file))
        const { features } = JSON.parse(raw)

        const featuresCount = features.length
        action.start(`${i + 1}/${fileCount} ${basename(file)} | 0/${featuresCount} Inserting features into database`)

        features.forEach(({ INSPIREID, coordinates }, index ) => {
            action.start(`${i + 1}/${fileCount} ${basename(file)} | ${index + 1}/${featuresCount} Inserting features into database`)

            // Data structured EASTING,NORTHING
            // Method wants NORTHING,EASTING
            const startPoint = new OSPoint(coordinates[0][0][1], coordinates[0][0][0])
            const { longitude, latitude } = startPoint.toWGS84()
            // console.log(coordinates[0][0])
            
            insert.run({
                inspireID: INSPIREID,
                coordinates: JSON.stringify(coordinates[0]),
                latitude,
                longitude
            })

            //console.log(db.prepare('SELECT * FROM landRegistry').get())
        })

        //console.log('Stopped at file 1')
        //process.exit(22)
    }
})