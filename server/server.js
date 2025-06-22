const PORT = process.env.PORT || 5000;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://daily-io.vercel.app',
  'https://daily-io-backend.vercel.app'
];

// Configure CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Add explicit handling for OPTIONS requests
app.options('*', cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agreeTerms: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Todo model
const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware to verify JWT and get userId
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader); // Debug log
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || '1jMxAsAUwgef7JbjR3g+kSkI9CJQpAHKgquXztbT5TaWHinJilNlQRviIHMZTA8OjMphE+JGBJ4ZVP39uQfuOw==', (err, user) => {
    if (err) {
      console.error('JWT verify error:', err); // Debug log
      return res.sendStatus(403);
    }
    req.userId = user.userId;
    next();
  });
}

// Route for user signup
app.post('/api/signup', async (req, res) => {
  console.log('Signup request received:', req.body);
  try {
    const { fullName, email, password, agreeTerms } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = new User({
      fullName,
      email,
      password, 
      agreeTerms
    });
    
    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || '1jMxAsAUwgef7JbjR3g+kSkI9CJQpAHKgquXztbT5TaWHinJilNlQRviIHMZTA8OjMphE+JGBJ4ZVP39uQfuOw==', 
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all todos for logged-in user
app.get('/api/todos', authenticateToken, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

// Add a new todo for logged-in user
app.post('/api/todos', authenticateToken, async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ userId: req.userId, text });
  await todo.save();
  res.status(201).json(todo);
});

// Update a todo (toggle complete)
app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { completed },
    { new: true }
  );
  if (!todo) return res.sendStatus(404);
  res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const result = await Todo.deleteOne({ _id: id, userId: req.userId });
  if (result.deletedCount === 0) return res.sendStatus(404);
  res.sendStatus(204);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start the server in regular Node.js environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless functions
module.exports = app;