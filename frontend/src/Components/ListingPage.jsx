import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const ListingPage = () => {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [bids, setBids] = useState([]);
    const [currentbidAmount, setcurrentBidAmount] = useState(0);


    // Create a ref for the socket
    const socketRef = useRef(null);

    useEffect(() => {
        // Assign the socket instance to the ref
        socketRef.current = io('http://localhost:3000');

        // Listen for 'connect' event
        socketRef.current.on('connect', () => {
            console.log('Connected to the server');
        });

        // Fetch the listing details using the listingId
        const apiUrl = `http://localhost:3000/listing/${listingId}`; // Replace with your API endpoint

        // Define the URL of your backend API
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhZndhbm5henIyMzMiLCJpYXQiOjE2OTg2NDY5MjN9.GVu2A-UQ4UUr5RdOPyYDfzxIXPDRvbM90Em9hFsixmY'; // Replace with your token
        // Make a GET request using Axios
        axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        })
            .then((response) => {
                // Handle the successful response here
                console.log(response.data)
                setListing(response.data);
                setcurrentBidAmount(parseFloat(response.data.currentBid.amount)+2.5)
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error:', error);
            });

        // Listen for bid updates from the server
        socketRef.current.on('updateBid', (bids) => {
            // Update the list of bids with the new bid
            console.log(bids);
            setBids([...bids]);
        });
        console.log(bids)
        return () => {
            // Cleanup the socket connection when the component unmounts
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bids]);

    // The error you encountered is due to the fact that you attempted to set up the event listener outside the useEffect, which is executed before the socket connection is established. To fix this, you should keep the event listener within the useEffect where the socket connection is set up.

    // Use useRef to create a mutable ref object whose .current property is initialized with the socket instance. This way, the socket instance can be accessed inside handleBidSubmit
    // Function to handle bid submission
    const handleBidSubmit = (e) => {
        e.preventDefault();
        // Ensure that the currentbidAmount is positive 
        const BidAmount = parseFloat(currentbidAmount);
        if (!isNaN(BidAmount) && BidAmount >= 0) {
            // Send the bid to the server
            socketRef.current.emit('placeBid', { listingId, amount: BidAmount });
        }

    };

    return (
        <div className="container my-4">
            {listing ? (


                <div>
                    {/* Display listing information */}
                    <h1 className="display-4">{listing.title}</h1>
                    <p className="lead">{listing.description}</p>
                    <p className="font-weight-bold">Price: ${listing.price}</p>

                    {/* Bid form */}
                    <div className="my-4">
                        <form onSubmit={handleBidSubmit}>
                            <div className="form-group">
                                <label htmlFor="bidAmount" className="font-weight-bold">Place Your Bid:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="bidAmount"
                                    name="bidAmount"
                                    value={currentbidAmount}
                                    onChange={(e) => setcurrentBidAmount(e.target.value)}
                                    step="2.5" // Set the step to increment by 2.5
                                    min={currentbidAmount}    // Set the minimum value to 0
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">Submit Bid</button>
                        </form>
                    </div>

                    {/* Display the list of bids */}
                    <div className="my-4">
                        {bids.length > 0 && (
                            <h2>Bid History:</h2>
                        )}
                        <div className='list-group'>
                            {bids.map((bid, index) => (
                                <li key={index} className="list-group-item list-group-item-action p-1 bg-primary text-light" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        Bid Amount: ${bid.amount}
                                    </div>
                                    <div>
                                        <span>Time: {new Date(bid.time).toLocaleTimeString()}</span>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ListingPage;
