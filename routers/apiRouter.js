const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/fundings/:userId", apiController.getFundingsByUserId);
router.get(
  "/participated-fundings/:userId",
  apiController.getParticipatedFundingsByUserId
);

module.exports = router;
