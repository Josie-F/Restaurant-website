# Dynamic Restaurant Website 

## Home page w/ restaurant cards
![](https://user-images.githubusercontent.com/72231465/97084049-2c162700-160c-11eb-9ba4-62bb36de90e7.png)


### When hovering over a restaurant card, the name of the menus are displayed

![](https://user-images.githubusercontent.com/72231465/97084063-4819c880-160c-11eb-9e77-b2823354df17.png)

### In the bottom left page of the restaurant home page there is a button which will prompt a form to create a new restaurant
![](https://user-images.githubusercontent.com/72231465/97084164-f9206300-160c-11eb-8ad4-eaee7ba32a3c.png)
![](https://user-images.githubusercontent.com/72231465/97084483-4271b200-160f-11eb-870a-1373520ab107.png)

### This show and close form is done by using the onclick event

```javascript
<button class="open-button" onclick="openForm()">Create a restaurant</button>
            ----
<button type="button" class="btn cancel" onclick="closeForm()">Close</button>

<script>
  function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
</script>
```

## Individual Restaurant page
### When you click a card on the main page you are taken to that specific restaurant's page
![](https://user-images.githubusercontent.com/72231465/97084411-b19ad680-160e-11eb-91c5-1a50fc6811fb.png)
### Here you can edit both the restaurant's name, the menus, add menus and items to the specific menu
### The forms are all made with the onclick event


# Update Menu / New Menu
![](https://user-images.githubusercontent.com/72231465/97084916-0855df80-1612-11eb-8ff1-5ae75ee89151.png)
![](https://user-images.githubusercontent.com/72231465/97084938-27547180-1612-11eb-86b3-d4cd3d9c0d6d.png)

#### Creating a new menu is done by the post request 
```javascript
app.post('/restaurants/:name/newmenu', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menu = await Menu.create({ title: req.body.title, RestaurantId: restaurant.id })
    restaurant.addMenu(menu)
    res.redirect('/restaurants/' + req.params.name)
})
```
# Add Item / Update Item
![](https://user-images.githubusercontent.com/72231465/97084952-33403380-1612-11eb-9f1a-49c0568a63ff.png)
#### Adding an item to a particular menu which belongs to a specific restaurantId is done with post
```javascript
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
```
![](https://user-images.githubusercontent.com/72231465/97084948-2facac80-1612-11eb-992b-354627003dd3.png)

#### Updating an item is done via post and using update() on the item that you are updating
```javascript
app.post('/restaurants/:name/:title/:item_id/updateitem', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    const menu = await Menu.findOne({ where: { title: req.params.title, RestaurantId: restaurant.id } })
    const item = await Item.findByPk(req.params.item_id)
    await item.update(req.body)
    res.redirect('/restaurants/' + req.params.name)
})
```
#### When you open the edit form, the value in the input field will already be filled with the values it currently has. This is asserted in the onclick event by finding the id of the particular input field
```javascript
<div class="form-popup" id="editItem">
        <form action="/restaurants/{{restaurant.name}}/" id="editItemForm" method="POST" class="form-container">
            <h4 style="text-align: center;">Edit Item</h4>
            <label><b>Item name</b></label>
            <input type="text" placeholder="Set item name" name="name" value="" id="Iname">

            <label><b>Item price</b></label>
            <input type="number" placeholder="Set item price" name="price" value="" id="Iprice">
            <div class="add-item">
                <button type="submit" class="btn">Update</button>
                <button type="button" class="btn cancel" onclick="editItemClose()">Close</button>
            </div>
        </form>
    </div>
<script>
function editItem(id, title, name, price) {
        document.getElementById('editItem').style.display = "block";
        document.getElementById('editItemForm').action = document.getElementById("editItemForm").action + title + "/" + id + "/updateitem"
        document.getElementById('Iname').value = name;
        document.getElementById('Iprice').value = price;
    }
    function editItemClose() {
        document.getElementById('editItem').style.display = "none";
    }
</script>
```

# Update Restaurant / Delete Restaurant
![](https://user-images.githubusercontent.com/72231465/97084630-4d791200-1610-11eb-8e58-5ebb2aea93d4.png)
![](https://user-images.githubusercontent.com/72231465/97084803-50283700-1611-11eb-960d-a87f93f7cdeb.png)

#### Deleting a restaurant is done in the server using get method and destroy
```javascript
app.get('/restaurants/:name/delete', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    restaurant.destroy()
    res.redirect('/')
})
```
#### Updating the name of a restaurant is done with post
```javascript
app.post('/restaurants/:name', async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { name: req.params.name } })
    await restaurant.update(req.body)
    res.redirect('/restaurants/' + req.body.name)
})
```
