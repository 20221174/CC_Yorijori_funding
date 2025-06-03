// models/composition.js
// 구성
module.exports = (sequelize, Sequelize) =>{
  const FundingGroup = require("./fundingGroup")(sequelize,Sequelize);
  const User = require("./user")(sequelize,Sequelize); 
 
class Composition extends Sequelize.Model {}

Composition.init({
  fundingGroupId: { //펀딩그룹번호(FK)
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: FundingGroup,
      key: 'fundingGroupId'
    }
  },
  userId: { //사용자번호(FK)
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'userId'
    }
  },
  quantity: { //주문수량
    type: Sequelize.INTEGER,
    allowNull: false,
    min: 1, // 최소값을 1로 설정
  },
  amount: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'composition',
  timestamps: false
});

return Composition;
}