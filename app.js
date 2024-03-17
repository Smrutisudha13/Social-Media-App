import mongoose from "mongoose";
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/users', (req, res) => {
  res.json({ message: 'List of users' });
});

app.post('/api/register', async (req, res) => {
  try {
      const { username, email, password } = req.body;

      // Check if username or email is already in use
      if (users.some(user => user.username === username)) {
          return res.status(400).json({ error: 'Username is already taken' });
      }

      if (users.some(user => user.email === email)) {
          return res.status(400).json({ error: 'Email is already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to the database
      const user = { username, email, password: hashedPassword };
      users.push(user);

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for user login
app.post('/api/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Check if user exists
      const user = users.find(user => user.username === username);
      if (!user) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
  });
}


app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(
    "mongodb+srv://senapatismrutisudha:K1VnBKetVRxSWC9r@socialmediaapp.synh69f.mongodb.net/SocialMediaApp?retryWrites=true&w=majority&appName=SocialMediaApp"
  )
  .then(() => console.log("Connected to DB and Listening to localhost 3000"))
  .catch((err) => console.log(err));
