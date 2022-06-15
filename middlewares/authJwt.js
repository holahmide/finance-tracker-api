const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const { User, Spendings } = require("../models");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) token = req.cookies["access_token"];

    if (!token) {
        return res.status(401).send({
           message: "No token provided!",
           status : "failed"
        });
    }

    jwt.verify(token, config.authentication.jwtSecret, (err, decoded) => {
        if (err) {
            res.clearCookie('access_token');
            return res.status(401).send({   
                message: "Unauthorized!",
                status : "failed",
            });
        }

        var dateNow = new Date();
        if(decoded.exp < dateNow.getTime()/1000) {  
            return res.status(401).send({
                message: "Expired Token, please login again",
                status : "failed",
            });
        }
        
        const user = User.findOne({ include: [Spendings], where: { id : decoded.id } })
            .then(user => {
                if (!user) {
                    return res.status(400).send({
                        message: "User was not found",
                        status : "failed"
                    });
                }

                req.user = user.toJSON();
                next();
            });
    });
}

const auth = async user => {
    return User.findOne({ where: { id : user } });
};

const authJwt = {
    verifyToken
}

module.exports = authJwt