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

# Add Item / Update Item
![](https://user-images.githubusercontent.com/72231465/97084952-33403380-1612-11eb-9f1a-49c0568a63ff.png)
![](https://user-images.githubusercontent.com/72231465/97084948-2facac80-1612-11eb-992b-354627003dd3.png)

# Update Restaurant / Delete Restaurant
![](https://user-images.githubusercontent.com/72231465/97084630-4d791200-1610-11eb-8e58-5ebb2aea93d4.png)
![](https://user-images.githubusercontent.com/72231465/97084803-50283700-1611-11eb-960d-a87f93f7cdeb.png)
