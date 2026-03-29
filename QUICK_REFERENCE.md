# Quick Reference Card - Schedulify

## 🚀 Quick Start (Copy & Paste)

```bash
# Terminal 1 - Backend
cd calendly-clone/backend
node server.js

# Terminal 2 - Frontend  
cd calendly-clone/frontend
npm run dev
```

**Then visit: http://localhost:5174**

---

## 📍 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5174 | Main application |
| Backend API | http://localhost:5000 | API endpoints |
| Booking Link | /book/{slug} | Share with guests |

---

## 🔑 API Endpoints

### Events
```
GET    /api/events                 - Get all events
GET    /api/events?slug=abc        - Get by slug
POST   /api/events                 - Create event
DELETE /api/events/:id             - Delete event
```

### Bookings
```
GET    /api/bookings               - Get all bookings
POST   /api/bookings               - Create booking
DELETE /api/bookings/:id           - Cancel booking
```

### Slots
```
GET    /api/slots?eventId=1&date=2026-03-30  - Get available slots
```

---

## 🎯 User Workflows

### Host: Create Event
1. Navigate to "My Events"
2. Click "Create Event Type"
3. Enter: Name, Duration, Description
4. Click "Create Event"

### Host: Set Availability
1. On event card, click "Set Availability"
2. Choose timezone
3. Toggle availability by day
4. Set working hours
5. Click "Save Availability"

### Host: Share Link
1. Click copy icon on event
2. Paste anywhere (email, social, etc.)
3. Link format: `yoursite.com/book/{event-slug}`

### Guest: Book Appointment
1. Click booking link
2. Select date from calendar
3. Select time slot
4. Enter name & email
5. Click "Confirm Booking"
6. Receive confirmation email

### Host: Manage Bookings
1. Click "Dashboard"
2. View all bookings
3. Filter: All / Upcoming / Past
4. Click booking for details
5. Cancel if needed

---

## 🗂️ File Locations

### Frontend Files
```
frontend/src/
├── App.jsx                    ← Main app routing
├── pages/
│   ├── HomePage.jsx           ← Landing page
│   ├── EventSetupPage.jsx     ← Event management
│   ├── BookingPage.jsx        ← Guest booking
│   └── DashboardPage.jsx      ← Booking management
├── components/
│   ├── Header.jsx             ← Navigation
│   └── AvailabilitySettings.jsx
└── utils/
    └── timezoneUtils.js       ← Timezone helpers
```

### Backend Files
```
backend/
├── server.js                  ← Main server file
├── config/db.js               ← Database config
├── models/
│   ├── eventModel.js
│   └── bookingModel.js
├── controllers/
│   ├── eventController.js
│   └── bookingController.js
├── routes/
│   ├── eventRoutes.js
│   └── bookingRoutes.js
└── utils/
    └── emailService.js        ← Email notifications
```

---

## 🛠️ Configuration Files

### Backend `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=calendly_db
NODE_ENV=development

# Optional (production email)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
```

### Frontend Environment
- Automatically detects backend at `http://localhost:5000`
- Detects timezone from browser
- Uses localStorage for availability settings

---

## 🔍 Debugging Commands

### Check Services Running
```bash
# Backend running?
curl http://localhost:5000/

# Frontend running?
curl http://localhost:5174/

# Database connected?
mysql -u root -p -e "SELECT * FROM calendly_db.Events;"
```

### Kill Process on Port
```bash
# Mac/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### View Database
```bash
mysql -u root -p
USE calendly_db;
SHOW TABLES;
SELECT * FROM Events;
SELECT * FROM Bookings;
```

---

## 📊 Database Schema

### Events Table
```
id          (Integer, Primary Key)
name        (String)
duration    (Integer - minutes)
description (Text)
slug        (String, Unique)
createdAt   (DateTime)
updatedAt   (DateTime)
```

### Bookings Table
```
id          (Integer, Primary Key)
event_id    (Integer, Foreign Key)
event_type_id (Integer)
date        (Date)
start_time  (Time)
end_time    (Time)
name        (String)
email       (String)
status      (String - 'scheduled' or 'cancelled')
createdAt   (DateTime)
updatedAt   (DateTime)
```

---

## 💡 Pro Tips

✨ **Faster Development**
- Use browser DevTools (F12) to debug
- Backend console shows detailed logs
- React DevTools extension for component debugging

✨ **Email Testing**
- In development, emails log to console
- Check backend terminal for email output
- In production, set up SMTP credentials

✨ **Timezone Handling**
- Browser auto-detects your timezone
- Availability is saved in localStorage
- Slots filter based on availability

✨ **Performance**
- Components are memoized to prevent re-renders
- Use React DevTools Profiler to check
- Database queries are optimized

---

## 🎨 Customization Quick Tips

### Change App Name
**File**: `frontend/src/components/Header.jsx`
```jsx
<span className="text-xl font-bold">Your Name</span>
```

### Change Colors
**Files**: Any component using `bg-blue-600`
```jsx
className="bg-YOUR-COLOR-600"  // Change to your color
```

### Update Email Template
**File**: `backend/utils/emailService.js`
- Edit HTML template for booking confirmation
- Add company logo, custom message, etc.

### Change Duration Options
**File**: `frontend/src/pages/EventSetupPage.jsx`
```jsx
<input type="number" min="15" max="480" />  // Change min/max
```

---

## ✅ Checklist Before Deployment

- [ ] Database credentials in `.env`
- [ ] Frontend API points to correct backend
- [ ] Email service configured (for production)
- [ ] Database backups set up
- [ ] HTTPS enabled (production)
- [ ] Error logging configured
- [ ] Timezone detection working
- [ ] All features tested

---

## 📱 Test on Different Devices

```bash
# Get your local IP
ipconfig getifaddr en0  # Mac
hostname -I             # Linux

# Then visit: http://YOUR_IP:5174 on phone
```

---

## 🆘 Most Common Fixes

| Issue | Solution |
|-------|----------|
| Port in use | Kill process: `lsof -i :5000` or `netstat` |
| MySQL error | Check `.env` credentials |
| Slots not showing | Set availability first |
| Emails not sending | Check backend console |
| Blank page | Check browser console (F12) |
| API errors | Restart backend server |

---

## 📚 Documentation Files

```
README.md                  - Full documentation
QUICKSTART.md             - 5-minute setup
FEATURES.md               - Feature details  
TROUBLESHOOTING.md        - Problem solutions
COMPLETION_SUMMARY.md     - What was built
```

---

## 🚀 Ready to Deploy?

1. **Frontend**: Push `frontend/` to Vercel or Netlify
2. **Backend**: Push `backend/` to Heroku, Railway, or similar
3. **Database**: Use managed MySQL (AWS RDS, Cloud SQL, etc.)
4. **Email**: Configure SMTP (Gmail, SendGrid, etc.)

See README.md for detailed deployment instructions.

---

**You're all set! Happy scheduling! 🎉**

For questions: Check docs or look at error messages in console.
