// Restaurant menus
const menus = {
  italianBistro: [
    { name: 'Margherita Pizza', price: 12 },
    { name: 'Fettuccine Alfredo', price: 15 },
    { name: 'Caesar Salad', price: 8 },
  ],
  sushiHouse: [
    { name: 'Sashimi Platter', price: 20 },
    { name: 'California Roll', price: 12 },
    { name: 'Miso Soup', price: 5 },
  ],
  tacoPalace: [
    { name: 'Beef Tacos', price: 10 },
    { name: 'Chicken Quesadilla', price: 9 },
    { name: 'Guacamole', price: 6 },
  ],
};

// Load previous order from local storage
const order = JSON.parse(localStorage.getItem('order')) || [];
const total = localStorage.getItem('total') || 0;
document.getElementById('total-amount').innerText = total;

function displayOrder() {
  const orderList = document.getElementById('order-list');
  orderList.innerHTML = '';
  
  order.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${item.name} - $${item.price} 
      <button onclick="removeFromOrder(${index})">Remove</button>`;
    orderList.appendChild(div);
  });
}

function addToOrder(name, price) {
  order.push({ name, price });
  localStorage.setItem('order', JSON.stringify(order));
  
  let totalAmount = Number(localStorage.getItem('total')) || 0;
  totalAmount += price;
  localStorage.setItem('total', totalAmount);
  
  document.getElementById('total-amount').innerText = totalAmount;
  displayOrder();
}

function removeFromOrder(index) {
  const removedItem = order[index];
  
  // Update total amount
  let totalAmount = Number(localStorage.getItem('total')) || 0;
  totalAmount -= removedItem.price;
  localStorage.setItem('total', totalAmount);
  
  // Remove item from order
  order.splice(index, 1);
  localStorage.setItem('order', JSON.stringify(order));
  
  document.getElementById('total-amount').innerText = totalAmount;
  displayOrder();
}

function showMenu() {
  const restaurantSelect = document.getElementById('restaurant-select');
  const selectedRestaurant = restaurantSelect.value;
  
  const menuItemsContainer = document.getElementById('menu-items');
  menuItemsContainer.innerHTML = ''; // Clear previous menu
  
  if (selectedRestaurant && menus[selectedRestaurant]) {
    menus[selectedRestaurant].forEach(item => {
      const div = document.createElement('div');
      div.classList.add('menu-item');
      div.innerHTML = `
        <h2>${item.name}</h2>
        <button onclick="addToOrder('${item.name}', ${item.price})">Order for $${item.price}</button>
      `;
      menuItemsContainer.appendChild(div);
    });
  }
}

function confirmOrder() {
  if (order.length === 0) {
    alert("Your order is empty!");
    return;
  }

  alert(`Order confirmed! Total: $${localStorage.getItem('total')}`);
  
  // Clear the order and total from local storage
  localStorage.removeItem('order');
  localStorage.removeItem('total');
  
  // Reset order display
  document.getElementById('total-amount').innerText = '0';
  document.getElementById('order-list').innerHTML = '';
  
  order.length = 0; // Clear the array
}

// Display order on page load
displayOrder();
  
  
