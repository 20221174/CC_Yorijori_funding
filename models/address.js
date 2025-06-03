// // models/address.js
// //주소
// module.exports = (sequelize, Sequelize) =>{

// class Address extends Sequelize.Model {}

// Address.init({
//   addressId: { //주소번호
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   city: { //시도
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   district: { //시군구
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   town: { //읍면동
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   detail: { //상세주소
//     type: Sequelize.STRING,
//     allowNull: true
//   }
// }, {
//   sequelize,
//   modelName: 'address',
//   timestamps: false
// });

// return Address;
// }