// models/usage.js
// 사용

module.exports = (sequelize, Sequelize) =>{
  const Ingredient = require("./ingredient")(sequelize,Sequelize); 
  const Post = require("./post")(sequelize,Sequelize); 

class Usage extends Sequelize.Model {}

Usage.init({
  ingredientId: { //재료번호(FK)
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Ingredient,
      key: 'ingredientId'
    },
  },
  
  postId: { //게시글번호(FK)
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'postId'
    },
  }
}, {
  sequelize,
  modelName: 'usage',
  timestamps: false,
});

return Usage;
}