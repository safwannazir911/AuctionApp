import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

const MyListings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Define the URL of your backend API
    const apiUrl = 'http://localhost:3000/user/listings'; // Replace with your actual backend URL
    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhZndhbm5henIyMyIsImlhdCI6MTY5ODUwNDk0N30.RrsOUlNEgkQlPS_3BjDRiqMZMr-6gETQW0KpQyxZ_Mg';
    // Make a GET request using Axios
    axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    })
    .then((response) => {
      // Handle the successful response here
      setListings(response.data);
    })
    .catch((error) => {
      // Handle errors here
      console.error('Error:', error);
    });
  }, []);
  return (
    <div className="m-2">
      <h1 className='m-3'>My listings</h1>
      <ul>
        {listings.map((listing, index) => (
          <div className='container border rounded m-1 p-2'>
            <h3 className='m-2'>{listing.title}</h3>
            <p  className='m-2'>{listing.description}</p>
            <button type="button" class="btn btn-light btn-sm m-2">Price: {listing.price}</button>
            <button className='btn btn-dark btn-sm m-2'>Edit</button>
            <button className='btn btn-danger btn-sm m-2'>Delete</button>
          </div> 
        ))}
      </ul>
    </div>
  )
}

export default MyListings