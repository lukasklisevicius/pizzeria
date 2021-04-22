"use strict"
// pizza 
class Pizza{
    // constructor to create a pizza
    constructor(name,price,heat,toppings,picture){
        this.name = name
        this.price = price
        this.heat = heat,
        this.toppings = toppings
        this.picture = picture
    }
}
//storage
class Storage{
        //get parsed pizza objects 
        static getPizzas(){
            //variable to store
            let pizzas
            if(sessionStorage.getItem('pizzas') === null) {
                pizzas = []
            }else {
                //store in the variable
                pizzas = JSON.parse(sessionStorage.getItem('pizzas'))
            }
            //return veriable
            return pizzas
        }
        // store pizza in the sessionStorage
        static addPizza(pizza){
            //get existing pizzas
            const pizzas = Storage.getPizzas()
            //add new pizza
            pizzas.push(pizza)
            //set new array in the sessionStorage
            sessionStorage.setItem('pizzas',JSON.stringify(pizzas))
        }
        //remove pizza from the sessionStorage
        static removePizza(name){
            //get existing pizzas
            const pizzas = Storage.getPizzas()
            // loop through pizzas array
            pizzas.forEach((pizza,idx) =>{
                // check if the pizza name matches given name
                if(pizza.name === name){
                    //remove from the array pizza of given idx
                    pizzas.splice(idx,1)
                }
            })
            //set new array in the sessionStorage
            sessionStorage.setItem('pizzas',JSON.stringify(pizzas))
        }
    }

//UI 
class UI {
    // display menu of array of pizzas
    static displayMenu(pizzas){
        // foreach pizza display pizza
        pizzas.forEach(pizza => UI.addPizzaToMenu(pizza))
    }
    // remove all displayed pizzas
    static removeMenu(){
        // select container of pizzas
        const allPizzas = document.querySelector('.container')
        //loop through all the pizzas
        while(allPizzas.hasChildNodes()){
            //remove pizzas by one 
            allPizzas.removeChild(allPizzas.firstChild)
        }
    }
    //display pizza in the screen
    static addPizzaToMenu(pizza){
        //select container where pizzas should be displayed
        const container = document.querySelector('.container')
        //create element 'div' for pizzacard
        const pizzaCard = document.createElement('div')
        //give class of pizza
        pizzaCard.classList.add('pizza')
        //set values into html
        pizzaCard.innerHTML = `<img src="${pizza.picture}" alt="pizzaPic">
        <div class="head">
        <h3 class="pizza-name">${pizza.name}</h3>
        <div class="peppers">
        ${this.displayHeat(pizza)}    
        </div>
        </div>
        <p>${pizza.toppings}</p>
        <p>Price: ${pizza.price} &#128;</p>
        <button class="delete">Delete</button>`
        // append into container
        container.appendChild(pizzaCard)
    }
    //display heat value in peppers
    static displayHeat(pizza){
        // create epmty string
        let displayHeatString = ""
        //loop till the max value of heat
        for(let i=0;i<=3;i++){
            // check if there is a heat value in pizza
            if(i == 0 || pizza.heat == ""){
                // if not, string left empty
                displayHeatString = ""
            }else if(i<=pizza.heat){
                // add to sting pepper by one at the time
                displayHeatString += '<img src="pepper.png" alt="pepper">'
            }
        }
        //return string
        return displayHeatString
    }    
    //clear form input fields
    static clearFields(){
        //select and set value to empty string
        document.querySelector('#name').value = ''
        document.querySelector('#price').value = ''
        document.querySelector('#heat').value = ''
        document.querySelector('#toppings').value = ''
        pictureUrl = ''
        //remove active class form selected picture
        document.querySelector('.picture').classList.remove('active')
    }
    // display alert message
    static displayError(msg,className){
        // create element
        const alert = document.createElement('div')
        // add classes
        alert.className = `msg ${className}`
        //apend child
        alert.appendChild(document.createTextNode(msg))
        //select div of form
        const body = document.querySelector('.add-to-menu')
        // select form
        const form = document.querySelector('#add-pizza-form')
        //insert created alert before form
        body.insertBefore(alert,form)
        setTimeout(() => alert.remove(), 3500)
    }
    // remove pizza form UI
    static removeFromMenu(target){
        target.parentElement.remove()
    }
    //sorting
    static sortPizza(){
        //get sort value
        let sortValue = UI.getSortValue()
        // create empty array
        let sortedArr =[]
        // get pizzas from sessionStorage
        let pizzas = Storage.getPizzas()
            //check if sort value equals sort type
            if(sortValue == "name"){
                //give empty array of sorted sessionStorage 
                sortedArr = pizzas.sort((a,b)=>(a.name > b.name)? 1: -1)
                //remove old displayed data
                UI.removeMenu()
                //display new array
                UI.displayMenu(sortedArr)
            }else if(sortValue == "price"){
                sortedArr = pizzas.sort((a,b)=>(a.price < b.price)? 1: -1)
                UI.removeMenu()
                UI.displayMenu(sortedArr)
            }else if(sortValue == "heat"){
                sortedArr = pizzas.sort((a,b)=>(a.heat<b.heat)? 1: -1)
                UI.removeMenu()
                UI.displayMenu(sortedArr)
            }
        
    }
    // get sort value
    static getSortValue(){
        //select selection in html, and set variable to that value
        let sortValue = document.getElementById('sort-by').value
        // return value
        return sortValue
    }
}

//listeners
//display pizzas on load
window.addEventListener('DOMCOntentLoaded',UI.sortPizza())

// listen on key "-"
//select where we can't get negative value
const number = document.querySelector('#price');
// on keydown listener check for the keycode and return falese
number.onkeydown = function(e){
    if((e.keyCode === 109 || e.keyCode === 189)){
        return false
    }
}
const heat = document.querySelector('#heat')
heat.onkeydown = function(e){
    if((e.keyCode === 109 || e.keyCode === 189)){
        return false
    }
}

//get pizza picture url
//select div of all pictures
const picturesForm = document.querySelector('.pictures')
//select pictures
const pictures = document.querySelectorAll('.picture')
//create empty string
let pictureUrl = ""
// listen on clicked picture
picturesForm.onclick = e =>{
    //create veriable of the img target classlist
    const eClassList = e.target.classList
    //check if class list of target contains active 
    if(!eClassList.contains('active')){
        // if contains,loop through all pictures and remove active classes
        pictures.forEach(picture => picture.classList.remove('active'));
        // and add active class to only one clicked
        eClassList.add('active')
        // set string value of img src
        pictureUrl = e.target.src
    }
}

//submit form, and create ne pizza
//select form
const form = document.querySelector('#add-pizza-form')
//select submit btn
const btn = document.querySelector('#add-pizza-btn')
//select sort value
const sort = document.querySelector('.sort-by')
    //on submit clicked
    form.addEventListener('submit',(e)=>{
        e.preventDefault()
        //get form inputs values
        const name = document.querySelector('#name').value
        const price = document.querySelector('#price').value
        const heat = document.querySelector('#heat').value
        //get and set string to array
        const toppings = document.querySelector('#toppings').value.split(', ')
        //set picture value of active picture
        const picture = pictureUrl


        //validation
        //check if required inputs ar not empty
        if(name == "" || price === "" || toppings === []){   //display alert
            UI.displayError('Name, Price and Toppings fields are required!','err')
        // if price is negative
        }else if(price < 0){
            UI.displayError('Price can not be less than zero!','err')
        // if toppings list is to short
        }else if(toppings.length<=1){
            UI.displayError('Should be at least 2 toppings on the pizza!','err')
        }else{
        // if no errors create new pizza
        const pizza = new Pizza(name,price,heat,toppings,picture)
        //store pizza into sessionStorage
        Storage.addPizza(pizza)
        //sort pizzas
        UI.sortPizza()
        //display alert
        UI.displayError('Submited', 'win')
        // clear input fields
        UI.clearFields()
        }
    }   
)
//delete pizza
// select pizza in html
const pizzaCard = document.querySelector('.pizza')
// create click listener for element
pizzaCard.addEventListener('click', (e) => {
    //set variable of clicked target
    let clicked = e.target
    // get that clicked target's parent element
    let getCard = clicked.parentElement
    // select the name of the pizza
    let getName = getCard.querySelector('.pizza-name').innerText
    // check if clicked target contains class 'delete'
    if((clicked.classList.contains('delete'))){
        // if true, remove from UI and remove from sessionStorage
        UI.removeFromMenu(clicked)
        Storage.removePizza(getName)
        }
    }
)

//sort 
// select sort btn
const sortBtn = document.querySelector('#sort')
// on click run sort function
sortBtn.addEventListener('click', UI.sortPizza())
