import React from 'react'
import axios from 'axios';
import { useState } from 'react';

const Entry = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);
      const response = await axios.post("http://localhost:3000/register", formData);
      console.log(response.data.token);
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



  return (
    <div className='m-4'>
      <h1>Login/Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

    </div>
  )
}

export default Entry