const express = require('express')
const db = require('../db')
const ExpressError = require('../expressError.js')

let router = new express.Router()

//GET /industries
router.get('/', async function(req, res, next) {
    try {
        const result = await db.query('SELECT code, industry FROM industries')
        return res.json({industries: result.rows})
    } catch(err) {
        return next(err)
    }
})

//POST /industries
router.get('/', async function(req, res, next) {
    try {
        let {code, industry} = req,body

        const result = await db.query(
            'INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry',
            [code, industry]
        )
        return res.status(201).json({ industry: result.rows[0] })
    } catch(err) {
        return next(err)
    }
})
