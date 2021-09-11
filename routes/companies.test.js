//jest test file for /companies route

process.env.NODE_ENV = "test";

const request = require('supertest')

const app = require('../app')
const db = require('../db')

let testCompany

beforeEach(async function() {
    let result = await db.query(`
        INSERT INTO 
        companies (code, name, description) VALUES ('test', 'TestCompany', 'this is a test') 
        RETURNING code, name, description`)
    testCompany = result.rows[0]
})

//GET /companies

describe('GET /companies', function() {
    test('Gets a list of companies', async function() {
        const resp = await request(app).get('/companies')
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            companies: [testCompany]
        })
    })
})

//GET /companies/:code
describe('GET /companies:code', function() {
    test('Gets a list of info on company with matching code', async function() {
        const resp = await request(app).get(`/companies/${testCompany.code}`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({companies: testCompany})
    })

    test(`Responds with 404 if can't find company`, async function() {
        const resp = await request(app).get(`/companies/0`)
        expect(response.statusCode).toEqual(404)
    })
})

//POST /companies/:code
describe('POST /companies:code', function() {
    test('Creates a new company', async function() {
        const resp = await request(app)
            .post('/companies')
            .send({
                code: "test2",
                name: "TestCompany2",
                description: "this is a test2"
            })
        expect(resp.statusCode).toEqual(201)
        expect(resp.body).toEqual({
            company: {
                code: expect.any(String), 
                name: expect.any(String),
                description: expect.any(String)
            }
        })
    })
})

//PUT /companies/:code
describe('PUT /companies:code', function() {
    test('Updates a single company', async function() {
        const resp = await request(app)
        .put(`/companies/${testCompany.code}`)
        .send({
            code: "test3",
            name: "TestCompany3",
            description: "this is a test3"
        })
    })

    test('Responds with 404 if no company is found', async function() {
        const resp = await request(app).patch('/companies/0')
        expect(resp.statusCode).toEqual(404)
    })
})

//DELETE /companies/:code
describe('DELETE /companies/code:', function() {
    test('Deletes a single company', async function() {
        const resp = await request(app)
            .delete(`/companies/${testCompany.code}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual({ msg: 'Deleted!' })
    })
})

afterEach(async function() {
    await db.query("DELETE FROM companies")
})

afterAll(async function() {
    await db.end()
})