const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body')()
const db = require('./database')
const { nearestPositions, derivedPosition } = require('./util')

db.function('nearestPositions', { deterministic: true }, nearestPositions)

const selectInspireID = db.prepare('SELECT inspireID, coordinates FROM landRegistry WHERE inspireID=?')
const selectNearby = db.prepare('SELECT inspireID, coordinates, nearestPositions(latitude, @latitude, longitude, @longitude) AS distance FROM landRegistry WHERE latitude > @latitudeMin AND latitude < @latitudeMax AND longitude < @longitudeMax AND longitude > @longitudeMin AND distance < @radius ORDER BY distance LIMIT 0,@limit')


const server = new Koa()
const router = new Router()

router.get('/', ctx => {
    ctx.body = {
        api: {
            1: '/inspireid/:id',
            2: '/nearby/:latitude/:longitude'
        }
    }
})

// http://localhost:3001/inspireid/14835677
router.get('/inspireid/:id', bodyParser, async ctx => {
    const data = await selectInspireID.get(ctx.params.id)
    if (data) {
        data.coordinates = JSON.parse(data.coordinates)
        ctx.body = { data }
    } else {
        ctx.body = {
            error: {
                type: 'Invalid INSPIREID',
                message: `${ctx.params.id} is not a valid INSPIREID`
            }
        }
        ctx.status = 404
    }
})

// http://localhost:3001/nearby/51.6245033595047/-3.93390545244112?limit=500&radius=1000m
router.get('/nearby/:latitude/:longitude', async ctx => {
    // Sanitise inputs and set defaults
    const limit = (ctx.query.limit > 0 && ctx.query.limit <= 5000) ? ctx.query.limit : 100
    const radius = (ctx.query.radius > 0 && ctx.query.radius <= 1000) ? ctx.query.radius / 1000 : 0.1
    const latitude = parseFloat(ctx.params.latitude)
    const longitude = parseFloat(ctx.params.longitude)

    // Create bounding box to search within before calculating the (accurate) distance
    const latitudeMax = derivedPosition(latitude, longitude, 1100 * (radius * radius), 0).lat
    const longitudeMax = derivedPosition(latitude, longitude, 1100 * (radius * radius), 90).long
    const latitudeMin = derivedPosition(latitude, longitude, 1100 * (radius * radius), 180).lat
    const longitudeMin = derivedPosition(latitude, longitude, 1100 * (radius * radius), 270).long

    const data = await selectNearby.all({
        latitude,
        longitude,
        radius: radius * radius,
        limit,
        latitudeMax,
        longitudeMax,
        latitudeMin,
        longitudeMin
    })

    if (data) {
        data.forEach(item => {
            item.coordinates = JSON.parse(item.coordinates)
            item.inspireID
            item.distance = Number((1000 * item.distance).toFixed(1)) // meters
        })
        ctx.body = {
            data,
            meta: {
                total: data.length
            }
        }
    } else {
        ctx.body = {}
    }
})

const args = process.argv.slice(2)
const port = args[0] === '--port' ? args[1] : 80

server.use(router.routes())
server.listen(port)
