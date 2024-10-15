
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
});

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

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${product.name}</strong>
            <p>Price: $${product.price}</p>
            <p>${product.description}</p>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${product.sold ? 
                `<p class="sold">Sold</p>` : 
                `<button onclick="buyProduct(${index})">Buy</button>`}
        `;
        productList.appendChild(li);
    });
}

function addProduct(e) {
    e.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productDescription = document.getElementById('product-description').value;
    const productImage = document.getElementById('product-image').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
        const product = {
            name: productName,
            price: productPrice,
            description: productDescription,
            image: reader.result, // Store image data as a base64 string
            sold: false // Add a sold property
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

function buyProduct(index) {
    const products = JSON.parse(localStorage.getItem('products'));
    if (products[index]) {
        products[index].sold = true; // Mark as sold
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts(); // Refresh the product list
        alert(`You have purchased ${products[index].name}!`);
    }
}
