const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',  // ✅ Allows requests from any domain
    methods: 'GET,POST,PUT,DELETE,OPTIONS',  // ✅ Allow these HTTP methods
    allowedHeaders: 'Content-Type,Authorization',  // ✅ Allow these headers
    credentials: true  // ✅ Allow cookies & authentication headers (optional)
  }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Import routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
// Import event routes
app.use('/api/events', require('./routes/events'));


// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
