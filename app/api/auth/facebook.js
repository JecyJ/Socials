import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const facebookRouter = (connection) => {
  router.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const appSecret = process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET;
      const redirectUri = 'http://localhost:3000/auth/facebook/callback'; // Replace with your callback URL

      // Exchange code for access token
      const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`);
      const { access_token } = await tokenResponse.json();

      // Use the obtained access token to fetch user data
      const userDataResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,followers,posts&access_token=${access_token}`);
      const userData = await userDataResponse.json();

      // Extract necessary data
      const { id: user_id, name, followers, posts } = userData;

      // Store the fetched details in the database
      const insertQuery = 'INSERT INTO Wo_Users_Socials (user_id, social_network, follower_count, post_count) VALUES (?, ?, ?, ?)';
      connection.query(insertQuery, [user_id, name, followers.summary.total_count, posts.data.length], (err, result) => {
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

  return router;
};

export default facebookRouter;
