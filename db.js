/** Database setup for BizTime. */

const { Client } = require ('pg')

let DB_URI

if (process.env.NODE_ENV === 'test') {
    DB_URI = 'postgresql://thisenemy:TurtlesAllTheWayDown...@localhost/biztime_test'
} else {
    DB_URI = 'postgresql://thisenemy:TurtlesAllTheWayDown...@localhost/biztime'
}

let db = new Client({
    connectionString: DB_URI
})

db.connect()

module.exports = db