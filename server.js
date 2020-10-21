const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const {Restaurant, sequelize, Menu, Item} = require('./models')
const data = require('./models/restaurants.json')


const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine','handlebars')

app.get('/', async (request,response) => {
    const restaurants = await Restaurant.findAll({
        include: [{model: Menu, as: 'menus'}],
        nest: true
    })
    response.render('restaurants', {restaurants}
)
})
app.get('/restaurants/:name', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menus = await restaurant.getMenus( {
      include: [{model: Item, as: 'items'}],
        nest: true  
    })
    console.log("get restaurant with name:", req.params.name)
    res.render('restaurantmenus', {restaurant, menus})
})

app.listen(3000, async () => {
    await sequelize.sync()
    .then(async () => {
        const restaurants = await Restaurant.findAll()
        if (restaurants.length > 0) return
        const taskQueue = data.map(async (json_restaurant) => {
                const restaurant = await Restaurant.create({name: json_restaurant.name, image: json_restaurant.image})
                const menus = await Promise.all(json_restaurant.menus.map(async (_menu) => {
                    const items = await Promise.all(_menu.items.map(({name, price}) => Item.create({name, price})))
                    const menu = await Menu.create({title: _menu.title})
                    return menu.setItems(items)
                }))
                return await restaurant.setMenus(menus)
            })
        await Promise.all(taskQueue)
            
    })
 console.log('web server running on port 3000')})