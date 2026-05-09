# 🎓 CoachFinder — Best Coaching Institutes in Noida

**CoachFinder** is a modern, full-stack web application that helps students discover and compare the best coaching institutes in Noida, India. Built with React, Node.js, MongoDB, and Tailwind CSS.

![CoachFinder Banner](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop)

---

## ✨ Features

### 🏠 **Home Page**
- Modern hero section with gradient backgrounds
- Search bar with instant results
- Featured institutes carousel
- Category-based browsing
- Quick stats and trust indicators

### 📋 **Listings Page**
- Grid layout of institute cards
- Advanced search and filters:
  - Search by name/location
  - Filter by category, rating, fees, distance
  - Sort by rating, fees, distance, newest
- Pagination
- Skeleton loaders for smooth UX

### 🗺️ **Map View**
- Interactive OpenStreetMap integration
- Custom markers for each institute
- Click markers to view institute preview
- User location detection
- Distance calculation using Haversine formula

### 🏫 **Institute Details Page**
- Complete institute information
- Image gallery
- Google Maps location
- Reviews and ratings system
- Contact details and "Apply Now" CTA
- Features and facilities list

### 🔐 **Authentication**
- JWT-based authentication
- Login and registration
- Protected routes
- Admin and user roles

### 👨‍💼 **Admin Dashboard**
- Add/edit/delete institutes
- Upload images
- Manage reviews
- Dashboard analytics:
  - Total institutes
  - Total reviews
  - Average rating
  - Category distribution

### 🎨 **UI/UX**
- Premium glassmorphism design
- Smooth Framer Motion animations
- Skeleton loaders
- Toast notifications
- Dark theme optimized
- Fully responsive (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** — UI library
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Animations
- **React Query** — Data fetching
- **React Router** — Routing
- **Axios** — HTTP client
- **React Hot Toast** — Notifications
- **React Icons** — Icon library

### **Backend**
- **Node.js** — Runtime
- **Express** — Web framework
- **MongoDB + Mongoose** — Database
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Helmet** — Security headers
- **Morgan** — Logging
- **Express Rate Limit** — Rate limiting
- **CORS** — Cross-origin requests

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/coachfinder.git
cd coachfinder
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coachfinder
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### **3. Frontend Setup**
```bash
cd frontend-app
npm install
```

Create `.env` file in `frontend-app/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Start the frontend dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🚀 Deployment

### **Frontend (Vercel)**
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy

### **Backend (Railway/Render)**
1. Push code to GitHub
2. Create new service on Railway/Render
3. Set environment variables (same as `.env`)
4. Deploy

### **Database (MongoDB Atlas)**
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in backend env

---

## 📁 Project Structure

```
coachfinder/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Institute.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── instituteController.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── institutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend-app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── institutes/
│   │   │   │   └── InstituteCard.jsx
│   │   │   └── ui/
│   │   │       ├── SkeletonCard.jsx
│   │   │       ├── StarRating.jsx
│   │   │       └── CategoryBadge.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── InstitutesPage.jsx
│   │   │   ├── InstituteDetailPage.jsx
│   │   │   ├── MapPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── LocationContext.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔑 API Endpoints

### **Authentication**
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user (protected)
- `PUT /api/auth/profile` — Update profile (protected)

### **Institutes**
- `GET /api/institutes` — Get all institutes (with filters)
- `GET /api/institutes/featured` — Get featured institutes
- `GET /api/institutes/map` — Get institutes for map view
- `GET /api/institutes/:id` — Get single institute
- `POST /api/institutes` — Create institute (admin only)
- `PUT /api/institutes/:id` — Update institute (admin only)
- `DELETE /api/institutes/:id` — Delete institute (admin only)

### **Reviews**
- `POST /api/institutes/:id/reviews` — Add review (protected)
- `DELETE /api/institutes/:id/reviews/:reviewId` — Delete review (admin only)

### **Admin**
- `GET /api/institutes/admin/stats` — Get dashboard stats (admin only)

---

## 🧪 Demo Credentials

### **Admin Account**
- Email: `admin@coachfinder.com`
- Password: `admin123`

### **User Account**
- Email: `user@coachfinder.com`
- Password: `user123`

---

## 📊 Database Schema

### **User Schema**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  phone: String,
  avatar: String,
  isActive: Boolean,
  timestamps: true
}
```

### **Institute Schema**
```javascript
{
  name: String,
  description: String,
  category: Enum,
  fees: { monthly, annual, currency },
  rating: { average, count },
  images: [{ url, caption }],
  location: { type: 'Point', coordinates: [lng, lat] },
  latitude: Number,
  longitude: Number,
  address: { street, sector, city, state, pincode, fullAddress },
  phone: String,
  email: String,
  website: String,
  established: Number,
  faculty: Number,
  students: Number,
  batchSize: Number,
  timing: String,
  features: [String],
  reviews: [{ user, userName, rating, comment, createdAt }],
  isFeatured: Boolean,
  isVerified: Boolean,
  isActive: Boolean,
  createdBy: ObjectId,
  timestamps: true
}
```

---

## 🎯 Key Features Implementation

### **Distance Calculation**
Uses Haversine formula to calculate distance between user location and institutes:
```javascript
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
```

### **Search & Filters**
- Text search using MongoDB `$text` index
- Category, rating, fees range filters
- Distance-based filtering
- Multiple sort options

### **Authentication Flow**
- JWT tokens stored in localStorage
- Axios interceptors for automatic token attachment
- Protected routes using React Router
- Role-based access control (admin/user)

---

## 🎨 Design Highlights

- **Glassmorphism** — Frosted glass effect cards
- **Gradient Text** — Eye-catching headings
- **Smooth Animations** — Framer Motion transitions
- **Skeleton Loaders** — Better perceived performance
- **Responsive Grid** — Adapts to all screen sizes
- **Dark Theme** — Modern dark UI optimized for readability

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for images
- [React Icons](https://react-icons.github.io/react-icons/) for icons
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

---

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/1200x600?text=Home+Page+Screenshot)

### Institutes Listing
![Institutes](https://via.placeholder.com/1200x600?text=Institutes+Listing+Screenshot)

### Institute Details
![Details](https://via.placeholder.com/1200x600?text=Institute+Details+Screenshot)

### Map View
![Map](https://via.placeholder.com/1200x600?text=Map+View+Screenshot)

### Admin Dashboard
![Admin](https://via.placeholder.com/1200x600?text=Admin+Dashboard+Screenshot)

---

**Made with love for students in Noida**
