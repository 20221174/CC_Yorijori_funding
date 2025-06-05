const db = require("../models/index"),
  FundingProduct = db.fundingProduct,
  FundingGroup = db.fundingGroup,
  Composition = db.composition,
  User = db.user,
  sequelize = db.sequelize,
  Sequelize = db.Sequelize;

const axios = require("axios");

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  };
  const formattedDate = date.toLocaleDateString("ko-KR", options);

  // Format the date as YYYY/MM/DD (day)
  const [year, month, day] = formattedDate.split(". ");
  const dayOfWeek = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();
  return `${year}/${month}/${day} (${dayOfWeek})`;
}

module.exports = {
  // 펀딩 검색 페이지를 렌더링
  showCreateFundingSearchPage: async (req, res) => {
    try {
      res.render("funding/createFundingSearch");
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.error(`Error: ${error.message}`);
    }
  },

  // 검색 결과를 렌더링
  searchProducts: async (req, res) => {
    try {
      let query = req.query.query;
      let sql = `SELECT 
                            fundingProductId, 
                            productName, 
                            seller, 
                            unitPrice, 
                            expirationDate, 
                            quantity, 
                            unit, 
                            registrationDate, 
                            imageUrl 
                        FROM 
                            fundingProducts 
                        WHERE 
                            productName LIKE ?`;
      let values = [`%${query}%`];

      let [results] = await sequelize.query(sql, {
        replacements: values,
        type: Sequelize.SELECT,
      });

      // Format the expirationDate for each result
      results.forEach((result) => {
        result.formattedExpirationDate = formatDate(result.expirationDate);
      });

      console.log(results);

      res.render("funding/searchResults", { results, query });
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.error(`Error: ${error.message}`);
    }
  },

  productDetail: async (req, res) => {
    try {
      let productId = req.params.productId;
      let sql = `SELECT 
                            fundingProductId, 
                            productName, 
                            seller, 
                            unitPrice, 
                            expirationDate, 
                            quantity, 
                            unit, 
                            registrationDate, 
                            imageUrl 
                        FROM 
                            fundingProducts 
                        WHERE 
                            fundingProductId = ${productId}`;
      let [product] = await sequelize.query(sql, { type: Sequelize.SELECT });

      if (product && product.length > 0) {
        product[0].formattedExpirationDate = formatDate(
          product[0].expirationDate
        );
      }

      res.render("funding/productDetail", { product: product[0] });
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.error(`Error: ${error.message}`);
    }
  },

  showCreateFundingPage: async (req, res) => {
    try {
      let productId = req.params.productId;
      let productSql = `SELECT 
                                    fundingProductId, 
                                    productName, 
                                    seller, 
                                    unitPrice, 
                                    expirationDate, 
                                    quantity, 
                                    unit, 
                                    registrationDate, 
                                    imageUrl 
                                FROM 
                                    fundingProducts 
                                WHERE 
                                    fundingProductId = ?`;
      // let userSql = `SELECT
      //                     userId,
      //                     email,
      //                     name,
      //                     nickname,
      //                     phoneNumber,
      //                     city,
      //                     district,
      //                     town,
      //                     detail
      //                 FROM
      //                     users
      //                 WHERE
      //                     userId = ?`;

      let [product] = await sequelize.query(productSql, {
        replacements: [productId],
        type: Sequelize.SELECT,
      });

      //   let [representative] = await sequelize.query(userSql, {
      //     replacements: [req.user.userId],
      //     type: Sequelize.SELECT,
      //   });
      const userId = req.user.userId;
      const response = await axios.get(
        `http://user:3000/user-api/user/${userId}`
      );
      const [representative] = response.data;

      if (product && product.length > 0) {
        product[0].formattedExpirationDate = formatDate(
          product[0].expirationDate
        );
      }

      res.render("funding/createFunding", {
        product: product[0],
        representative: representative[0],
        productId: productId,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.error(`Error: ${error.message}`);
    }
  },

  createFunding: async (req, res) => {
    let productId = req.params.productId;
    try {
      let newFundingGroup = await FundingGroup.create({
        fundingProductId: productId,
        deliveryStauts: true,
        deliveryCost: 4000,
        deliveryDate: req.body.deliveryDate,
        fundingDate: new Date(), // 여기도 req.body.로 받아와야하는지 확인
        city: req.body.distributionLocationCity,
        district: req.body.distributionLocationDistrict,
        town: req.body.distributionLocationTown,
        detail: req.body.distributionLocationDetail,
        distributionDate: req.body.distributionDate,
        people: req.body.people,
        representativeUserId: req.user.userId,
      });
      let sql = `     select p.unit, p.unitPrice
                            from fundingProducts p
                            left join fundingGroups g on p.fundingProductId = g.fundingProductId
                            where p.fundingProductId =  ${productId}`;

      let [product, a] = await sequelize.query(sql, {
        type: Sequelize.SELECT,
      });

      let newComposition = await Composition.create({
        fundingGroupId: newFundingGroup.fundingGroupId,
        userId: req.user.userId,
        quantity: product[0].unit,
        amount: product[0].unitPrice,
      });

      console.log(newFundingGroup.fundingGroupId);
      res.redirect(
        `/createfundingPage/create_funding_success/${newFundingGroup.fundingGroupId}`
      );
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.error(`Error: ${error.message}`);
    }
  },

  showCreateFundingSuccessPage: async (req, res) => {
    try {
      let fundingGroupId = req.params.fundingGroupId;
      let fundingGroup = await FundingGroup.findByPk(fundingGroupId);

      if (fundingGroup) {
        fundingGroup.distributionDateFormatted = formatDate(
          fundingGroup.distributionDate
        );
      }
      res.render("funding/createFundingSuccess", { fundingGroup });
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.error(`Error: ${error.message}`);
    }
  },
};
