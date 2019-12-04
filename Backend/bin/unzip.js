const { readdir, writeFileSync } = require('fs')
const { emptyDirSync } = require('fs-extra')
const { join, basename, extname } = require('path')
const { cli } = require('cli-ux')
const Adm = require('adm-zip')

const action = cli.action
const landRegistry = join(__dirname, '../land-registry')
const landRegistryZips = join(__dirname, '../land-registry-zips')
const EXTENSION = '.zip'

// Clear directory of existing GML data
emptyDirSync(landRegistry)

readdir(landRegistryZips, async (err, files) => {
    if (err) return console.error('Unable to scan directory:', err)

    // Filter returned files to only get ZIP files
    const filteredFiles = files.filter(file => extname(file).toLowerCase() === EXTENSION)

    const fileCount = filteredFiles.length
    action.start(`0/${fileCount} Unzipping files`)

    for (const [i, file] of filteredFiles.entries()) {
        const name = basename(file, extname(file))

        action.start(`${i + 1}/${fileCount} Unzipping ${name}`)

        try {
            const zip = new Adm(join(landRegistryZips, file))
            const zipEntries = zip.getEntries()

            zipEntries.forEach(zipEntry => {
                if (zipEntry.entryName === 'Land_Registry_Cadastral_Parcels.gml') {
                    action.start(`${i + 1}/${fileCount} Extracting ${name}'s GML data`)

                    const fileData = zipEntry.getData()
                    const fileName = `${name}.gml`
                    const filePath = join(landRegistry, fileName)

                    writeFileSync(filePath, fileData, err => {
                        if (err) console.error(err)
                    })
                }
            })
        } catch (err) {
            console.log(`${name}: ${err}`)
        }
    }
})
