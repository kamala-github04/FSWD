const menus = {
  northIndianDhaba: [
    { name: 'Paneer Butter Masala', price: 250, image: 'paneer_butter_masala.jpg' },
    { name: 'Dal Makhani', price: 180, image: 'dal_makhani.jpg' },
    { name: 'Butter Naan', price: 40, image: 'butter_naan.jpg' },
  ],
  southIndianCafe: [
    { name: 'Masala Dosa', price: 120, image: 'masala_dosa.jpg' },
    { name: 'Idli Sambhar', price: 80, image: 'idli_sambhar.jpg' },
    { name: 'Vada', price: 50, image: 'vada.jpg' },
  ],
  streetFoodBazaar: [
    { name: 'Pani Puri', price: 50, image: 'pani_puri.jpg' },
    { name: 'Chole Bhature', price: 100, image: 'chole_bhature.jpg' },
    { name: 'Aloo Tikki', price: 60, image: 'aloo_tikki.jpg' },
  ],
};

const order = JSON.parse(localStorage.getItem('order')) || [];
const total = localStorage.getItem('total') || 0;
document.getElementById('total-amount').innerText = total;

document.getElementById('login-btn').addEventListener('click', function() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('restaurant-section').style.display = 'block';
});

function displayOrder() {
  const orderList = document.getElementById('order-list');
  orderList.innerHTML = '';
  
  order.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${item.name} - Rs.${item.price} 
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
  
  let totalAmount = Number(localStorage.getItem('total')) || 0;
  totalAmount -= removedItem.price;
  localStorage.setItem('total', totalAmount);
  
  order.splice(index, 1);
  localStorage.setItem('order', JSON.stringify(order));
  
  document.getElementById('total-amount').innerText = totalAmount;
  displayOrder();
}

function showMenu() {
  const restaurantSelect = document.getElementById('restaurant-select');
  const selectedRestaurant = restaurantSelect.value;
  
  const menuItemsContainer = document.getElementById('menu-items');
  menuItemsContainer.innerHTML = ''; 
  
  if (selectedRestaurant && menus[selectedRestaurant]) {
    menus[selectedRestaurant].forEach(item => {
      const div = document.createElement('div');
      div.classList.add('menu-item');
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="menu-item-image">
        <h2>${item.name}</h2>
        <button class="order-button" onclick="addToOrder('${item.name}', ${item.price})">Order for Rs.${item.price}</button>
      `;
      menuItemsContainer.appendChild(div);
    });
  }
}

function openAddressPopup() {
  if (order.length === 0) {
    alert("Your order is empty!");
    return;
  }
  document.getElementById('address-popup').style.display = 'flex';
}

function closeAddressPopup() {
  document.getElementById('address-popup').style.display = 'none';
}

function toggleCardDetails() {
  const paymentMethod = document.getElementById('payment').value;
  const cardDetails = document.getElementById('card-details');

  // Show or hide the card details based on payment method
  if (paymentMethod === 'creditCard') {
    cardDetails.style.display = 'block'; // Show the card details section
  } else {
    cardDetails.style.display = 'none';  // Hide the card details section
  }
}
function confirmOrder() {
  const address = document.getElementById('address').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const paymentMethod = document.getElementById('payment').value;

  if (!address || !phone || !email) {
    alert("Please fill out all required details.");
    return;
  }

  if (paymentMethod === 'creditCard') {
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCVV = document.getElementById('card-cvv').value;

    if (!cardNumber || !cardExpiry || !cardCVV) {
      alert("Please enter all credit card details.");
      return;
    }
  }

  // Display confirmation popup
  document.getElementById('address-popup').style.display = 'none';
  const orderDetails = document.getElementById('order-details');
  orderDetails.innerHTML = `
    <p>Address: ${address}</p>
    <p>Phone: ${phone}</p>
    <p>Email: ${email}</p>
    <p>Payment Method: ${paymentMethod}</p>
    <ul>${order.map(item => `<li>${item.name} - Rs.${item.price}</li>`).join('')}</ul>
  `;
  document.getElementById('popup-total-amount').innerText = localStorage.getItem('total');
  document.getElementById('confirmation-popup').style.display = 'flex';

  // Show rating popup after confirmation
  setTimeout(() => {
    document.getElementById('confirmation-popup').style.display = 'none';
    document.getElementById('rating-popup').style.display = 'flex';
  }, 3000);
}

function closeConfirmationPopup() {
  document.getElementById('confirmation-popup').style.display = 'none';
}

function closeRatingPopup() {
  document.getElementById('rating-popup').style.display = 'none';
}

function submitRating() {
  const rating = document.getElementById('rating').value;
  if (rating < 1 || rating > 5) {
    alert("Please provide a valid rating between 1 and 5.");
    return;
  }
  alert(`Thank you for your rating of ${rating}!`);
  closeRatingPopup();
  localStorage.clear();  // Clear the order after submission
  window.location.reload();  // Reload the page for a new order
}
  
  
