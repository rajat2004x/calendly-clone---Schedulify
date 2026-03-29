# Schedulify - Calendly Clone

A full-featured scheduling application built with React, Node.js, and MySQL. Allows users to create event types, manage their availability, and share booking links for seamless scheduling.

## 🚀 Features

### Core Functionality
- **Event Type Management** - Create multiple event types with custom durations and descriptions
- **Availability Management** - Set working hours for each day of the week
- **Timezone Support** - Auto-detects visitor timezone and shows times accordingly
- **Modern Booking Page** - Interactive calendar with date/time selection
- **Email Notifications** - Automatic confirmation and cancellation emails
- **Booking Dashboard** - View, filter, and manage all bookings
- **Share Links** - Easy-to-copy booking links for sharing (`/book/{event-slug}`)

### Technical Features
- **Conflict Prevention** - 15-minute buffer between bookings automatically managed
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Performance Optimized** - Memoized components prevent unnecessary re-renders
- **Professional UI** - Modern design using Tailwind CSS and Lucide icons
- **RESTful API** - Complete backend API for all operations

---

## 📋 Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

---

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd calendly-clone
```

### 2. Set Up Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=calendly_db
NODE_ENV=development
```

### 3. Set Up Frontend

```bash
cd frontend
npm install
```

### 4. Initialize Database

The database will be automatically created when you start the backend server (Sequelize will sync tables).

---

## ▶️ Running the Application

### Start Backend Server
```bash
cd backend
node server.js
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5174`

---

## 📖 How to Use

### 1. Create an Event Type
1. Navigate to **"My Events"** in the navigation
2. Click **"Create Event Type"**
3. Fill in:
   - Event name (e.g., "30-Minute Meeting")
   - Duration in minutes
   - Optional description
4. Click **"Create Event"**

### 2. Set Your Availability
1. In the event card, click **"Set Availability"**
2. Select your timezone
3. For each day, toggle if you're available and set working hours
4. Click **"Save Availability"**

### 3. Share Your Link
1. In the event card, click the **copy icon** next to your event
2. Share the copied link with others (e.g., `https://yoursite.com/book/30-minute-meeting`)

### 4. Manage Bookings
1. Go to **"Dashboard"**
2. View all bookings filtered by status (All, Upcoming, Past)
3. Click a booking to see details
4. Cancel bookings if needed

### 5. Guest Booking Flow
When a guest visits your booking link:
1. They select a date from the calendar
2. They choose an available time slot
3. They enter their name and email
4. They confirm the booking
5. Both parties receive confirmation emails

---

## 🏗️ Project Structure

```
calendly-clone/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── eventController.js     # Event management logic
│   │   ├── bookingController.js   # Booking operations
│   │   └── slotController.js      # Time slot logic
│   ├── models/
│   │   ├── eventModel.js          # Event schema
│   │   ├── bookingModel.js        # Booking schema
│   │   └── availabilityModel.js   # Availability schema
│   ├── routes/
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── slotRoutes.js
│   ├── utils/
│   │   └── emailService.js        # Email notification service
│   ├── server.js                  # Express server setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   ├── BookingForm.jsx    # Guest booking form
│   │   │   └── AvailabilitySettings.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Landing page
│   │   │   ├── EventSetupPage.jsx # Event management
│   │   │   ├── BookingPage.jsx    # Guest booking page
│   │   │   └── DashboardPage.jsx  # Bookings management
│   │   ├── utils/
│   │   │   └── timezoneUtils.js   # Timezone helpers
│   │   ├── App.jsx                # Main app with routing
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
```

---

## 🔌 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events?slug={slug}` - Get event by slug  
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking
- `PUT /api/bookings/:id/cancel` - Cancel booking (alternative)

### Slots
- `GET /api/slots?eventId={id}&date={YYYY-MM-DD}` - Get available slots

---

## 📧 Email Configuration

### Development
Emails are logged to the console when bookings are made/cancelled.

### Production
To enable real emails, set these environment variables in `.env`:

```env
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).

---

## 🎨 Customization

### Change Brand Name
Edit [src/components/Header.jsx](frontend/src/components/Header.jsx):
```jsx
<span className="text-xl font-bold">Your Brand Name</span>
```

### Change Colors
Update Tailwind classes (using `blue-600`, `blue-700`, etc.):
```jsx
className="bg-blue-600 hover:bg-blue-700"  // Change to your colors
```

### Add More Fields to Bookings
1. Update `bookingModel.js` with new fields
2. Update `BookingForm.jsx` to capture the data
3. Update the email templates

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process using port 5174 (frontend)
lsof -ti:5174 | xargs kill -9
```

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `backend/.env`
- Verify database name matches

### Emails Not Sending
- Check backend console logs for error messages
- Ensure `emailService.js` configuration is correct
- For production, verify email credentials

### Slots Not Showing
- Ensure booking availability is set for that date
- Check that the time slots have been generated
- Verify event is created correctly

---

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Deployment

### Deploy Backend (Heroku, AWS, DigitalOcean, etc.)
1. Set environment variables on your hosting platform
2. Ensure MySQL database is accessible remotely
3. Push code to your hosting platform

### Deploy Frontend (Vercel, Netlify, etc.)
1. Update API endpoint in code to point to your backend
2. Push to your hosting platform
3. Deploy

---

## 📝 License

MIT License - Feel free to use this for personal or commercial projects.

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

---

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MySQL**
