const jwt = require("jsonwebtoken");
const Op = require('sequelize').Op;
const bcrypt = require("bcryptjs");
const { User, Spendings, Breakdown, Borrowed, Lent } = require('../models')
const config = require('../config/config')



class SpendingsController {
    static async create (req, res) {
        const payload = req.body;
        // Validate payload
        if(!payload.amount && !payload.date){
            return res.status(400).send({status: 'failed', message : 'Validation error'})
        }

        // req.body.user_id = req.user.id
        try {
            // create spendings instance
            let spendings = {
                user_id : req.user.id,
                amount : req.body.amount,
                date : req.body.date
            }
            const createSpending = await Spendings.create(spendings);

            var counter = 0
            let all_breakdowns = []
            //Check if breakdown
            if(req.body.breakdowns.length > 0){
                let breakdowns = req.body.breakdowns
                for(counter = 0; counter < breakdowns.length; counter++){
                    breakdowns[counter].spending_id = createSpending.id
                }
                const createBreakdowns = await Breakdown.bulkCreate(breakdowns);
                all_breakdowns = createBreakdowns
            }

            //Check if breakdown
            let all_borroweds = []
            if(req.body.borroweds.length > 0){
                let borroweds = req.body.borroweds
                for(counter = 0; counter < borroweds.length; counter++){
                    borroweds[counter].spending_id = createSpending.id
                }
                const createBorroweds = await Borrowed.bulkCreate(borroweds);
                all_borroweds = createBorroweds
            }

            //Check if breakdown\
            let all_lents = []
            if(req.body.lents.length > 0){
                let lents = req.body.lents
                for(counter = 0; counter < lents.length; counter++){
                    lents[counter].spending_id = createSpending.id
                }
                const createLents = await Lent.bulkCreate(lents);
                all_lents = createLents
            }

            if(createSpending){
                return res.status(201).send({
                    status : 'success',
                    message : 'Created Successfully',
                    spending : createSpending,
                    Breakdowns : all_breakdowns,
                    Borroweds : all_borroweds,
                    Lents : all_lents,
                })
            } 
            else {
                return res.status(400).send({
                    status : 'failed',
                    message : 'Could not create spending record, please try again'
                })
            }
        } catch (error) {
            console.log(error)
           return res.status(400).send({
                status : 'failed',
                 message : error || 'Server Error, please try again!',
            })
        }
    }

    static async edit (req, res) {
        const payload = req.body;
        // Validate payload
        if(!payload.data.amount && !payload.data.date){
            return res.status(400).send({status: 'failed', message : 'Validation error', body : req.body})
        }

        try {
            // cretae spendings instance
            let spendings = {
                id : req.params.id,
                amount : req.body.data.amount,
                date : req.body.data.date
            }
            const createSpending = await Spendings.update(
                {
                    "amount" : spendings.amount,
                    "date" : spendings.date
                },
                { where : { id : spendings.id }},
            );

            var counter = 0
            let all_breakdowns = []
            //Check if breakdown
            if(req.body.data.breakdowns.length > 0){
                let breakdowns = req.body.data.breakdowns
                for(counter = 0; counter < breakdowns.length; counter++){
                    breakdowns[counter].spending_id = spendings.id
                }
                const editBreakdowns = await Breakdown.bulkCreate(breakdowns, { updateOnDuplicate : ["price","item","quantity"]});
                all_breakdowns = editBreakdowns
            }

            //Check if breakdown
            let all_borroweds = []
            if(req.body.data.borroweds.length > 0){
                let borroweds = req.body.data.borroweds
                for(counter = 0; counter < borroweds.length; counter++){
                    borroweds[counter].spending_id = spendings.id
                }
                const editBorroweds = await Borrowed.bulkCreate(borroweds, { updateOnDuplicate : ["amount","description"]});
                all_borroweds = editBorroweds
            }

            //Check if breakdown\
            let all_lents = []
            if(req.body.data.lents.length > 0){
                let lents = req.body.data.lents
                for(counter = 0; counter < lents.length; counter++){
                    lents[counter].spending_id = spendings.id
                }
                const editLents = await Lent.bulkCreate(lents, { updateOnDuplicate : ["amount","description","repay_date"]});
                all_lents = editLents
            }


            //Checked if there were some fields removed
            if(req.body.removed.breakdowns.length > 0){
                let breakdown_r = req.body.removed.breakdowns
                for(counter = 0; counter < breakdown_r.length; counter++){
                    await Breakdown.destroy({ where : {id : breakdown_r[counter]} })
                }
            }

            if(req.body.removed.borroweds.length > 0){
                let borrowed_r = req.body.removed.borroweds
                for(counter = 0; counter < borrowed_r.length; counter++){
                    await Borrowed.destroy({ where : {id : borrowed_r[counter]} })
                }
            }

            if(req.body.removed.lents.length > 0){
                let lent_r = req.body.removed.lents
                for(counter = 0; counter < lent_r.length; counter++){
                    await Lent.destroy({ where : {id : lent_r[counter]} })
                }
            }

            if(createSpending){
                return res.status(201).send({
                    status : 'success',
                    message : 'Edited Successfully',
                    spending : spendings,
                    Breakdowns : all_breakdowns,
                    Borroweds : all_borroweds,
                    Lents : all_lents,
                })
            } 
            else {
                return res.status(400).send({
                    status : 'failed',
                    message : 'Could not create spending record, please try again'
                })
            }
        } catch (error) {
           return res.status(400).send({
                status : 'failed',
                message : error || 'Server Error, please try again!',
            })
        }
    }
    
    static async delete (req, res) {
        if(!req.body.id){
            return res.status(400).send({
                message : 'ID not received'
            })
        }
        console.log(req.body)

        try {
            let spendings = {
                id : req.body.id,
                amount : req.body.amount,
                date : req.body.date
            }

            let counter = 0

            if(req.body.Breakdowns.length > 0){
                let breakdowns = req.body.Breakdowns
                for(counter = 0; counter < breakdowns.length; counter++){
                    // breakdowns[counter].spending_id = spendings.id
                        await Breakdown.destroy({ where : {id : breakdowns[counter].id} })
                }
                // const editBreakdowns = await Breakdown.bulkDelete(breakdowns);
                // all_breakdowns = editBreakdowns
            }

            //Check if breakdown
            // let all_borroweds = []
            if(req.body.Borroweds.length > 0){
                let borroweds = req.body.Borroweds
                for(counter = 0; counter < borroweds.length; counter++){
                    // borroweds[counter].spending_id = spendings.id
                    await Borrowed.destroy({ where : {id : borroweds[counter].id} })

                }
                // const deleteBorroweds = await Borrowed.bulkDelete(borroweds);
                // all_borroweds = editBorroweds
            }

            //Check if breakdown\
            // let all_lents = []
            if(req.body.Lents.length > 0){
                let lents = req.body.Lents
                for(counter = 0; counter < lents.length; counter++){
                    // lents[counter].spending_id = spendings.id
                    await Lent.destroy({ where : {id : lents[counter].id} })
                }
                // const editLents = await Lent.bulkDelete(lents);
                // all_lents = editLents
            }

            const deleteSpending = await Spendings.destroy(
                { where : { id : spendings.id }},
            );

            res.status(200).send({
                message : 'Successfully Deleted!',
            })


        } catch (error) {
            return res.status(400).send({
                status : 'failed',
                message : error || 'Server Error, please try again!',
            })
        }
    }
}


module.exports = SpendingsController;
