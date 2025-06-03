// models/save.js
//저장
module.exports = (sequelize, Sequelize) =>{
class Save extends Sequelize.Model {}
const User = require("./user")(sequelize,Sequelize); 
const Post = require("./post")(sequelize,Sequelize); 

Save.init({
  userId: { //사용자번호(FK)
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'userId'
    }
  },
  postId: { //글번호(FK)
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'postId'
    }
  }
}, {
  sequelize,
  modelName: 'save',
  timestamps: false
});

return Save;
}
