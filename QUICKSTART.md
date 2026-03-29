# ⚡ Quick Start Guide

Get Schedulify up and running in 5 minutes!

## Step 1: Prerequisites ✓

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v14+)
- [MySQL](https://www.mysql.com/) (v5.7+)

## Step 2: Clone & Install (2 min)

```bash
# Clone the repository
git clone <repository-url>
cd calendly-clone

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 3: Configure Database (1 min)

Create `backend/.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=calendly_db
NODE_ENV=development
```

Replace `your_mysql_password` with your MySQL root password.

## Step 4: Start Servers (1 min)

### Terminal 1 - Backend
```bash
cd backend
node server.js
```

You should see:
```
Server running on port 5000
✅ Database connected successfully
✅ Tables synced
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5174/
```

## Step 5: Open in Browser (30 sec)

Visit **http://localhost:5174** and you're ready to go! 🎉

---

## 🚀 Quick Test Flow

### 1. Create an Event (30 sec)
1. Click "My Events" in the header
2. Click "Create Event Type"
3. Fill in:
   - Name: "Quick Call"
   - Duration: "30"
   - Description: "A 30-minute call"
4. Click "Create Event"

### 2. Set Your Hours (30 sec)
1. Click "Set Availability" on your new event
2. Make sure Monday-Friday are enabled
3. Set times: 9:00 AM - 5:00 PM
4. Click "Save Availability"

### 3. Share & Book (30 sec)
1. Click the copy icon on your event
2. Open **http://localhost:5174/book/quick-call** in a new tab
3. You'll see the booking page!
4. Select a date and time
5. Enter: Name: "John", Email: "john@example.com"
6. Click "Confirm Booking"

### 4. Check Your Dashboard (30 sec)
1. Click "Dashboard" in the header
2. You'll see your booking listed!
3. Click on it to see full details
4. Try the "Cancel Booking" button

---

## ✨ What You Just Did

You've successfully:
- ✅ Created an event type
- ✅ Set your availability
- ✅ Generated a unique booking link
- ✅ Made a test booking
- ✅ Viewed your bookings

**That's the entire Schedulify workflow!**

---

## 🐛 Common Issues

### "Could not connect to MySQL"
- Make sure MySQL is running
- Check your password in `.env`
- Verify database name

### "Port 5000/5174 already in use"
```bash
# Kill the process using the port (Mac/Linux)
lsof -ti:5000 | xargs kill -9

# For Windows, use:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Module not found" errors
```bash
# Reinstall dependencies
npm install
```

---

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [FEATURES.md](./FEATURES.md) for all features
- Explore the code in `frontend/src` and `backend/`
- Customize the branding in [Header.jsx](./frontend/src/components/Header.jsx)
- Deploy to production (see Deployment section in README)

---

## 🎯 Pro Tips

1. **Email Testing**: Emails are logged to backend console in development
2. **Database**: Use MySQL Workbench to view your data
3. **API Testing**: Use Postman to test endpoints at `http://localhost:5000/api`
4. **Styling**: Update Tailwind colors in component files
5. **Timezone**: Your timezone is auto-detected from browser

---

## 📞 Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review [FEATURES.md](./FEATURES.md) for feature descriptions
- Check the backend console for error messages
- Check the browser console (F12) for frontend errors

---

**Happy Scheduling! 🎉**

Built with React, Node.js, and MySQL • Open Source • MIT License
