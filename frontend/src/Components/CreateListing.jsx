import React, { useState } from 'react';
import axios from 'axios';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    isForSale: false,
  });

  const [hidden, setHidden] = useState(true)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Define the URL of your backend API
    const apiUrl = 'http://localhost:3000/create'; // Replace with your actual backend URL

    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhZndhbm5henIyMzMiLCJpYXQiOjE2OTg2NDY5MjN9.GVu2A-UQ4UUr5RdOPyYDfzxIXPDRvbM90Em9hFsixmY';

    // Make a POST request using Axios to create the listing
    axios.post(apiUrl, formData, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`, // Add your bearer token
      }
    })
      .then((response) => {
        // Handle the successful response, e.g., show a success message or redirect
        console.log('Listing created successfully');
        console.log(response.status)
        setHidden(false)
        setFormData({
          title: '',
          description: '',
          price: 0,
          isForSale: false,
        })
      })
      .catch((error) => {
        // Handle errors here, e.g., display an error message
        console.error('Error:', error);
      });
  };
  const success = () => {
    return (
      <div>
        <p className='text-success'>
          Listing created successfully!
        </p>
      </div>
    );
  }
  return (
    <div className="m-4">
      <h1>Create Listing</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            className="form-control"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="isForSale"
            checked={formData.isForSale}
            onChange={handleChange}
          />
          <label className="form-check-label">For Sale</label>
        </div>
        <button className='btn btn-dark' type="submit">Create Listing</button>
      </form>

      {!hidden && success()}
    </div>
  );
};

export default CreateListing;
