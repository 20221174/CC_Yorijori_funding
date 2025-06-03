// models/image.js
// 이미지

module.exports = (sequelize, Sequelize) => {
  
  const Post = require("./post")(sequelize,Sequelize);

  class Image extends Sequelize.Model { }

  Image.init({
    postId: { //글번호(FK)
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'postId'
      }
    },
    imageId: { //이미지번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    imageUrl: { //이미지주소
      type: Sequelize.STRING,
      allowNull: false
    }
  },
    {
      sequelize,
      modelName: 'image',
      timestamps: false
    });

  return Image;
};