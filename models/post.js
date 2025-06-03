// models/post.js
// 게시글

module.exports = (sequelize, Sequelize) => {
  const User = require("./user")(sequelize, Sequelize);
  const Menu = require("./menu")(sequelize, Sequelize);

  class Post extends Sequelize.Model {}

  Post.init(
    {
      postId: {
        //게시글번호
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        //제목
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        //본문
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date: {
        //작성일자
        type: Sequelize.DATE,
        allowNull: false,
      },
      menuId: {
        //메뉴번호(FK)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Menu,
          key: "menuId",
        },
      },
      userId: {
        //사용자번호(FK)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "userId",
        },
      },
    },
    {
      sequelize,
      modelName: "post",
      timestamps: false,
    }
  );

  return Post;
};
