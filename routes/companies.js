const express = require('express')
const db = require('../db')
const ExpressError = require('../expressError.js')

let router = new express.Router()

//GET /companies
router.get('/', async function(req, res, next) {
    try {
        const result = await db.query('SELECT code, name FROM companies')
        return res.json({companies: result.rows})
    } catch(err) {
        return next(err)
    }
})

//GET /companies/[code]
router.get('/:code', async function(req, res, next) {
    try {
        const result = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [req.params.code])

        if (result.rows.length === 0) {
            throw new ExpressError(`There is no company with code ${req.params.code}`, 404)
        }
        
        return res.status(201).json({ companies: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

//POST /companies
router.post('/', async function(req, res, next) {
    try {
        let {code, name, description} = req.body
        const result = await db.query(
            'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', 
            [code, name, description]
        )
        return res.status(201).json({ company: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

//PUT /companies
router.put('/:code', async function (req, res, next) {
    try {
        let code = req.params.code
        let {name, description} = req.body

        const result = await db.query(
            'UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description',
            [name, description, code]
        )
        if (result.rows.length === 0 ) {
            throw new ExpressError(`Can't update company with code of ${code}`, 404)
        }
        return res.send({ 'company': result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

//DELETE /companies
router.delete('/:code', async function (req, res, next) {
    try {
        let code = req.params.code

        const result = await db.query(
            'DELETE FROM companies WHERE code = $1', 
            [code]
        )
        if (result.rowCount === 0 ) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }
        return res.send({ msg: 'Deleted!' })
    } catch (err) {
        return next(err)
    }
})

module.exports = router;