import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import EditListingForm from './EditListingForm';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhZndhbm5henIyMzMiLCJpYXQiOjE2OTg2NDY5MjN9.GVu2A-UQ4UUr5RdOPyYDfzxIXPDRvbM90Em9hFsixmY';
  const [isEditing, setIsEditing] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Define the URL of your backend API
    const apiUrl = 'http://localhost:3000/user/listings'; // Replace with your actual backend URL
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

  const deleteListing = (listingId) => {
    const apiUrl = `http://localhost:3000/delete/${listingId}`;

    axios.delete(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    })
      .then((response) => {
        // Handle the successful deletion (e.g., remove the listing from the state)
        console.log(response.status)
        // Update the UI state to remove the deleted listing
        setListings((prevListings) => prevListings.filter(listing => listing._id !== listingId));
      })
      .catch((error) => {
        // Handle errors
        console.error('Error:', error);
      });
  };

  const updateListing = (updatedListing) => {
    const apiUrl = `http://localhost:3000/edit/${updatedListing._id}`;

    axios.put(apiUrl, updatedListing, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    })
      .then((response) => {
        // Handle the successful update (e.g., close the edit form/modal)
        setIsEditing(false);
        console.log(response.status)
        // Update the UI state to reflect the changes
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === updatedListing._id ? updatedListing : listing
          )
        );
      })
      .catch((error) => {
        // Handle errors
        console.error('Error:', error);
      });
  };


  return (
    <div className="m-2">
      <h1 className='m-3'>My listings</h1>
      <ul>
        {listings.map((listing, index) => (
          <div className='container border rounded m-1 p-2' key={listing._id}>
            <h3 className='m-2'>{listing.title}</h3>
            <p className='m-2'>{listing.description}</p>
            <button type="button" class="btn btn-light btn-sm m-2">Price: {listing.price}</button>
            <button
              className="btn btn-dark btn-sm m-2"
              onClick={() => {
                setIsEditing(true);
                setEditListing(listing);
                setShowForm(true); // Show the edit form when clicking "Edit"
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm m-2"
              onClick={() => deleteListing(listing._id)} // Call the deleteListing function with the listing's ID
            >
              Delete
            </button>
            {listing.isForSale ? <button className='btn btn-danger btn-sm'>On Sale</button> : <button className='btn btn-danger btn-sm disabled'>Not for Sale</button>}
          </div>
        ))}
      </ul>
      {isEditing && editListing && (
        <div>
          {/* Render your edit form or modal here */}
          {/* Pass editListing to your edit form or modal */}
          <EditListingForm publishListing={updateListing} data={editListing} showForm={showForm} setShowForm={setShowForm} />
        </div>
      )}


    </div>
  )
}

export default MyListings