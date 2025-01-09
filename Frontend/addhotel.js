// Initialize an empty array to store hotel data globally

let hotels = [];

document.addEventListener('DOMContentLoaded', function() {
    // Bind the form submission to the addHotel function
    const form = document.getElementById('hotel-form');
    
    form.addEventListener('submit', function(event) {
        // Prevent the default form submission (page reload)
        event.preventDefault();
        addHotel(); // Call the function to handle the data submission
    });

    function addHotel() {
        // Get the values from the input fields
        const hotelName = document.getElementById('hotel-name').value;
        const hotelContact = document.getElementById('hotel-contact').value;

        // Perform validation to ensure data is entered
        if (!hotelName || !hotelContact) {
            alert("Please fill in both fields.");
            return;
        }

        // Send the data using axios with correct field names expected by the backend
        console.log("Hotel Name:", hotelName);
        console.log("Hotel Contact:", hotelContact);

        axios.post('http://localhost:3000/api/hotels', {
            name: hotelName,       // Send 'name' as expected by backend
            contact: hotelContact  // Send 'contact' as expected by backend
        })
        .then(response => {
            const newHotel = response.data.hotel;
            hotels.push(newHotel); // Now the 'hotels' array is defined, so we can push to it

            // Clear the form fields after successful addition
            document.getElementById('hotel-name').value = '';
            document.getElementById('hotel-contact').value = '';
            console.log|("hotel added to db")
        })
        .catch(error => {
            console.error('Error adding hotel:', error);
        });
    }
});
