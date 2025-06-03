// models/comment.js
//댓글
module.exports = (sequelize, Sequelize) =>{
const Post = require('./post')(sequelize,Sequelize);
const User = require('./user')(sequelize,Sequelize);

class Comment extends Sequelize.Model {}

Comment.init({
  commentId: { //댓글번호
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: { //내용
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdAt: { //작성일자
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  postId: { //글번호(FK)
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Post,
      key: 'postId'
    }
  },
  userId: { //사용자번호(FK)
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'userId'
    }
  }
}, {
  sequelize,
  modelName: 'comment',
  timestamps: false
});

return Comment;
}