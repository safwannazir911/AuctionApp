import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Define the URL of your backend API
    const apiUrl = 'http://localhost:3000/listings'; // Replace with your actual backend URL
    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhZndhbm5henIyMzMiLCJpYXQiOjE2OTg2NDY5MjN9.GVu2A-UQ4UUr5RdOPyYDfzxIXPDRvbM90Em9hFsixmY';
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
      <h1 className='m-3'>All listings</h1>
      <ul>
        {listings.map((listing, index) => (
          <div className='container border rounded m-1 p-2' key={listing._id}>
            <h3 className='m-2'>{listing.title}</h3>
            <p className='m-2'>{listing.description}</p>
            <button type="button" className="btn btn-light btn-sm m-2">Price: {listing.price}</button>
            {listing.isForSale ? (
              <Link to={`/listing/${listing._id}`}>
                <button className='btn btn-dark btn-sm'>Bid on item</button>
              </Link>
            ) : (
              <button className='btn btn-dark btn-sm disabled'>Bid on item</button>
            )}          </div>
        ))}
      </ul>
    </div>
  );
};

export default Home;
