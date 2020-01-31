const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body')()
const db = require('./database')

const server = new Koa()
const router = new Router()

router.get('/', ctx => {
    ctx.body = {
        api: {
            1: "/inspireid/:id",
            2: "/nearby/:latitude/:longitude",
            3: "/nearby/:latitude/:longitude/:limit"
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
            error: "INSPIREID does not exist"
        }
        ctx.status = 404
    }
})

// http://localhost:3001/nearby/51.6245033595047/-3.93390545244112
// http://localhost:3001/nearby/51.6245033595047/-3.93390545244112/2
router.get('/nearby/:latitude/:longitude/:limit?', async ctx => {
    // miles = 3959; km = 6371
    //const sql = db.prepare('SELECT inspireID, ( 3959 & acos(cos(radians(@latitude)) * cos(radians(latitude)) * cos(radians(longitude) - radians(@longitude)) + sin(radians(@latitude)) * sin(radians(latitude)))) AS distance FROM landRegistry HAVING distance < 1 ORDER BY distance LIMIT 0, 20')
    //const sql = db.prepare('SELECT * from landRegistry WHERE latitude != 0 AND latitude BETWEEN (@latitude - @radius) AND (@latitude + @radius) AND longitude BETWEEN (@longitude - @radius) AND (@longitude + @radius) ORDER BY abs(@latitude - latitude) + abs(@longitude - longitude) ASC limit 20')
    //const sql = db.prepare('SELECT inspireID, coordinates from landRegistry ORDER BY (latitude - @latitude) * (latitude - @latitude) + ((longitude - @longitude) * @radius) * ((longitude - @longitude) * @radius) ASC limit @limit')
    
    const sql = db.prepare('SELECT inspireID, coordinates FROM landRegistry WHERE (latitude-@latitude)*(latitude-@latitude) + (longitude-@longitude)*(longitude-@longitude) < @radius*@radius')
    
    const limit = (ctx.params.limit > 0 && ctx.params.limit <= 500) ? ctx.params.limit : 500
    const data = sql.all({
        longitude: parseFloat(ctx.params.longitude),
        latitude: parseFloat(ctx.params.latitude),
        // Original 0.005 (approx 92m)
        // 0.00053995244 = ~100m
        // 0.00107995244 = ~200m
        radius: 0.00107995244,
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

/*
db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)")

    const statement = db.prepare("INSERT INTO lorem VALUES (?)")
    for (let i = 0; i < 10; i++) {
        statement.run(`Ipsum ${i}`)
    }
    statement.finalize()

    db.each("SELECT rowid as id, info FROM lorem", (err, row) => {
        console.log(`${row.id}: ${row.info}`)
    })
})

db.close()
*/
