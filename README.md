# Property Backend

NodeJS backend artefact for the Enterprise Systems Development team-based coursework.

## Requirements

- `node`
- `yarn`
- `gdal-bin` (ogr2ogr for Linux)
- `osgeo4mac` (ogr2ogr for MacOS) or [KyngChaos DMGs](https://www.kyngchaos.com/software/frameworks/)
- [`osgeo4w`](https://trac.osgeo.org/osgeo4w/) (ogr2ogr for Windows)

## File Structure

```
land-registry-zips
    - Adur.zip
land-registry
    - Adur.gml
geoJSON
    - Adur.geojson
```

## Local Setup

### Install Dependencies

`yarn`

### Process Data

`yarn batch` or:

```
node bin/unzip // Extract from land-registry-zips
node bin/ogr2ogr // Converts into geoJSON
node bin/updateDB // Inserts geoJSON into database
```

### Run

`yarn start`

Opens web server on `localhost:8080` by default. Set custom port with `yarn start --port <port>`

## Production

### System Requirements

Unzipping files requires at least 1 GB of RAM available to the system.

All other aspects of the backend can run on 500 MB of RAM.

### Install Dependencies

```
yarn
yarn global add pm2
```

### Run

```
pm2 start src/index.js // Opens web server on port 80
pm2 stop src/index.js
pm2 restart src/index.js
```

### Cron Jobs

The `bin` tools can be set up as cron tasks with the following (e.g 1st day of every month)

```
pm2 start bin/updateDB --cron 0 0 1 * *
```
