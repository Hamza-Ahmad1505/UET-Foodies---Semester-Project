import Food from './food.models.js';
import Hotel  from './hotel.model.js';
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb';
// Add a hotel
const addHotel = async (req, res) => {
  try {
    const { name, contact } = req.body;
    const newHotel = new Hotel({ name, contact });
    await newHotel.save();
    res.status(201).send({ message: 'Hotel added successfully', hotel: newHotel });
  } catch (error) {
    console.error(`Error saving hotel: ${error.message}`);
    res.status(500).send({ error: `Error saving hotel: ${error.message}` });
  }
};

// Delete a hotel and associated menu items
const deleteHotel = async (req, res) => {
  try {
    const { hotelId } = req.body;

    // Find and delete the hotel
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

    if (!deletedHotel) {
      return res.status(404).send('No hotel found by Id');
    }

    // Delete all food items associated with this hotel
    await Food.deleteMany({ hotel: hotelId });

    res.status(200).send('Hotel and associated menu deleted successfully');
  } catch (error) {
    console.error(`Error deleting hotel: ${error.message}`);
    res.status(500).send({ error: `Error deleting hotel: ${error.message}` });
  }
};

// Add a food item to a specific hotel
 // Ensure ObjectId is imported if needed

const addFood = async (req, res) => {
  try {
    const { name, price, url, hotel } = req.body; // Match the field name from the frontend
    if (!ObjectId.isValid(hotel)) {
      return res.status(400).send({ error: 'Invalid Hotel ID' });
    }

    // Convert to ObjectId for MongoDB query
    const hotelId = new ObjectId(hotel);

    // Check if the hotel exists
    const hotelExists = await Hotel.findById(hotelId);
    if (!hotelExists) {
      return res.status(404).send({ error: 'Hotel not found' });
    }

    // Create a new food item
    const food = new Food({ name, price, url, hotel: hotelExists._id });
    await food.save();

    res.status(201).send({
      message: 'Food added successfully',
      food,
    });
  } catch (error) {
    console.error(`Error adding food: ${error.message}`);
    res.status(500).send({
      error: `Error adding food: ${error.message}`,
    });
  }
};


// Delete a food item
const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.body;

    const deletedFood = await Food.findByIdAndDelete(foodId);

    if (!deletedFood) {
      return res.status(404).send('Food item not found');
    }

    res.status(200).send('Food item deleted successfully');
  } catch (error) {
    console.error(`Error deleting food: ${error.message}`);
    res.status(500).send({ error: `Error deleting food: ${error.message}` });
  }
};

// Retrieve menus grouped by hotel
const getMenusForHotels = async (req, res) => {
  try {
    const menus = await Food.find();
    res.send({ menus });
    console.log('menuse are',menus)
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).send('Error fetching menus');
  }
};

// Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).send({ hotels });
  } catch (error) {
    console.error(`Error fetching hotels: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch hotels. Please try again later.' });
  }
};

const getFoodByHotelID = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;

    // Validate hotelId as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'Invalid hotel ID format' });
    }

    console.log(`Fetching foods for hotelId: ${hotelId}`);
    const foods = await Food.find({ hotel: hotelId });

    if (foods.length === 0) {
      return res.status(404).json({ message: 'No foods found for this hotel' });
    }

    res.status(200).json({ foods });
  } catch (err) {
    console.error(`Error occurred while fetching foods: ${err.stack}`);
    res.status(500).json({ message: 'Error occurred while fetching foods', error: err.message });
  }
};


export {
  addHotel,
  deleteHotel,
  addFood,
  deleteFood,
  getMenusForHotels,
  getAllHotels,
  getFoodByHotelID
};
