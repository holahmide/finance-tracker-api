const jwt = require("jsonwebtoken");
const Op = require('sequelize').Op;
const bcrypt = require("bcryptjs");
const { User, Spendings, Borrowed, Lent, Limit } = require('../models')
const config = require('../config/config')



class LimitController {
    static async create(req, res) {
        const payload = req.body;
        // Validate payload
        if(!payload.from || !payload.to || !payload.amount){
            return res.status(400).send({status: 'failed', message : 'Validation error'})
        }
        
        try {
            let setAllToFalse = await Limit.update(
                {
                    "status" : false,
                },
                {
                 where : { user_id : req.user.id, status : true }
                }
            )

            req.body.status = true
            req.body.user_id = req.user.id

            let createLimit = await Limit.create(req.body)

            res.status(200).send({
                status : "success",
                message : "Successfully created limit",
                limit : createLimit
            })

        } catch (error){
            return res.status(400).send({
                status : 'failed',
                message : error || 'Server Error, please try again!',
            })
        }
    }

    static async edit(req, res) {
        const payload = req.body;
        // Validate payload
        if(!payload.from || !payload.to || !payload.amount){
            return res.status(400).send({status: 'failed', message : 'Validation error'})
        }

        // req.body.status = true

        try {
            if(req.body.status){
                let setAllToFalse = await Limit.update(
                    {
                        "status" : false,
                    },
                    {
                     where : { user_id : req.user.id, status : true }
                    }
                )
            }

            let updateLimit = await Limit.update(
                req.body,
                {
                 where : { user_id : req.user.id, id : req.params.id }
                }
            )

            res.status(200).send({
                status : "success",
                limit : updateLimit,
                message : "updated Successfully"
            })

        } catch (error){
            return res.status(400).send({
                status : 'failed',
                message : error || 'Server Error, please try again!',
            })
        }
    }

    static async index(req, res) {
        const limits = await Limit.findAll({ where : {user_id : req.user.id} });
        const activeLimits = await Limit.findAll({ where : {user_id : req.user.id, status : true} });
        if(activeLimits.length > 0){
            let limit = limits[(activeLimits.length) - 1]
            try {
                let spendings = await Spendings.findAll({ where : {user_id : req.user.id} });
                let borroweds = await Borrowed.findAll({ where : {user_id : req.user.id, spending_id : null} });
                let lents = await Lent.findAll({ where : {user_id : req.user.id, spending_id : null} });

                let expenses = []
                let i = 0
                for (i=0;i < spendings.length; i++){
                    if(Date.parse(spendings[i].date) >  Date.parse(limit.from) && Date.parse(spendings[i].date) <=  Date.parse(limit.to))
                    {
                        const expense = {
                            amount : spendings[i].amount,
                            date : spendings[i].date,
                            type : 'spent'
                        }
                        expenses.push(expense)
                    }
                }

                for (i=0;i < borroweds.length; i++){
                    if(Date.parse(borroweds[i].date) >=  Date.parse(limit.from) && Date.parse(borroweds[i].date) <=  Date.parse(limit.to))
                    {
                        const expense = {
                            amount : borroweds[i].amount,
                            date : borroweds[i].date,
                            type : 'borrowed'
                        }
                        expenses.push(expense) 
                    }
                }

                for (i=0;i < lents.length; i++){
                    if(Date.parse(lents[i].date) >=  Date.parse(limit.from) && Date.parse(lents[i].date) <=  Date.parse(limit.to))
                    {
                        const expense = {
                            amount : lents[i].amount,
                            date : lents[i].date,
                            type : 'lent'
                        }
                        expenses.push(expense)
                    }
                }

                expenses.sort(function(a, b) {
                    return new Date(b.date) - new Date(a.date)
                })

                // expenses = expenses.reverse()
                let overshoots = []
                let total = 0
                for (i=0;i < expenses.length;i++) {
                    if(Number(expenses[i].amount) > Number(limit.amount)){
                        const overshoot = {
                            amount : expenses[i].amount,
                            difference :  Number(limit.amount) - Number(expenses[i].amount),
                            credit : false, // indicates failure
                            type : expenses[i].type,
                            date : expenses[i].date
                        }
                        total += expenses[i].amount;
                        overshoots.push(overshoot)
                    } 
                    else if (Number(expenses[i].amount) <= Number(limit.amount)) {
                        const overshoot = {
                            amount : expenses[i].amount,
                            difference :  Number(limit.amount) - Number(expenses[i].amount),
                            credit : true, // indicates success
                            type : expenses[i].type,
                            date : expenses[i].date
                        }
                        total -= expenses[i].amount;
                        overshoots.push(overshoot)
                    }
                } 

                const result = {
                    records : overshoots,
                    total : total,
                    limit : limit
                }

                res.status(200).send({
                    status : "success",
                    overshoots : result,
                    limits : limits
                })

            } catch (error) {
                return res.status(400).send({
                    status : 'failed',
                    message : error || 'Server Error, please try again!',
                })
            }
        }
        else {
            const result = {
                records : [],
                total : 0,
                limit : {}
            }
            res.status(200).send({
                overshoots : result,
                limits : limits,
                status : 'success',
                message : 'No limit record found'
            })
        }
    }
  
}

module.exports = LimitController;
