const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body')()
const db = require('./database')

function radians(degrees) {
    return degrees * (Math.PI / 180)
}

db.function('getNearest', { deterministic: true }, (latDB, lat, longDB, long) => 6371 * Math.acos(
    Math.cos(radians(lat)) *
    Math.cos(radians(latDB)) *
    Math.cos(radians(longDB) - radians(long)) +
    Math.sin(radians(lat)) *
    Math.sin(radians(latDB))
))

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
    const sql = db.prepare('SELECT inspireID, coordinates FROM landRegistry WHERE inspireID=?')
    const data = await sql.get(ctx.params.id)
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
    //const sql = db.prepare('EXPLAIN QUERY PLAN SELECT inspireID, coordinates FROM landRegistry WHERE (latitude-@latitude)*(latitude-@latitude) + (longitude-@longitude)*(longitude-@longitude) < @radius LIMIT @limit')
    const sql = db.prepare('SELECT inspireID, coordinates, getNearest(latitude, @latitude, longitude, @longitude) AS distance FROM landRegistry WHERE distance < @radius ORDER BY distance LIMIT 0,@limit')

    const limit = (ctx.query.limit > 0 && ctx.query.limit <= 500) ? ctx.query.limit : 200
    const radius = (ctx.query.radius > 0 && ctx.query.radius <= 1000) ? ctx.query.radius / 1000 : 0.1

    const data = sql.all({
        longitude: parseFloat(ctx.params.longitude),
        latitude: parseFloat(ctx.params.latitude),
        radius: radius * radius,
        limit
    })
    if (data) {
        data.forEach(item => {
            item.coordinates = JSON.parse(item.coordinates)
            item.inspireID
            item.distance = ~~(item.distance * 1000) // meters
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
