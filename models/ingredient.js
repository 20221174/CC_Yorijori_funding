// models/ingredient.js
// 재료
module.exports = (sequelize, Sequelize) => {
  class Ingredient extends Sequelize.Model { }

  Ingredient.init({
    ingredientId: { //재료번호
      type: Sequelize.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    ingredientName: { //재료명
      type: Sequelize.STRING,
      allowNull: false
    },
    category: { //카테고리(재료용)
      type: Sequelize.STRING,
      allowNull: false
    }
  },
    {
      sequelize,
      modelName: 'ingredient',
      timestamps: false,
    });

  return Ingredient;
};
