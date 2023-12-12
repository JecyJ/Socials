import express from 'express';
import { createConnection } from 'mysql';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

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

// Endpoint for handling user login and fetching/saving Facebook stats
app.get('/auth/facebook/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID; // Your Facebook App ID
    const appSecret = process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET; // Your Facebook App Secret
    const redirectUri = 'http://localhost:3000/auth/facebook/callback'; // Replace with your callback URL

    // Exchange code for access token
    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`);
    const { access_token } = await tokenResponse.json();

    // Use the obtained access token to fetch user data
    const userDataResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,followers,posts&access_token=${access_token}`);
    const userData = await userDataResponse.json();

    // Extract necessary data
    const { id: user_id, followers, posts } = userData;

    // Save fetched details to MySQL database in Wo_Users_Socials table
    const insertQuery = 'INSERT INTO Wo_Users_Socials (user_id, social_network, follower_count, post_count) VALUES (?, ?, ?, ?)';
    connection.query(insertQuery, [user_id, 'Facebook', followers.summary.total_count, posts.data.length], (err, result) => {
      if (err) {
        console.error('Error saving user statistics:', err);
        res.status(500).json({ error: 'Failed to save user statistics' });
        return;
      }
      console.log('User statistics saved:', result);
      res.status(200).json({ message: 'User statistics saved successfully' });
    });
  } catch (error) {
    console.error('Error during Facebook authentication:', error);
    res.status(500).send('Error during Facebook authentication');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








'use client'

import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Home = () => {
  const [username, setUsername] = useState('');

  const handleSaveClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/auth/facebook/callback?code=${username}`);
      // Handle the response if needed
      console.log('Response:', response.data);
     
      setUsername('');
    } catch (error) {
      console.error('Error:', error);
     
    }
  };

  return (
    <section className='w-full h-screen flex items-center justify-center'>
      <div className="d-flex justify-content-around">
        <Form>
          <Form.Group className="mb-3" controlId="formFacebookUsername">
            <Form.Label>Enter Facebook Username:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Facebook Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSaveClick}>Save</Button>
        </Form>
      </div>
    </section>
  );
};

export default Home;