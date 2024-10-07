document.addEventListener('DOMContentLoaded', loadProducts);
document.getElementById('product-form').addEventListener('submit', addProduct);

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

    const product = {
        name: productName,
        price: productPrice,
        description: productDescription,
        sold: false // Add a sold property
    };

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    document.getElementById('product-form').reset();
    loadProducts();
}

// Function to buy a product
function buyProduct(index) {
    const products = JSON.parse(localStorage.getItem('products'));
    if (products[index]) {
        products[index].sold = true; // Mark as sold
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts(); // Refresh the product list
        alert(`You have purchased ${products[index].name}!`);
    }
}
