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

//GET /invoices/[id]
router.get('/:id', async function(req, res, next) {
    try {
        let comOut, invOut
        const { id } = req.params
        const invResult = await db.query(
            'SELECT id, amt, paid, add_date, paid_date, comp_code FROM invoices WHERE id = $1', [id])
        
        const code = invResult.rows[0].comp_code
        console.log(invResult.rows[0])
        console.log(code)

        const comResult = await db.query(
            'SELECT code, name, description FROM companies WHERE code = $1', [code]
        )


        if (invResult.rows.length === 0) {
            throw new ExpressError(`There is no invoice with id ${id}`, 404)
        } else {
            let invData = invResult.rows[0]
            invOut = {
                id: invData.id,
                amt: invData.amt,
                paid: invData.paid,
                add_date: invData.add_date,
                paid_date: invData.paid_date
            }
        }

        if (comResult.rows.length === 0) {
            comOut = "Not found"
        } else {
            comOut = comResult.rows[0]
        }

        const output = { invoice: invOut, company: comOut }
        return res.status(201).json(output)

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

//PUT /invoices/id
router.put('/:id', async function(req, res, next) {
    try {
        let {id} = req.params
        let {amt} = req.body

        const result = await db.query(
            `UPDATE invoices 
            SET amt = $1
            WHERE id = $2
            REUTRNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, id]
        )
        if (result.rows.length === 0) {
            throw new ExpressError(`No invoice with id of ${id} found`, 404)
        }
        return res.send({ invoice: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

//DELETE /invoices
router.delete('/:id', async function(req, res, next) {
    try {
        let {id} = req.params

        const result = await db.query(
            'DELETE FROM invoices WHERE id = $1',
            [id]
        )
        if (result.rowCount === 0) {
            throw new ExpressError(`No invoice with id of ${id} found`, 404)
        }
        return res.send({ status: 'deleted' })
    } catch (err) {
        return next(err)
    }
})

module.exports = router