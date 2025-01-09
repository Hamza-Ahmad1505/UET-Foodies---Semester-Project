import express from 'express';
import {
  addHotel,
  deleteHotel,
  addFood,
  deleteFood,
  getMenusForHotels,
  getAllHotels,
  getFoodByHotelID,
} from './controllers.js'; // Adjust path if necessary

const router = express.Router();

// Hotel routes
router.post('/hotels', addHotel);
router.delete('/hotels', deleteHotel);
router.get('/hotels', getAllHotels);

// Menu routes
router.post('/menus', addFood);
router.delete('/menus', deleteFood);
router.get('/menus', getMenusForHotels);
router.get('/menus/:hotelId', getFoodByHotelID); // Fix here

export default router;
