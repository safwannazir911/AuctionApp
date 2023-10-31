import React, { useState } from 'react';

const EditListingForm = ({ publishListing, data,showForm, setShowForm }) => {
  const [newListing, setNewListing] = useState({
    _id: data._id,
    title: data.title,
    description: data.description,
    price: data.price,
    isForSale: data.isForSale,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewListing({
      ...newListing,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    publishListing(newListing); // Pass the new listing to the parent component for submission
    setShowForm(false); // Close the form
  };

  return (
    <div className={`modal ${showForm ? 'd-block' : ''}`}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create New Listing</h5>
              <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newListing.title}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newListing.description}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newListing.price}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  id="isForSale"
                  name="isForSale"
                  checked={newListing.isForSale}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="isForSale" className="form-check-label">For Sale</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Close</button>
              <button type="submit" className="btn btn-primary">Publish Listing</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListingForm;
