'use client'

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const Home = () => {
  const [username, setUsername] = useState('');

  const handleSaveClick = async () => {
    try {
      // Replace 'your_facebook_redirect_uri' with your Facebook callback URL
      const response = await fetch(`/api/auth/facebook/callback?code=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log(data); // Handle the response as needed
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






// import React from 'react';
// import { Form, Button } from 'react-bootstrap';
// import FacebookLogin from 'react-facebook-login';

// const Home = () => {
//   const handleFacebookResponse = async (response) => {
//     try {
//       const { accessToken } = response;

//       // Send the obtained access token to your backend
//       const responseFromBackend = await fetch(`/auth/facebook/callback?code=${accessToken}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await responseFromBackend.json();
//       console.log(data); // Handle the response as needed
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <section className='w-full h-screen flex items-center justify-center'>
//       <div className="d-flex justify-content-around">
//         <Form>
//           {/* Button to initiate Facebook login */}
//           <FacebookLogin
//             appId="YOUR_FACEBOOK_APP_ID"
//             autoLoad={false}
//             fields="name,email,picture"
//             callback={handleFacebookResponse}
//             cssClass="my-facebook-button-class"
//             icon="fa-facebook"
//           />

//           {/* You can include other form elements here if needed */}
//         </Form>
//       </div>
//     </section>
//   );
// };

// export default Home;

