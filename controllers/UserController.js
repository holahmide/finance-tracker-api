const jwt = require("jsonwebtoken");
const Op = require('sequelize').Op;
const bcrypt = require("bcryptjs");
const { User, Spendings } = require('../models')
const config = require('../config/config')

class UserController {
    static async register(req, res) {
        const payload = req.body;
        // Validate payload
        if (!payload.firstname || !payload.lastname || !payload.email || !payload.password) {
            return res.status(400).send({ status: 'failed', message: 'Validation error' })
        }
        //if validation passes
        // Hash incoming password
        // const hashPassword = await bcrypt.hash(req.body.password, 10);
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashPassword

        //creating user
        try {
            const createUser = await User.create(req.body);
            if (createUser) {
                return res.status(201).send({
                    status: 'success',
                    message: 'You have successfully registered with blaizeng!, proceed to login🌚😏',
                    user: createUser
                })
            }
            else {
                return res.status(400).send({
                    status: 'failed',
                    message: 'Server Error, please try again'
                })
            }
        } catch (error) {
            return res.status(400).send({
                status: 'failed',
                message: error.errors[0].message || 'Server Error, please try again!',
            })
        }
    }

    static async login(req, res) {
        let { email, password } = req.body
        // Authentication Handler
        if (!email || !password) {
            return res.status(401).send({
                message: 'Request Fields Empty',
                email,
                password
            });
        }
        //Action
        try {
            const findUser = await User.findOne({
                where: { email: email },
                include: [Spendings],
            });

            if (!findUser) {
                return res.status(401).send({
                    message: "Authentication failed",
                    error: 'failed'
                });
            }

            // const match = await bcrypt.compare(password, findUser.password);
            const match = bcrypt.compareSync(password, findUser.password);

            if (match) {
                const userJson = findUser.toJSON()
                // console.log(config.authentication)
                // const token = jwt.sign(userJson, config.authentication.jwtSecret, {
                //     expiresIn: "7h"
                // });
                const token = jwt.sign({ id: userJson.id }, config.authentication.jwtSecret, {
                    expiresIn: "7h"
                });

                // Cookie
                res.cookie('access_token', token, { httpOnly: true });

                return res.status(200).send({
                    message: 'Logged In Successfully',
                    user: userJson,
                    accessToken: token
                });
            } else {
                res.status(401).send({
                    message: "Authentication failed",
                    status: 'failed'
                });
            }

        } catch (error) {
            res.status(400).send({ status: 'failed', message: "Database error", error: error });
        }
    }

    static state(req, res) {
        res.send({
            message: 'Token still Valid!',
            status: "success",
            user: req.user
        }).status(200)
    }

    static async edit(req, res) {
        let payload = req.body
        if (!payload.firstname || !payload.lastname || !payload.email) {
            return res.status(400).send({ status: 'failed', message: 'Validation error' })
        }

        const data = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        }

        if (payload.password) {

        }


        try {
            const editDetails = await User.update(
                data,
                { where: { id: req.params.id } },
            );
            console.log(req.params.id)

            const findUser = await User.findOne({
                where: { email: data.email },
                include: [Spendings],
            });

            return res.status(200).send({
                message: 'Edited Details Successfully',
                user: findUser,
            });
        } catch (error) {
            res.status(400).send({ status: 'failed', message: "Database error", error: error });
        }

    }

    static logout(req, res) {
        res.clearCookie('access_token', { httpOnly: true });
        return res.status(200).json({
            status: true,
            message: 'successfully logged out',
        });
    }

    static async changePassword(req, res) {
        let payload = req.body
        if (!payload.currentPassword || !payload.newPassword) {
            return res.status(400).send({ status: 'failed', message: 'Validation error' })
        }

        try {
            const findUser = await User.findOne({
                where: { id: req.user.id },
            });

            const match = bcrypt.compareSync(payload.currentPassword, findUser.password);

            if (match) {
                const hashPassword = bcrypt.hashSync(payload.newPassword, 10);
                findUser.password = hashPassword;
                findUser.save();

                return res.status(200).json({
                    status: true,
                    message: 'successfully changed you password',
                });
            } else {
                res.status(400).send({ status: 'failed', message: "Password Mismatch!" });
            }   

            
        } catch (error) {
            res.status(400).send({ status: 'failed', message: "Database error", error: error });

        }

    }
}


module.exports = UserController;
