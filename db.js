/** Database setup for BizTime. */

const dotenv = require('dotenv')
dotenv.config();
const { Client } = require ('pg')

let DB_URI

if (process.env.NODE_ENV === 'test') {
    DB_URI = process.env.DB_TEST_ROUTE
} else {
    DB_URI = process.env.DB_ROUTE
}

let db = new Client({
    connectionString: DB_URI
})

db.connect()

module.exports = db