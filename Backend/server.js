import express from 'express';         // Import express
import mongoose from 'mongoose';       // Import mongoose
import cors from 'cors';               // Import cors (optional)
import router from './MVC/routes.js';  // Import your router

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Debugging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Use the router for all routes
app.use('/api', router); // Prefix routes with `/api`

// Fallback for unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://hamzaahmad:ZZTZe9kvahWJYqeg@cluster0.aawok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// MongoDB connection status events
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
