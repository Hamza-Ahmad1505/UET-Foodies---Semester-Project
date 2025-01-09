// Fetch all hotels and create their sections on the home page
axios.get('http://localhost:3000/api/hotels')
  .then(response => {
    const hotels = response.data.hotels;
    createHotelSection(hotels);
  })
  .catch(error => console.error('Error fetching hotels:', error));

// Function to dynamically create hotel sections
function createHotelSection(hotels) {
  const hotelsContainer = document.getElementById('hotels');
  hotelsContainer.innerHTML = ''; // Clear previous content

  hotels.forEach((hotel, index) => {
    const hotelDiv = document.createElement('div');
    hotelDiv.classList.add('hotel');
    hotelDiv.style.background = `linear-gradient(135deg, hsl(${index * 45}, 70%, 60%), hsl(${(index * 45) + 20}, 70%, 50%))`;

    hotelDiv.innerHTML = `
      <h3>${hotel.name}</h3>
      <button class="show-menu" data-id="${hotel._id}" onclick="navigateToMenu('${hotel._id}')">Show Menu</button>
    `;
    hotelsContainer.appendChild(hotelDiv);
  });
}

// Function to navigate to the menu page with the selected hotel ID
function navigateToMenu(hotelId) {
  localStorage.setItem('selectedHotelId', hotelId); // Store hotel ID in local storage
  window.location.href = 'foodmenu.html'; // Navigate to the menu page
}

// Function to fetch and display the menu for a specific hotel on the menu page
function showMenu(hotelId) {
  console.log('Fetching menu for hotel ID:', hotelId);

  axios.get(`http://localhost:3000/api/menus`) // Fetch all menus
    .then(response => {
      const allMenus = response.data.menus || []; // Default to an empty array
      console.log('All Menus:', allMenus);

      // Filter menus for the specific hotel
      const filteredMenus = allMenus.filter(menu => menu.hotel.toString() === hotelId); // Ensure proper comparison

      console.log('Filtered Menus:', filteredMenus);

      const menuBody = document.querySelector('.menu-body');
      menuBody.innerHTML = ''; // Clear any existing content

      if (filteredMenus.length === 0) {
        menuBody.innerHTML = `<p>No menu available for this hotel.</p>`;
        return;
      }

      // Display filtered menu items in a grid layout
      filteredMenus.forEach(food => {
        const foodDiv = document.createElement('div');
        foodDiv.className = 'menu-item';
        foodDiv.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #ccc;
          padding: 10px;
          margin: 10px;
          border-radius: 8px;
        `;

        const foodImage = document.createElement('img');
        foodImage.src = food.url; // Use `url` from your backend response
        foodImage.alt = food.name;
        foodImage.style.cssText = `
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        `;

        const foodName = document.createElement('h3');
        foodName.textContent = food.name;

        const foodPrice = document.createElement('p');
        foodPrice.innerHTML = `Price: <strong>${food.price.toFixed(2)}</strong>`;


        foodDiv.appendChild(foodImage);
        foodDiv.appendChild(foodName);
        foodDiv.appendChild(foodPrice);

        menuBody.appendChild(foodDiv);
      });

      // Apply grid layout to the menu body
      const menuBodyStyles = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
      `;
      menuBody.style.cssText = menuBodyStyles;
    })
    .catch(error => {
      console.error('Error fetching foods:', error);
      const menuBody = document.querySelector('.menu-body');
      menuBody.innerHTML = '<p>Failed to load the menu. Please try again later.</p>';
    });
}

// Check if the page is the menu page and load the menu
if (window.location.pathname.endsWith('foodmenu.html')) {
  const hotelId = localStorage.getItem('selectedHotelId');
  if (hotelId) {
    showMenu(hotelId); // Fetch and display the menu
  } else {
    console.error('No hotel ID found!');
    const menuBody = document.querySelector('.menu-body');
    menuBody.innerHTML = '<p>No hotel selected. Please go back and select a hotel.</p>';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.show-menu-btn').forEach(button => {
    button.addEventListener('click', event => {
      const hotelId = event.target.dataset.hotelId;
      localStorage.setItem('selectedHotelId', hotelId);
      window.location.href = 'foodmenu.html';
    });
  });
});