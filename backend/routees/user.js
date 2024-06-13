const express = require("express");
const {
  userInfo,
  updateUser,
  becomeAgent,
  getAgentApplications,
  grantApplication,
  declineApplication,
  getAgents,
  getUsers,
  uploadProperty,
  getProperties,
  getPropertyById,
  deleteProperty,
  searchProperty,
  createChatRoom,
  getChats,
  createPaymentIntent,
  confirmPayment,
  adminSearchUser,
  adminSearchAgent,
  adminSearchTransaction,
  adminTransactions,
  deleteAgent,
  deleteUser,
  updateProperty,
} = require("../controller/user.controller");
const { isAuth } = require("../middleware");

const router = express.Router();
router.get("/info", isAuth, userInfo);
router.post("/update", isAuth, updateUser);
router.post("/apply/agent", isAuth, becomeAgent);
router.get("/applications", isAuth, getAgentApplications);
router.get("/users", isAuth, getUsers);
router.get("/agents", isAuth, getAgents);
router.patch("/application/grant/:id", isAuth, grantApplication);
router.patch("/application/decline/:id", isAuth, declineApplication);
router.post("/property", isAuth, uploadProperty);
router.get("/property", isAuth, getProperties);
router.get("/property/:id", isAuth, getPropertyById);
router.delete("/property/:id", isAuth, deleteProperty);
router.get('/search', isAuth, searchProperty);
router.post('/chat', isAuth, createChatRoom);
router.get('/chat', isAuth, getChats);
router.post('/create-payment-intent', isAuth, createPaymentIntent);
router.post('/confirm-payment', isAuth, confirmPayment);
router.get('/admin/user/search', adminSearchUser)
router.get('/admin/agent/search', adminSearchAgent)
router.get('/admin/transaction/search', adminSearchTransaction)
router.get('/transactions', adminTransactions)
router.delete('/agent/:id', deleteAgent)
router.delete('/user/:id', deleteUser)
router.patch('/property/:id', isAuth, updateProperty)

module.exports = router;
