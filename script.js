let items_data = []

// Function to fetch and populate JSON data
async function fetchAndPopulate() {
    let data = []
    try {
        const response = await fetch('./data.json'); // Fetch JSON from folder
        data = await response.json(); // Convert response to JSON

        const menuContainer = document.getElementById('menu-item-wrapper');
        menuContainer.innerHTML = ''; // Clear previous content

        data.forEach(product => {
            let menuCardWrapper = document.createElement('div')
            menuCardWrapper.classList.add('menu-card-wrapper')
            menuContainer.appendChild(menuCardWrapper)

            let id = getID(product["category"])
            let productImage = document.createElement('img')
            productImage.classList.add('item-image')
            productImage.src = product["image"]["desktop"]
            menuCardWrapper.appendChild(productImage)

            let productActionbuttons = document.createElement('div');
            productActionbuttons.classList.add('item-action', 'item-action-buttons')
            productActionbuttons.id = id
            productActionbuttons.innerHTML = `<img class="icon icon-add-to-cart" src="./assets/images/icon-add-to-cart.svg" alt="add to cart Icon"><span class="icon-add-to-cart-title" >Add to Cart</span>`;
            menuCardWrapper.appendChild(productActionbuttons)

            let productActionbuttonsSelected = document.createElement('div');
            productActionbuttonsSelected.classList.add('item-action-buttons', 'item-action-buttons-selected')
            productActionbuttonsSelected.id = id
            menuCardWrapper.appendChild(productActionbuttonsSelected)

            let productDecrementWrapper = document.createElement('div');
            productDecrementWrapper.classList.add('icon-wrapper', 'icon-decrement')
            productDecrementWrapper.id = id
            productDecrementWrapper.innerHTML = `<img class="icon-selected icon-decrement-quantity" src="./assets/images/icon-decrement-quantity.svg" alt="decrement cart Icon">`
            productActionbuttonsSelected.appendChild(productDecrementWrapper)

            let productQuantity = document.createElement('span');
            productQuantity.classList.add('cart-quantity', `${id}`)
            productQuantity.textContent = 1
            productActionbuttonsSelected.appendChild(productQuantity)            

            let productIncrementWrapper = document.createElement('div');
            productIncrementWrapper.classList.add('icon-wrapper', 'icon-increment')
            productIncrementWrapper.id = id
            productIncrementWrapper.innerHTML = `<img class="icon-selected icon-increment-quantity" src="./assets/images/icon-increment-quantity.svg" alt="increment cart Icon">`
            productActionbuttonsSelected.appendChild(productIncrementWrapper)

            let productItemName = document.createElement('div');
            productItemName.classList.add('item-name', 'menu-item')
            productItemName.textContent = product["category"]
            menuCardWrapper.appendChild(productItemName)

            let productItemdescription = document.createElement('div');
            productItemdescription.classList.add('item-description', 'menu-item')
            productItemdescription.textContent = product["name"]
            menuCardWrapper.appendChild(productItemdescription)

            let productItemPrice = document.createElement('div');
            productItemPrice.classList.add('item-description', 'menu-item')
            productItemPrice.textContent = "$"+parseFloat(product["price"]).toFixed(2)
            menuCardWrapper.appendChild(productItemPrice)
        });
        return data
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null
    }
}

// Call function to load data
fetchAndPopulate().then(data => {
    console.log("Data received:", data);
    items_data = data
    renderCarts()
});

function updateCarts(){
    document.querySelectorAll('.item-action').forEach(parentElement => {
        id = parentElement.id
        let counter = parseInt(localStorage.getItem(id))
        let newparent = parentElement.nextElementSibling;
        if(counter>=1) {
            parentElement.style.display = 'none';
            if (newparent) {
                newparent.style.display = 'flex';
                let quantityElement = newparent.querySelector('.cart-quantity');
                quantityElement.textContent = counter
            } 
        }
        else {
            parentElement.style.display = 'flex';
            newparent.style.display = 'none';
        }
    });
    populateCartSummary()
}

function populateCartSummary() {
    console.log("Populate cart")
    console.log(items_data)
    console.log(Object.keys(localStorage))
    const cartTitle = document.querySelector('.cart-title');
    const sum = Object.keys(localStorage).reduce((result, product_id) => { return result+parseInt(localStorage.getItem(product_id)); }, 0);
    cartTitle.textContent = `Your Cart(${sum})`
    const cartWrapper = document.querySelector('.cart-items-wrapper');
    cartWrapper.innerHTML = ''
    let totalPrice = 0
    if(sum==0) {
        let emptyOrderWrapper = document.createElement('div');
        emptyOrderWrapper.classList.add('empty-order-wrapper')
        emptyOrderWrapper.innerHTML = `<img class="empty-order" src="./assets/images/illustration-empty-cart.svg" alt="empty order"><span class="empty-order-text">Your added items will be added here</span>`
        cartWrapper.appendChild(emptyOrderWrapper)


    }
    else {
        Object.keys(localStorage).forEach(function(product_id){
            product_count = localStorage.getItem(product_id)
            if(parseInt(product_count)>0) {
                console.log("fetch product")
                product = getItemDetails(product_id)
                console.log(product)
                let cartItemWrapper = document.createElement('div');
                cartItemWrapper.classList.add('cart-item-wrapper')
                cartWrapper.appendChild(cartItemWrapper)
    
                // cart item info
                let cartItemInfoWrapper = document.createElement('div');
                cartItemInfoWrapper.classList.add('cart-item-info-wrapper')
                cartItemWrapper.appendChild(cartItemInfoWrapper)
                
                // cart item title
                let cartItemTitle = document.createElement('div');
                cartItemTitle.classList.add('cart-item-title')
                cartItemTitle.textContent = product["name"]
                cartItemInfoWrapper.appendChild(cartItemTitle)
    
                // cart item info
                let cartItemExtraInfo = document.createElement('div');
                cartItemExtraInfo.classList.add('cart-item-extra-info')
                cartItemInfoWrapper.appendChild(cartItemExtraInfo)
    
                let cartQuantity = document.createElement('span')
                cartQuantity.classList.add('cart-item-quantity')
                cartQuantity.textContent = product_count+"x"
                cartItemExtraInfo.appendChild(cartQuantity)
    
                let cartUnitPrice = document.createElement('span')
                cartUnitPrice.classList.add('cart-item-unit-price')
                cartUnitPrice.textContent = "@ $"+parseFloat(product["price"]).toFixed(2);
                cartItemExtraInfo.appendChild(cartUnitPrice)
    
                let cartTotalPrice = document.createElement('span')
                cartTotalPrice.classList.add('cart-item-unit-price')
                const itemTotalPrice = (parseFloat(product["price"]).toFixed(2)*parseFloat(product_count)).toFixed(2)
                cartTotalPrice.textContent = "$"+itemTotalPrice
                cartItemExtraInfo.appendChild(cartTotalPrice)
                totalPrice = parseFloat(totalPrice)+parseFloat(itemTotalPrice)
    
                // remove item
                let cartItemRemoveWrapper = document.createElement('div');
                cartItemRemoveWrapper.classList.add('cart-item-remove-wrapper', 'icon-wrapper')
                cartItemRemoveWrapper.id = product_id
                cartItemWrapper.appendChild(cartItemRemoveWrapper)
    
                let cartRemoveSvg = document.createElement('img')
                cartRemoveSvg.classList.add('cart-item-remove','icon-selected')
                cartRemoveSvg.src = './assets/images/icon-remove-item.svg'
                cartItemRemoveWrapper.appendChild(cartRemoveSvg)
    
                cartItemRemoveWrapper.addEventListener('click', function() {
                    let counter = 0;
                    localStorage.setItem(product_id, counter); 
                    console.log(JSON.stringify(localStorage))
                    updateCounter(product_id, counter)
                });
            } 
        });
    
        // Order total
        let orderTotalWrapper = document.createElement('div');
        orderTotalWrapper.classList.add('order-total-wrapper')
        cartWrapper.appendChild(orderTotalWrapper)
    
        let orderTotalTitle = document.createElement('div')
        orderTotalTitle.classList.add('order-total-title')
        orderTotalTitle.textContent = 'Order Total'
        orderTotalWrapper.appendChild(orderTotalTitle)
    
        let orderTotal = document.createElement('div')
        orderTotal.classList.add('order-total')
        orderTotal.textContent = '$'+parseFloat(totalPrice).toFixed(2)
        orderTotalWrapper.appendChild(orderTotal)
    
        let orderCarbonWrapper = document.createElement('div');
        orderCarbonWrapper.classList.add('order-carbon-wrapper')
        orderCarbonWrapper.innerHTML = `<img class="icon-carbon" src="./assets/images/icon-carbon-neutral.svg" alt="carbon neutral Icon">`
        let carbonNeutral = document.createElement('span')
        carbonNeutral.classList.add('carbon-neutral')
        carbonNeutral.innerHTML = 'This is a <b>carbon-neutral</b> delivery'
        orderCarbonWrapper.appendChild(carbonNeutral)
        cartWrapper.appendChild(orderCarbonWrapper)
    
        let confirmOrderWrapper = document.createElement('div');
        confirmOrderWrapper.classList.add('confirm-order-wrapper')
        confirmOrderWrapper.innerHTML = `<span class="confirm-order"> Confirm Order </span>`
        cartWrapper.appendChild(confirmOrderWrapper)
    
    }
        
}

function renderCarts() {
    updateCarts()
    populateCartSummary()
    document.querySelectorAll('.item-action').forEach(parentElement => {
        parentElement.addEventListener('click', function() {
            let counter = parseInt(localStorage.getItem(this.id))+1 || 1;
            console.log(localStorage.getItem(this.id))
            console.log(counter)
            localStorage.setItem(this.id, counter); 
            console.log(JSON.stringify(localStorage))
            let quantityElement = document.querySelector(`.cart-quantity.${this.id}`);
            quantityElement.textContent = counter
            updateCarts()
        });
    });
    document.querySelectorAll('.icon-increment').forEach(button => {
        button.addEventListener('click', function() {
            let counter = parseInt(localStorage.getItem(this.id))+1 || 1;
            localStorage.setItem(this.id, counter); 
            console.log(JSON.stringify(localStorage))
            updateCounter(this.id, counter)
        });
    });
    document.querySelectorAll('.icon-decrement').forEach(button => {
        button.addEventListener('click', function() {
            let counter = parseInt(localStorage.getItem(this.id))-1 || 0;
            localStorage.setItem(this.id, counter); 
            console.log(JSON.stringify(localStorage))
            updateCounter(this.id, counter)
        });
    });
}

function getID(str) {
    return str.replace(" ","").toLowerCase()
}

function getItemDetails(id){
    console.log(id)
    console.log(items_data)
    const item_result = items_data.find(item => getID(item["category"]) === id);
    return item_result
}

function updateCounter(id, count) {
    let quantityElement = document.querySelector(`.cart-quantity.${id}`);
    quantityElement.textContent = count;
    updateCarts()
}

