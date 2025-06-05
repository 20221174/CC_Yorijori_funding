const { sequelize } = require("../models");
const Sequelize = require("sequelize");

exports.getFundingsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    let query = `
              SELECT fg.representativeUserId, fg.fundingDate, fp.productName, fg.people, fp.imageUrl
              FROM fundingGroups AS fg
              INNER JOIN fundingProducts AS fp ON fg.fundingProductId = fp.fundingProductId
              where fg.representativeUserId = ${userId};
            `;
    let [myposts, metadata] = await sequelize.query(query, {
      type: Sequelize.SELECT,
    });
    res.json(myposts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getParticipatedFundingsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    let query = `
              SELECT fg.representativeUserId, fg.fundingDate, fp.productName, fg.people, fp.imageUrl
              FROM fundingGroups AS fg
              INNER JOIN fundingProducts AS fp ON fg.fundingProductId = fp.fundingProductId
              where fg.representativeUserId = ${userId};
            `;
    let [myposts, metadata] = await sequelize.query(query, {
      type: Sequelize.SELECT,
    });
    res.json(myposts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
