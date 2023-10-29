import React from 'react'
import axios from 'axios';
import { useState } from 'react';

const Entry = () => {
  
    const [formData, setFormData] = useState({
        username: "",
        password: "",
      });
      const [token, setToken] = useState(""); // State for storing the JWT token
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          console.log(formData);
          const response = await axios.post("http://localhost:3000/login", formData);
          console.log(response.data.token);
          setToken(response.data.token); // Store the received token in state
          if (response.status === 200) {
            // Handle success
            console.log("Success: You are authorized.");
          }
        } catch (error) {
          // Handle error
          console.error("Error: Access denied. Invalid token.", error);
        }
      };
    
      const handleInputChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
    
      const handleButtonClick = () => {
        // Use the token from state
        console.log(token)
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        // Make the GET request to the /secret route
        axios
          .get('http://localhost:3000/secret', config)
          .then((response) => {
            // Handle the response data
           console.log(response.status)
           console.log(response.data.success)
          })
          .catch((error) => {
            // Handle any errors
            console.error('Error:', error);
          });
      };
    
  return (
    <div className='m-4'>
         <h1>Login/Register</h1>
         <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <input type="submit" value="Submit" />
      </form>

      <div>
        <button onClick={handleButtonClick}>Make GET Request</button>
      </div>
      
    </div>
  )
}

export default Entry