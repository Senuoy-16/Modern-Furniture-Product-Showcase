let iconCart = document.querySelector(".icon_cart")
let body = document.querySelector("body")
let closeCart = document.querySelector(".close")
let listProductHTML = document.querySelector(".listProduct")
let listCart = document.querySelector(".listCart")
let iconCartSpan = document.querySelector(".icon_cart span")


let products = []
let carts = []

iconCart.addEventListener("click", ()=>{
    body.classList.toggle("showCart")
})
closeCart.addEventListener('click', ()=>{
    body.classList.remove("showCart")
})
/*FUNCTIONS*/
function addDataToHTML(){
    listProductHTML.innerHTML = ""
    if(products.length > 0){
        products.forEach(product => {
            let newProduct = document.createElement('div')
            newProduct.classList.add("item")
            newProduct.dataset.id = product.id
            newProduct.innerHTML = `
                <a href="details.html?id=${product.id}">
                    <img src=${product.image} alt=${product.name}>
                </a>
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart" data-id="${product.id}">
                    Add To Cart
                </button>
            `
            listProductHTML.appendChild(newProduct)
        });
    }
}

/**
 * 
 * @param {integer} product_id 
 */
function addTocart(product_id){
    let positionThisProductInCart = carts.findIndex((value)=> value.product_id == product_id)
    if(carts.length <= 0){
        carts = [{
            product_id:product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id:product_id,
            quantity: 1
        })
    }else{
        carts[positionThisProductInCart].quantity++
    }
    addCartToHtml()
    addCartToMemory()
}

function addCartToMemory(){
    localStorage.setItem('cart', JSON.stringify(carts))
}
function addCartToHtml(){
    listCart.innerHTML = ""
    let totalQuantity  = 0
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity += cart.quantity
            let newCart = document.createElement('div')
            newCart.classList.add("item")
            newCart.dataset.id = cart.product_id

            let positionProduct = products.findIndex( (value) => value.id == cart.product_id);
            let info = products[positionProduct]
            
            newCart.innerHTML = `
                <div class="image">
                    <img src=${info.image} alt="img">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    ${info.price * cart.quantity}$
                </div>
                <div class="quantity">
                    <span class="minus">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </span>
                    <span class="total_quantity">${cart.quantity}</span>
                    <span class="plus">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </span>
                    <span class="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </span>
                </div>
            `
            listCart.appendChild(newCart)
        })
    }else{
        let msg = document.createElement('div')
        msg.classList.add("empty_cart")
        msg.innerHTML = "Le panier est vide"
        listCart.appendChild(msg)
    }
    iconCartSpan.innerHTML = totalQuantity;
}

/**
 * 
 * @param {integer} product_id 
 * @param {string} type 
 */
function changeQuantity(product_id, type){
    let positionItem = carts.findIndex((value) => value.product_id == product_id)
    if(positionItem >= 0){
        switch (type){
            case 'plus':
                carts[positionItem].quantity++
                break;
            case 'minus':
                let valuechange = carts[positionItem].quantity - 1
                if(valuechange > 0){
                    carts[positionItem].quantity = valuechange
                }
                break;
            case 'delete':
                carts.splice(positionItem, 1)
                break;
        }
    }
    addCartToMemory()
    addCartToHtml()
}

/*FUNCTIONS*/

listProductHTML.addEventListener('click', (e)=>{
    let positionClick = e.target
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id
        addTocart(product_id)
    }
})

listCart.addEventListener('click', (e)=>{
    let positionClick = e.target
    if(positionClick.parentElement.classList.contains("minus") || positionClick.parentElement.classList.contains("plus") || positionClick.parentElement.classList.contains("delete")){
        let product_id = positionClick.parentElement.parentElement.parentElement.dataset.id
        let type = 'minus'
        if(positionClick.parentElement.classList.contains("plus")){
            type = 'plus'
        }else if(positionClick.parentElement.classList.contains("delete")){
            type = 'delete'
        }
        changeQuantity(product_id, type)
    }
})


const initApp = () => {
    fetch("products.json")
    .then(response => response.json())
    .then((data) => {
        products = data;
        addDataToHTML();
        if(localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHtml();
        }
    });
}
initApp();

