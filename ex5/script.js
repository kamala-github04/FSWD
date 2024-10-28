document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn) {
        loadProducts();
        document.getElementById('app-container').style.display = 'block';
        document.getElementById('login-container').style.display = 'none';
    }

    document.getElementById('login-form').addEventListener('submit', login);
    document.getElementById('product-form').addEventListener('submit', addProduct);  
    document.getElementById('logout-button').addEventListener('click', logout);
    document.getElementById('checkout-button').addEventListener('click', checkout);
    document.getElementById('clear-cart-button').addEventListener('click', clearCart);
});

let cart = [];

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${product.name}</strong>
            <p>Price: Rs.${product.price}</p>
            <p>${product.description}</p>
            <p>Seller: ${product.seller.name} - Contact: ${product.seller.contact}</p>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${product.sold ? 
                `<p class="sold">Sold</p>` : 
                `<button onclick="addToCart(${index})">Add to Cart</button>`}
        `;
        productList.appendChild(li);
    });
}

function addToCart(index) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products[index];
    if (!product.sold) {
        cart.push(product);
        alert(`${product.name} has been added to your cart.`);
        showCart();
    } else {
        alert('This product is sold out.');
    }
}

function showCart() {
    const cartContainer = document.getElementById('cart-container');
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.name}</strong>
            <p>Price: Rs.${item.price}</p>
            <p>${item.description}</p>
            <p>Seller: ${item.seller.name} - Contact: ${item.seller.contact}</p>
            <img src="${item.image}" alt="${item.name}" class="product-image">
            <button onclick="buyFromCart(${index})">Buy</button>
        `;
        cartList.appendChild(li);
    });

    cartContainer.style.display = cart.length > 0 ? 'block' : 'none';
}

function buyFromCart(index) {
    const product = cart[index];
    if (confirm(`Do you want to buy ${product.name}?`)) {
        const products = JSON.parse(localStorage.getItem('products'));
        const productIndex = products.findIndex(p => p.name === product.name && !p.sold);
        if (productIndex !== -1) {
            products[productIndex].sold = true; // Mark as sold
            localStorage.setItem('products', JSON.stringify(products));
            cart.splice(index, 1); // Remove from cart
            alert(`You have purchased ${product.name}!`);
            loadProducts(); // Refresh the product list
            showCart(); // Refresh the cart
        }
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        cart.forEach((item, index) => buyFromCart(index));
    }
}

function clearCart() {
    cart = [];
    showCart();
}

function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (in a real app, use proper authentication methods)
    if (username === 'kamala' && password === 'kamala') {
        localStorage.setItem('loggedIn', 'true');
        document.getElementById('app-container').style.display = 'block';
        document.getElementById('login-container').style.display = 'none';
        loadProducts();
    } else {
        document.getElementById('login-message').innerText = 'Invalid username or password.';
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

function addProduct(e) {
    e.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productDescription = document.getElementById('product-description').value;
    const sellerName = document.getElementById('seller-name').value;
    const sellerContact = document.getElementById('seller-contact').value;
    const productImage = document.getElementById('product-image').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
        const product = {
            name: productName,
            price: productPrice,
            description: productDescription,
            seller: {
                name: sellerName,
                contact: sellerContact,
            },
            image: reader.result,
            sold: false
        };

        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        document.getElementById('product-form').reset();
        loadProducts();
    };

    if (productImage) {
        reader.readAsDataURL(productImage);
    }
}
