# Property Backend

## Requirements

- `node`
- `yarn`
- `gdal-bin` (ogr2ogr)

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

## Production

### Install Dependencies

```
yarn
yarn global add pm2
```

### Run

```
pm2 start src/index.js
pm2 stop src/index.js
pm2 restart src/index.js
