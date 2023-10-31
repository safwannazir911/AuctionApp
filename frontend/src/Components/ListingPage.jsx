import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const ListingPage = () => {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);


    useEffect(() => {
        // Fetch the listing details using the listingId
        const apiUrl = `http://localhost:3000/listing/${listingId}`; // Replace with your API endpoint

        // Define the URL of your backend API
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhZndhbm5henIyMzMiLCJpYXQiOjE2OTg2NDY5MjN9.GVu2A-UQ4UUr5RdOPyYDfzxIXPDRvbM90Em9hFsixmY';
        // Make a GET request using Axios
        axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        })
            .then((response) => {
                // Handle the successful response here
                setListing(response.data);
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error:', error);
            });
    }, [listingId]);

    return (
        <div className="container my-4">
            {listing ? (
                <div>
                    <h1 className="display-4">{listing.title}</h1>
                    <p className="lead">{listing.description}</p>
                    <p className="font-weight-bold">Price: ${listing.price}</p>

                    {/* Add the bid form here */}
                    <div className="my-4">
                        <form>
                            <div className="form-group">
                                <label htmlFor="bidAmount" className="font-weight-bold">Place Your Bid:</label>
                                <input type="number" className="form-control" id="bidAmount" name="bidAmount"  />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">Submit Bid</button>
                        </form>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ListingPage;
