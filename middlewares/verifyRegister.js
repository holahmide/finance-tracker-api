const { User } = require('../models')

checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
    where: {
        email: req.body.email
    }
    }).then(user => {
    if (user) {
        res.status(400).send({
            message: "Failed! Email is already in use!",
            status : "failed"
        });
        return;
    }

    next();
    });
};


const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
};
  
  module.exports = verifySignUp;
  
