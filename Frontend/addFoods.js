// Initialize the global foods array to store the list of food item

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('food-form');

    // Bind the form submission to the addFood function
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        addFood(); // Handle the form submission
    });

    // Fetch the list of hotels from the backend and populate the dropdown
    fetchHotels();

    function fetchHotels() {
        // Make a GET request to fetch hotels
        axios
            .get('http://localhost:3000/api/hotels')
            .then((response) => {
                const hotels = response.data.hotels; // Assuming the response contains an array of hotels
                console.log('Fetched hotels:', hotels);
                populateHotelDropdown(hotels);
            })
            .catch((error) => {
                console.error('Error fetching hotels:', error);
            });
    }

    function populateHotelDropdown(hotels) {
        const hotelSelect = document.getElementById('hotel-select');

        // Clear any existing options
        hotelSelect.innerHTML = '<option value="" selected>Select Hotel</option>';

        // Populate dropdown with hotels
        hotels.forEach((hotel) => {
            const option = document.createElement('option');
            option.value = hotel._id; // Use hotel ID as the value
            option.textContent = hotel.name; // Display hotel name
            hotelSelect.appendChild(option);
        });
    }

    function addFood() {
        // Get the input values
        const foodName = document.getElementById('food-name').value.trim();
        const foodPrice = document.getElementById('food-price').value.trim();
        const foodUrl = document.getElementById('food-url').value.trim();
        const hotelId = document.getElementById('hotel-select').value; // Get the selected hotel ID

        // Validate inputs
        if (!foodName || !foodPrice || !foodUrl || !hotelId) {
            alert('Please fill in all fields.');
            return;
        }

        console.log('Form data submitted:', { foodName, foodPrice, foodUrl, hotelId });

        // Send the data using axios
        axios
            .post('http://localhost:3000/api/menus', {
                name: foodName, // Expected 'name' in backend
                price: foodPrice, // Expected 'price' in backend
                url: foodUrl, // Expected 'url' in backend
                hotel: hotelId, // Expected 'hotel' in backend
            })
            .then((response) => {
                console.log('Data successfully sent to backend:', response.data);

                const newFood = response.data.menu; // Assuming the response contains the new food item
            // Add to the global foods array

                // Clear the form
                form.reset();
            })
            .catch((error) => {
                console.error('Error adding food:', error.response?.data || error.message);
            });
    }
});
