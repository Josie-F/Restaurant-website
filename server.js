const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const app = express()
const { Restaurant, sequelize, Menu, Item } = require('./models')
const data = require('./models/restaurants.json')
const { restart } = require('nodemon')

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (request, response) => {
    const restaurants = await Restaurant.findAll({
        include: [{ model: Menu, as: 'menus' }],
        nest: true
    })
    response.render('restaurants', { restaurants }
    )
})
app.post('/', async (req, res) => {
    await Restaurant.create(req.body)
    res.redirect('/')
})
app.get('/restaurants/:name/delete', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    restaurant.destroy()
    res.redirect('/')
})
app.get('/menus/:menu_id/delete', async (req, res) => {
    const menu = await Menu.findByPk(req.params.menu_id)
    const restaurant = await Restaurant.findByPk(menu.RestaurantId)
    menu.destroy()
    res.redirect('/restaurants/' + restaurant.name)
})
app.get('/items/:item_id/deleteitem', async (req, res) => {
    console.log(req.params.item_id)
    const item = await Item.findByPk(req.params.item_id)
    const menu = await Menu.findOne({ where: { id: item.MenuId } })
    const restaurant = await Restaurant.findByPk(menu.RestaurantId)
    item.destroy()
    res.redirect('/restaurants/' + restaurant.name)
})
app.post('/restaurants/:name', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    await restaurant.update(req.body)
    res.redirect('/restaurants/' + req.body.name)
})
app.post('/restaurants/:name/:title/:item_id/updateitem', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menu = await Menu.findOne({ where: { title: req.params.title, RestaurantId: restaurant.id } })
    const item = await Item.findByPk(req.params.item_id)
    await item.update(req.body)
    res.redirect('/restaurants/' + req.params.name)
})
app.post('/restaurants/:name/:title/updatemenu', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menu = await Menu.findOne({ where: { title: req.params.title, RestaurantId: restaurant.id } })
    await menu.update(req.body)
    res.redirect('/restaurants/' + req.params.name)
})
app.post('/restaurants/:name/newmenu', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menu = await Menu.create({ title: req.body.title, RestaurantId: restaurant.id })
    restaurant.addMenu(menu)
    console.log(req.body)
    res.redirect('/restaurants/' + req.params.name)
})
app.post('/restaurants/:name/:title', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menus = await restaurant.getMenus({
        include: [{ model: Item, as: 'items' }],
        nest: true
    })
    const menu = await Menu.findOne({ where: { title: req.params.title, RestaurantId: restaurant.id } })
    const item = await Item.create({ name: req.body.name, price: req.body.price, menuId: menu.id });
    menu.addItem(item)
    res.redirect('/restaurants/' + req.params.name)
})
app.get('/restaurants/:name', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menus = await restaurant.getMenus({
        include: [{ model: Item, as: 'items' }],
        nest: true
    })
    console.log("get restaurant with name:", req.params.name)
    res.render('restaurantmenus', { restaurant, menus })
})
app.listen(3000, async () => {
    await sequelize.sync()
        .then(async () => {
            const restaurants = await Restaurant.findAll()
            if (restaurants.length > 0) return
            const taskQueue = data.map(async (json_restaurant) => {
                const restaurant = await Restaurant.create({ name: json_restaurant.name, image: json_restaurant.image })
                const menus = await Promise.all(json_restaurant.menus.map(async (_menu) => {
                    const items = await Promise.all(_menu.items.map(({ name, price }) => Item.create({ name, price })))
                    const menu = await Menu.create({ title: _menu.title })
                    return menu.setItems(items)
                }))
                return await restaurant.setMenus(menus)
            })
            await Promise.all(taskQueue)

        })
    console.log('web server running on port 3000')
})