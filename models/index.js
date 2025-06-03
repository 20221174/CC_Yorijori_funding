const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db= {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.user = require("./user.js")(sequelize, Sequelize); //사용자
db.menu = require('./menu.js')(sequelize, Sequelize); //메뉴
db.ingredient = require('./ingredient.js')(sequelize, Sequelize); //재료
db.post = require('./post.js')(sequelize, Sequelize); //게시글
db.image = require('./image.js')(sequelize, Sequelize); //이미지
db.fundingProduct = require('./fundingProduct.js')(sequelize, Sequelize); //펀딩상품
db.fundingGroup = require('./fundingGroup.js')(sequelize, Sequelize); //펀딩그룹
db.comment = require('./comment.js')(sequelize, Sequelize); //댓글
db.composition = require('./composition.js')(sequelize, Sequelize); //구성
db.save = require('./save.js')(sequelize, Sequelize); //저장
db.usage = require('./usage.js')(sequelize, Sequelize); //사용
db.view = require('./view.js')(sequelize, Sequelize); //조회


// Menu and Posts (1:N)
db.menu.hasMany(db.post, { foreignKey: 'menuId' });
db.post.belongsTo(db.menu, { foreignKey: 'menuId' });

// Posts and Images (1:N)
db.post.hasMany(db.image, { foreignKey: 'postId' });
db.image.belongsTo(db.post, { foreignKey: 'postId' });

// Users and Addresses
// db.user.belongsTo(db.address, { foreignKey: 'addressId' });
// db.address.hasMany(db.user, { foreignKey: 'addressId' });

// Users and Posts
// db.user.hasMany(db.post, { foreignKey: 'userId' });
// db.post.belongsTo(db.user, { foreignKey: 'userId' });

// Posts and Comments
db.post.hasMany(db.comment, { foreignKey: 'postId' });
db.comment.belongsTo(db.post, { foreignKey: 'postId' });

// Posts and Ingredients (N:M)
db.post.belongsToMany(db.ingredient, { through: db.usage, foreignKey: 'postId', otherKey: 'ingredientId' });
db.ingredient.belongsToMany(db.post, { through: db.usage, foreignKey: 'ingredientId', otherKey: 'postId' });

// Posts and Users (저장)
db.post.belongsToMany(db.ingredient, { through: db.save, foreignKey: 'postId', otherKey: 'userId' });
db.user.belongsToMany(db.post, { through: db.save, foreignKey: 'userId', otherKey: 'postId' });

// Funding Groups and Funding Products
db.fundingGroup.belongsTo(db.fundingProduct, { foreignKey: 'fundingProductId' });
db.fundingProduct.hasMany(db.fundingGroup, { foreignKey: 'fundingProductId' });

// Funding Groups and Users (Leaders)
db.fundingGroup.belongsToMany(db.user, { 
    through: 'composition',foreignKey: 'fundingGroupId',
    otherKey: 'userId'});
db.user.belongsToMany(db.fundingGroup, {
     through: 'composition',foreignKey: 'userId',
otherKey: 'fundingGroupId'});

// Users and Posts(조회)
db.user.belongsToMany(db.post, { through: db.view, foreignKey: 'userId', otherKey: 'postId'});
db.post.belongsToMany(db.user, { through: db.view, foreignKey: 'postId', otherKey: 'userId'});
db.view.belongsTo(db.user, {foreignKey: 'userId'});
db.view.belongsTo(db.post, {foreignKey: 'postId'});
db.user.hasMany(db.view, {foreignKey: 'userId'});
db.post.hasMany(db.view, {foreignKey: 'postId'});

module.exports= db;