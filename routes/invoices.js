const express = require('express')
const db = require('../db')
const ExpressError = require('../expressError.js')

let router = new express.Router()

//GET /invoices 
router.get('/', async function(req, res, next) {
    try {
        const result = await db.query('SELECT id, comp_code FROM invoices')
        return res.json({ invoices: result.rows })
    } catch (err) {
        return next(err)
    }
})

//GET /companies/[id]
router.get('/:id', async function(req, res, next) {
    try {
        const { id } = req.params
        const result = await db.query(
            `SELECT invoices.id, invoices.amt, invoices.paid, invoices.add_date, invoices.paid_date, companies.name, companies.description 
            FROM invoices 
            INNER JOIN companies 
            ON (invoices.comp_code = companies.code) 
            WHERE id = $1`
            , [id])
        
        if (result.rows.length === 0) {
            throw new ExpressError(`There is no invoice with id ${id}`, 404)
        }

        return res.status(201).json({ invoice: result.rows })

    } catch (err) {
        return next(err)
    }
})

//POST /invoices
router.post('/', async function(req, res, next) {
    try {
        let {comp_code, amt} = req.body
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2) 
            RETURNING id, amt, paid, add_date, paid_date`
            , [comp_code, amt])
        return res.status(201).json({ invoice: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

module.exports = router