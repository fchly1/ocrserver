var config = require('./index');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('ocrserver',config.username,config.password);

const Token = sequelize.define('token',{
    name:Sequelize.STRING,
    accesstoken:Sequelize.STRING,
});


const Config = sequelize.define('config',{
    key:Sequelize.STRING,
    value:Sequelize.STRING,
})

const User = sequelize.define('user',{
    username:Sequelize.STRING,
    nickname:Sequelize.STRING,
    password:Sequelize.STRING,
    avatar:Sequelize.STRING
})



const Balance = sequelize.define('balance',{
    balance:Sequelize.FLOAT
})

Balance.belongsTo(User);

const History = sequelize.define('history',{
    file:Sequelize.STRING,
    text:Sequelize.TEXT
})
History.belongsTo(User);


const Order = sequelize.define('order',{
    orderPrice:Sequelize.FLOAT
})

Order.belongsTo(User);
Order.belongsTo(History);

User.hasMany(History);
User.hasMany(Order);
sequelize.sync();


module.exports = {
    Token:Token,
    Config:Config,
    User:User,
    History:History,
    Order:Order,
    Balance:Balance
}