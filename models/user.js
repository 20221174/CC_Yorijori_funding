//const { Sequelize, Model } = require("sequelize");
//const bcrypt = require("bcrypt");
const passportLocalSequelize = require("passport-local-sequelize");


module.exports = (sequelize, Sequelize) => {

  class User extends Sequelize.Model {
    // id로 찾아서 업데이트하는 메서드
    static async findByPkAndUpdate(id, params) {
      let user = await User.findByPk(id);
      if (user) {
        user = await User.update(params, {
            where: { id: id }
        });
      }
      return user;
      }
      //id로 찾아서 삭제하는 메서드
      static async findByPkAndRemove(id) {
        let user = await User.findByPk(id);
        if (user) {
          user = await User.destroy({
            where: { id: id }
          });
        }
        return user;
      }

      // async passwordComparison(inputPassword) {
      //   console.log(`Comparing passwords: input=${inputPassword}, stored=${this.password}`);
      //   const match = await bcrypt.compare(inputPassword, this.password);
      //   console.log(`Password match: ${match}`);
      //   return match;
      // } 
  };
  
  User.init({
    userId: { // 사용자번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: { // 이메일
      type: Sequelize.STRING,
      allowNull: false
    },
    password: { // 비밀번호
      type: Sequelize.STRING(1024),
      allowNull: false
    },
    name: { // 이름
      type: Sequelize.STRING,
      allowNull: false
    },
    nickname: { // 별명
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber: { // 전화번호
      type: Sequelize.STRING,
      allowNull: false
    },
    city: { // 시도
      type: Sequelize.STRING,
      allowNull: false
    },
    district: { // 시군구
      type: Sequelize.STRING,
      allowNull: false
    },
    town: { // 읍면동
      type: Sequelize.STRING,
      allowNull: false
    },
    detail: { // 상세주소
      type: Sequelize.STRING,
      allowNull: true
    },
    imageUrl: { //이미지주소
      type: Sequelize.STRING,
      allowNull: true
    }
    ,
    // myhash: {
    //   type: Sequelize.STRING(1024)
    // },
    mysalt: {
      type: Sequelize.STRING
    }
  }, 
  {
    // hooks: {
    //   beforeSave: async (user) => {
    //     let hash = await bcrypt.hash(user.password, 10);
    //     user.password = hash;
    //   }
    // },  
    sequelize,
    modelName: 'user',
    timestamps: false
  }
  );

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'email',
    hashField: 'password',
    saltField: 'mysalt'
  });

  return User;
};