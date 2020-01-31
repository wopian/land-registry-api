const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body')()
const db = require('./database')

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
    const sql = db.prepare('SELECT inspireID, coordinates FROM landRegistry WHERE (latitude-@latitude)*(latitude-@latitude) + (longitude-@longitude)*(longitude-@longitude) < @radius*@radius LIMIT @limit')
    
    const limit = (ctx.query.limit > 0 && ctx.query.limit <= 500) ? ctx.query.limit : 200
    const radius = {
        '100m': 0.00053995244,
        '200m': 0.00107995244,
        '500m': 0.00269975244,
        '1000m': 0.00539955244
    }[ctx.query.radius || 0.00053995244] // 100m default
    
    const data = sql.all({
        longitude: parseFloat(ctx.params.longitude),
        latitude: parseFloat(ctx.params.latitude),
        radius,
        limit 
    })
    if (data) {
        data.forEach(item => {
            item.coordinates = JSON.parse(item.coordinates)
            item.inspireID 
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

server.use(router.routes())
server.listen(80)
