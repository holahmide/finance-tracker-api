const Op = require('sequelize').Op

class HomeController {

    static async home (req, res) {
        return res.send({status: 'active', app : 'finance.blaize.net'}).status(400);
    }
}


module.exports = HomeController;
