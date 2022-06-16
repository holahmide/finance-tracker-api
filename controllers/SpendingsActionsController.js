const jwt = require("jsonwebtoken");
const Op = require('sequelize').Op;
const bcrypt = require("bcryptjs");
const { User, Spendings, Breakdown, Borrowed, Lent } = require('../models')
const config = require('../config/config')



class SpendingsActionsController {
    static async index(req, res) {
        try {
            const fetchAllSpendings = await Spendings.findAll({
                where: { user_id: req.user.id },
                // include : [Breakdown]
                include: [
                    { model: Breakdown },
                    { model: Borrowed },
                    { model: Lent },
                ],
            });

            res.status(200).send({
                spendings: fetchAllSpendings
            })
        } catch (error) {
            res.status(400).send({
                message: error,
                status: 'failed'
            })
        }
    }

    //Borrowed
    static async createBorrowed(req, res) {
        try {
            req.body.map((borrowed) => {
                borrowed.user_id = req.user.id
            })
            const createBorrowed = await Borrowed.bulkCreate(req.body)

            res.status(201).send({
                borroweds: createBorrowed,
                message: "Successfully recorded borrowed amount details"
            })
        } catch (error) {
            res.status(400).send({
                message: error,
                status: 'failed'
            })
        }
    }

    static async fetchBorroweds(req, res) {
        try {
            const fetchAllBorroweds = await Borrowed.findAll({
                where: { user_id: req.user.id }
            });

            res.status(200).send({
                borroweds: fetchAllBorroweds
            })
        } catch (error) {
            res.status(400).send({
                message: error,
                status: 'failed'
            })
        }
    }
    static async editBorrowed(req, res) {
        const payload = req.body;
        // Validate payload
        if (!payload.amount) {
            return res.status(400).send({ status: 'failed', message: 'Validation error', body: req.body })
        }

        try {
            const updateField = await Borrowed.update(req.body,
                { where: { id: req.params.id } },
            );

            const updatedField = await Borrowed.findByPk(req.params.id);

            return res.status(200).send({
                status: 'success',
                message: 'Edited Successfully',
                borrowed: updatedField,
            })

        } catch (error) {
            return res.status(400).send({
                status: 'failed',
                message: error || 'Server Error, please try again!',
            })
        }
    }

    // lents
    static async createLent(req, res) {
        try {
            req.body.map((lent) => {
                lent.user_id = req.user.id
            })
            const createLent = await Lent.bulkCreate(req.body)

            res.status(201).send({
                lents: createLent,
                message: "Successfully recorded lent amount details"
            })
        } catch (error) {
            res.status(400).send({
                message: error,
                status: 'failed'
            })
        }
    }

    static async fetchLents(req, res) {
        try {
            const fetchAllLents = await Lent.findAll({
                where: { user_id: req.user.id }
            });

            res.status(200).send({
                lents: fetchAllLents
            })
        } catch (error) {
            res.status(400).send({
                message: error,
                status: 'failed'
            })
        }
    }

    static async editLent(req, res) {
        const payload = req.body;
        // Validate payload
        if (!payload.amount) {
            return res.status(400).send({ status: 'failed', message: 'Validation error', body: req.body })
        }

        try {
            const updateField = await Lent.update(req.body,
                { where: { id: req.params.id } },
            );

            const updatedField = await Lent.findByPk(req.params.id);

            return res.status(200).send({
                status: 'success',
                message: 'Edited Successfully',
                lent: updatedField,
            })

        } catch (error) {
            return res.status(400).send({
                status: 'failed',
                message: error || 'Server Error, please try again!',
            })
        }
    }

    static async delete(req, res) {
        let id = req.params.id
        if (!id && !req.params.type) {
            res.status(400).send({
                message: 'ID not received!'
            })
        }

        try {
            let deleteRecord = null
            if (req.params.type == 'lent') {
                deleteRecord = await Lent.destroy({ where: { id } })
            }
            else if (req.params.type == 'borrowed') {
                deleteRecord = await Borrowed.destroy({ where: { id } })
            }

            res.status(200).send({
                message: 'Successfully Deleted!',
                data: deleteRecord
            })
        } catch (error) {
            console.log(error)
            return res.status(400).send({
                status: 'failed',
                message: error || 'Server Error, please try again!',
            })
        }
    }

    static async chartData(req, res) {
        try {
            let spendings = await Spendings.findAll({ where: { user_id: req.user.id } });
            let borroweds = await Borrowed.findAll({ where: { user_id: req.user.id } });
            let lents = await Lent.findAll({ where: { user_id: req.user.id } });

            let i = 0
            let data = {
                spendings: null,
                lents: null,
                borroweds: null
            }
            let records = null
            for (var j = 0; j < 3; j++) {
                if (j == 0) {
                    records = JSON.parse(JSON.stringify(spendings))
                }
                if (j == 1) {
                    records = JSON.parse(JSON.stringify(lents))
                }
                if (j == 2) {
                    records = JSON.parse(JSON.stringify(borroweds))
                }


                let template = [0, 0, 0, 0, 0, 0, 0]
                let total = [0, 0, 0, 0, 0, 0, 0]
                let amount = [0, 0, 0, 0, 0, 0, 0]
                for (i = 0; i < records.length; i++) {
                    if (records[i].date) {
                        let day = new Date(records[i].date).getDay()
                        total[day]++
                        amount[day] += records[i].amount
                        template[day] = amount[day] / total[day]

                    }
                }

                if (j == 0) {
                    data.spendings = template
                }
                if (j == 1) {
                    data.lents = template
                }
                if (j == 2) {
                    data.borroweds = template
                }
            }

            res.status(200).send({
                data: data,
                message: 'SUccessfully fetched chart data'
            })
        } catch (error) {

        }
    }
}


module.exports = SpendingsActionsController;
