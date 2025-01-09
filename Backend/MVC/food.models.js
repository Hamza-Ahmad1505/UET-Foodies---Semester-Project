import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  url: String,
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel', // Ensure this matches the Hotel model name
  },
});

export default mongoose.model('Food', foodSchema);
