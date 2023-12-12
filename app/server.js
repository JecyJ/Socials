import express from 'express';
import { createConnection } from 'mysql';
import facebookRouter from '@app/api/auth/facebook.js';

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection setup
const connection = createConnection({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  port: process.env.NEXT_PUBLIC_DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Use express.json() for parsing JSON data
app.use(express.json());

// Endpoint for handling user login and fetching/saving Facebook stats
app.use('/api/auth/facebook', facebookRouter(connection));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
