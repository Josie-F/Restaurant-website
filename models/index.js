const { Sequelize, DataTypes, Model } = require('sequelize')
const path = require('path')
const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, { dialect: 'sqlite', logging: false })
    : new Sequelize({ dialect: 'sqlite', storage: path.join(__dirname, 'data.db'), logging: false})

class Item extends Model { }
class Menu extends Model { }
class Restaurant extends Model { }
Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
}, { sequelize})

Menu.init({
    title: DataTypes.STRING,

}, { sequelize})

Item.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
}, { sequelize})

Restaurant.hasMany(Menu, { as: 'menus' })
Menu.belongsTo(Restaurant)
Menu.hasMany(Item, { as: 'items' })
Item.belongsTo(Menu)


module.exports = {
    Restaurant,
    Menu,
    Item,
    sequelize
}