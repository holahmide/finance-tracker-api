const express = require("express");
const router = express.Router();
const HomeController = require('../controllers/HomeController')
const UserController = require('../controllers/UserController')
const SpendingsController = require('../controllers/SpendingsController')
const SpendingsActionsController = require('../controllers/SpendingsActionsController')
const LimitController = require('../controllers/LimitController')
const { verifyRegister, authJwt } = require('../middlewares')


router.get("/", HomeController.home);

// Authentication
router.post("/auth/register",verifyRegister.checkDuplicateEmail , UserController.register);
router.post("/auth/login", UserController.login);
router.get("/auth/state", authJwt.verifyToken, UserController.state);
router.put("/auth/edit/:id", authJwt.verifyToken, UserController.edit);
router.get("/auth/logout", authJwt.verifyToken, UserController.logout);
router.post("/auth/change_password", authJwt.verifyToken, UserController.changePassword);

//Spendings
router.post("/spendings/create",authJwt.verifyToken , SpendingsController.create);
router.get("/spendings/all",authJwt.verifyToken , SpendingsActionsController.index);
router.put("/spendings/edit/:id", authJwt.verifyToken , SpendingsController.edit);
router.get("/limits/overshoots", authJwt.verifyToken , LimitController.index);
router.post("/limits/create", authJwt.verifyToken , LimitController.create);
router.put("/limits/edit/:id", authJwt.verifyToken , LimitController.edit);
router.get("/spendings/chart", authJwt.verifyToken , SpendingsActionsController.chartData);
router.post("/spendings/delete/:id", authJwt.verifyToken , SpendingsController.delete);

//Borroweds
router.post("/spendings/borroweds/create", authJwt.verifyToken , SpendingsActionsController.createBorrowed);
router.get("/spendings/borroweds/all",authJwt.verifyToken , SpendingsActionsController.fetchBorroweds);
router.put("/spendings/borroweds/edit/:id", authJwt.verifyToken , SpendingsActionsController.editBorrowed);

// Lents
router.post("/spendings/lents/create", authJwt.verifyToken , SpendingsActionsController.createLent);
router.get("/spendings/lents/all",authJwt.verifyToken , SpendingsActionsController.fetchLents);
router.put("/spendings/lents/edit/:id", authJwt.verifyToken , SpendingsActionsController.editLent);

router.delete("/spendings/delete/:type/:id", authJwt.verifyToken , SpendingsActionsController.delete);







module.exports = router