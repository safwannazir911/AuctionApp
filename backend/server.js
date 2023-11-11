import express from 'express';
import "dotenv/config";
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import cors from "cors"
import { dirname } from "path";
import { fileURLToPath } from "url";
import http from "http"
import { Server } from "socket.io";


mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
  }
);

// Secret key for JWT
const secretKey = process.env.JWT_SECRET || "maxplank"; // Replace with a strong, random secret key

const app = express();

//Number of salt cycles
const salt = 10;

const __dirname = dirname(fileURLToPath(import.meta.url)); // url->path(string)->dir

const httpServer = http.createServer(app)

//Whitelist front-end server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3001', // Replace with the actual origin of your app
    methods: ['GET', 'POST'],
  },
});

//App Middlewares
app.use(express.static(__dirname + "/public"));

app.use(cors(
  {
    origin: "http://localhost:3001", // Replace with the actual origin of your React app
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  }
));
//For form data(URL-encoded form data)
app.use(express.urlencoded({ extended: true }));
//For Axios(JSON data)
app.use(express.json())
app.use(morgan('tiny'));
app.set("view engine", "ejs");


//Schemas and modals
const bidSchema = new mongoose.Schema({
  amount: {
    type: String
  },
  time: {
    type: Date
  }
})
const Bid = mongoose.model('Bid', bidSchema);

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isForSale: {
    type: Boolean,
    default: true, // By default, a listing is for sale
  },
  currentBid: {
    type: bidSchema,
  },
  bids: [bidSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Listing = mongoose.model('Listing', listingSchema);


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  listings: [{
    type: mongoose.Schema.Types.ObjectId,    //ObjectId of the listing gets stored rather than the object itself
    ref: 'Listing',
  }]
})
const User = new mongoose.model("user", userSchema);

// Define a middleware function for JWT verification
function verifyToken(req, res, next) {
  var token = req.header("Authorization");
  console.log(token);
  token = token.substring(7, token.length)
  console.log(token);

  if (!token) {
    console.log("No token");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    // Token is valid, and user is authorized, so proceed to the next middleware or route handler.
    req.user = decoded;
    console.log(req.user)
    console.log("Success")
    next();
  } catch (err) {
    console.log("Error:", err);
    return res.status(401).json({ error: "Invalid token." });
  }
}

// Use the verifyToken middleware for the /secret route
app.get('/secret', verifyToken, (req, res) => {
  console.log(req.user)
  res.json({
    success: "Success from the server"
  });
});

//Create listing
app.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, description, price, isForSale } = req.body;

    // Create a new listing
    const listing = new Listing({
      title: title,
      description: description,
      price: price,
      isForSale: isForSale
    });

    const newBid = new Bid({
      amount: price,
      time: new Date(),
    });

    newBid.save();
    listing.currentBid = newBid;

    // Find the user by their username
    const username = req.user.username;
    const user = await User.findOne({ username: username });

    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).json({ error: "User not found" });
    }

    listing.user = user;
    await listing.save();

    // Push the new listing into the user's listings array
    user.listings.push(listing);

    // Save the user document with the updated listings array
    await user.save();

    // Return a success response
    res.status(200).json({ message: "Listing created successfully" });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});



//Get user specific listing
app.get("/user/listings", verifyToken, async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username: username }).populate("listings");
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const listings = user.listings;
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//Get all listings
app.get("/listings", verifyToken, async (req, res) => {
  try {
    // Use the User model to find all users and populate their listings
    const users = await User.find().populate("listings");
    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }
    // Collect all listings from all users
    const allListings = [];
    users.forEach((user) => {
      if (user.listings) {
        user.listings.forEach((listing) => {
          allListings.push(listing); // Push the listing object
        });
      }
    });
    res.status(200).json(allListings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//Delete a listing



//Delete a listing
//req.query-> query parameters(page, api key's)
//req.params-> parameters(id)
//req.header-> header(bearer token)
//req.auth-> authentication(username/password)

app.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const listingId = req.params.id; // Access the parameter from the URL

    // Use Mongoose or your preferred method to find and delete the listing by its ID
    const deletedListing = await Listing.findByIdAndRemove(listingId);

    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Optionally, you can return a success message or response
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
})

//Edit a listing
app.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const listingId = req.params.id; // Access the listing ID from the URL route parameter
    const { title, description, price, isForSale } = req.body;

    // Use Mongoose or your preferred method to find and update the listing by its ID
    const updatedListing = await Listing.findByIdAndUpdate(listingId, {
      title,
      description,
      price,
      isForSale,
    });

    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//Get a particular listing
app.get("/listing/:id", verifyToken, async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId)

    res.status(200).json(listing)
  }
  catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'An error occured' })
  }

})

//Delete all listings
app.get("/delete/listings", verifyToken, async (req, res) => {
  try {
    // Use Mongoose or your preferred method to delete all listings
    const listing = await Listing.deleteMany({}); // This will delete all documents in the "Listing" collection
    console.log(listing)
    res.status(200).json({ message: 'All listings deleted successfully' });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on('placeBid', async (bid) => {
    try {
      const { listingId, amount } = bid;

      // Find the listing by its ID
      const listing = await Listing.findById(listingId);

      if (!listing) {
        console.log('Listing not found');
        return;
      }

      const newBid = new Bid({
        amount: amount,
        time: new Date(),
      })
      newBid.save()

      // Update the currentBid field with the new bid
      listing.currentBid = newBid;

      // Push the bid amount to the listing's bids array
      listing.bids.push(newBid);

      // Save the updated listing to the database
      await listing.save();

      const bids = listing.bids;
      console.log(bids)
      // Broadcast the updated bid to all connected clients
      io.emit('updateBid', bids);
    } catch (error) {
      console.error('Error processing bid:', error);
    }
  });
  so
});




//Register a new user
app.post("/register", async (req, res) => {
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  console.log(username)
  console.log(password)
  try {

    bcrypt.hash(password, salt, async function (err, hash) {
      //Hashing & Salting
      if (err) {
        console.error("Error hashing password:", err);
        res.status(500).send("An error occurred");
        return;
      }

      const userExists = await User.findOne({ username: username });
      console.log(userExists);
      if (userExists) {
        console.log("User already exists. Try logging in.");
        res.redirect("/login");
      } else {
        const user = new User({
          username: username,
          password: hash, // Store the hashed password in the database
        });
        await user.save();
        const token = jwt.sign({ username: username }, secretKey);
        res.json({ token }); // Return the token to the client
      }
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle the error here if needed
    res.status(500).send("An error occurred");
  }
});

//Login a user
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body)
  try {
    const userExists = await User.findOne({ username: username });
    console.log(userExists);
    bcrypt.compare(password, userExists.password, async function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result === true) {
        // Change to result === true
        const token = jwt.sign({ username: username }, secretKey);
        console.log(token)
        res.json({ token }); // Return the token to the client

      } else {
        console.log("Incorrect Credentials");
        res.redirect("/login");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle the error here if needed
    res.status(500).send("An error occurred");
  }
});


const port = process.env.PORT || 2000;

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});