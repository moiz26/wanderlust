# WanderLust 🌍

WanderLust is a full-stack travel listing web application inspired by Airbnb.
Users can explore listings, create and manage properties, upload images, leave reviews, and view locations on interactive maps.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User Signup & Login
* Passport.js authentication
* Session management with MongoDB session store
* Authorization for listings and reviews

### 🏠 Listings

* Create new travel listings
* Edit and delete listings
* Upload listing images using Cloudinary
* Image preview while editing listings
* Display listings with responsive card layout

### ⭐ Reviews

* Add reviews and ratings
* Delete own reviews
* Star rating UI with validation

### 🗺️ Maps & Geolocation

* Mapbox integration
* Automatic geocoding using Mapbox Geocoding API
* Interactive maps on listing detail pages

### 🎨 UI Features

* Responsive Navbar
* Category filters
* Tax toggle functionality
* Flash success/error messages
* Bootstrap form validation

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* Bootstrap
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* Passport.js
* express-session
* connect-mongo

### Cloud & APIs

* Cloudinary (Image Uploads)
* Mapbox (Maps & Geocoding)

---

## 📂 Project Structure

```bash
WanderLust/
│
├── controllers/
├── models/
├── routes/
├── views/
├── public/
│   ├── css/
│   └── js/
├── init/
├── utils/
├── middleware.js
├── cloudConfig.js
├── app.js
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_secret

MAP_TOKEN=your_mapbox_token

ATLASDB_URL=your_mongodb_atlas_url

SECRET=your_session_secret
```

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/moiz26/wanderlust.git
cd wanderlust
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the application

```bash
node app.js
```

or

```bash
nodemon app.js
```

---

## 🌐 Deployment

The project is deployed using:

* Render
* MongoDB Atlas
* Cloudinary

---

## 📚 What I Learned

* MVC architecture
* RESTful routing
* Authentication & authorization
* MongoDB relationships
* Session management
* Cloudinary integration
* Mapbox geolocation
* Deployment with Render

---

## 👨‍💻 Author

**Mohammed Moiz**

* GitHub: https://github.com/moiz26
* LinkedIn: https://www.linkedin.com/in/md-moiz-455b51240

---

## ⭐ Future Improvements

* Search functionality
* Listing categories filter logic
* Booking system
* Payment integration
* Wishlist/Favorites
* User profile page
* Dark mode

---

## 📄 License

This project is for learning and educational purposes.
