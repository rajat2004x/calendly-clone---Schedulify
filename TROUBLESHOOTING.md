# 🔧 Troubleshooting Guide

Common issues and their solutions.

## 🌐 Frontend Issues

### Page won't load (blank screen)
**Problem**: Browser shows blank page or loading spinner

**Solutions**:
1. Check console for errors (Press F12)
2. Ensure backend is running: `http://localhost:5000`
3. Clear browser cache: Ctrl+Shift+Delete
4. Check if frontend is running: `http://localhost:5174`
5. Restart both servers

### API calls failing (Network error)
**Problem**: Console shows "Failed to fetch" or CORS errors

**Solutions**:
```bash
# 1. Verify backend is running
curl http://localhost:5000/

# 2. Check API endpoint in code
# Should be: http://localhost:5000/api

# 3. Restart backend
cd backend
node server.js

# 4. Check browser network tab (F12 → Network)
```

### Slots not showing on booking page
**Problem**: Booking page shows "Select a date" but no time slots appear

**Solutions**:
1. Ensure availability is set for that date/day
2. Check backend console for slot generation errors
3. Verify event duration is not too long (max 480 min)
4. Check database has slot data:
   ```sql
   SELECT * FROM Bookings WHERE date = '2026-03-30';
   ```

### Timezone showing as undefined
**Problem**: Booking page shows "undefined" instead of timezone

**Solutions**:
1. Browser may have blocked timezone detection
2. Try in Incognito/Private mode
3. Check browser privacy settings
4. Manually set timezone in localStorage:
   ```javascript
   localStorage.setItem("userTimezone", "America/New_York");
   ```

### Copy link button not working
**Problem**: Clicking copy icon doesn't copy link

**Solutions**:
1. Browser may have clipboard restrictions
2. Use HTTPS in production (not HTTP)
3. Check browser console for errors
4. Try different browser
5. Manually copy the link

---

## 🗄️ Database Issues

### MySQL connection failed
**Problem**: 
```
Error: getaddrinfo ENOTFOUND localhost
Error: connect EACCES EACCES
Error: ER_BAD_DB_error
```

**Solutions**:
```bash
# 1. Check MySQL is running
# Mac
brew services list

# Linux
sudo systemctl status mysql

# Windows - Check Services or run
mysql -u root -p

# 2. Verify credentials in .env
# Should match your MySQL setup

# 3. Create database if missing
mysql -u root -p -e "CREATE DATABASE calendly_db;"

# 4. Check .env format
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=calendly_db

# 5. Restart MySQL
# Mac
brew services restart mysql

# Linux  
sudo systemctl restart mysql

# Windows
net stop MySQL80
net start MySQL80
```

### Database tables not created
**Problem**: Connection works but tables are missing

**Solutions**:
```bash
# 1. Restart backend (Sequelize will auto-sync)
cd backend
node server.js

# 2. Check backend output for sync messages
# Should say: "✅ Tables synced"

# 3. Manually verify tables
mysql -u root -p calendly_db
SHOW TABLES;

# 4. Clear and reset (be careful!)
mysql -u root -p
DROP DATABASE calendly_db;
CREATE DATABASE calendly_db;

# Then restart backend
```

### Data not persisting
**Problem**: Data disappears after restart

**Solutions**:
1. Ensure MySQL is not set to in-memory storage
2. Check database file location:
   ```bash
   mysql -u root -p -e "SELECT @@datadir;"
   ```
3. Verify sufficient disk space
4. Check MySQL error log:
   ```bash
   tail -f /var/log/mysql/error.log
   ```

---

## 📧 Email Issues

### Emails not sending (Production)
**Problem**: Bookings created but no emails received

**Solutions**:
```bash
# 1. Check backend console for errors
# Should see: "✅ Email sent to..."

# 2. Verify .env variables
echo $EMAIL_USER
echo $EMAIL_PASSWORD

# 3. For Gmail:
# a. Enable "Less secure app access"
# b. Use App-specific password (not account password)
# c. Check: https://myaccount.google.com/app-passwords

# 4. Test email service
cd backend
node -e "
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
t.verify((err) => {
  console.log(err ? 'Error: ' + err : 'Ready!');
});
"
```

### Emails in wrong format
**Problem**: Email content is plain text or missing styling

**Solutions**:
1. Check email client supports HTML
2. Update email template in `backend/utils/emailService.js`
3. Test with different email provider (Gmail, Outlook, etc.)

---

## ⚡ Performance Issues

### Slow page loads
**Problem**: Website loads slowly

**Solutions**:
```bash
# 1. Check network tab (F12 → Network)
# API calls should be < 200ms

# 2. Rebuild frontend bundle
cd frontend
npm run build

# 3. Check database performance
# Add indexes:
mysql -u root -p calendly_db
CREATE INDEX idx_event_id ON Bookings(event_id);
CREATE INDEX idx_date ON Bookings(date);

# 4. Clear browser cache
Ctrl+Shift+Delete

# 5. Restart both servers
```

### High memory usage
**Problem**: Node process uses lots of RAM

**Solutions**:
```bash
# 1. Check process memory
ps aux | grep node

# 2. Kill and restart clean
killall node
cd backend && node server.js

# 3. Check for memory leaks in code
# Use: node --inspect --max-old-space-size=4096 server.js
```

---

## 🔒 Security Issues

### CORS errors
**Problem**: 
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions**:
```javascript
// In backend server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
```

### Sensitive data exposed
**Problem**: API returns too much information

**Solutions**:
1. Never expose passwords or tokens
2. Update `.env` - don't commit to Git
3. Use `.gitignore`:
   ```
   .env
   node_modules/
   ```
4. Remove console logs in production

---

## 🚀 Deployment Issues

### Application crashes on start
**Problem**: Something went wrong (application crashed)

**Solutions**:
```bash
# 1. Check error logs
tail -f logs/error.log

# 2. Verify all dependencies installed
npm install

# 3. Check Node version
node --version  # Should be v14+

# 4. Check environment variables set
env | grep DB_

# 5. Check port not already in use
lsof -i :5000
lsof -i :5174
```

### Port in use error
**Problem**: 
```
Error: listen EADDRINUSE :::5000
Error: listen EADDRINUSE :::5174
```

**Solutions**:
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 node server.js
```

### Environment variables not loading
**Problem**: `.env` file is not being read

**Solutions**:
```bash
# 1. Install dotenv if missing
npm install dotenv

# 2. Check .env location - must be in backend root
ls backend/.env

# 3. Restart after creating .env
# dotenv only loads on startup

# 4. Verify syntax
# No spaces around = sign
DB_HOST=localhost  ✓
DB_HOST = localhost  ✗
```

---

## 📱 Mobile/Responsive Issues

### UI broken on mobile
**Problem**: Layout looks weird on phone

**Solutions**:
1. Check viewport meta tag in `frontend/index.html`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```
2. Test in browser DevTools (F12 → toggle device toolbar)
3. Check Tailwind responsive classes (md:, lg:, etc.)

### Touch events not working
**Problem**: Buttons don't work on mobile

**Solutions**:
1. Check for 300ms touch delay
2. Ensure buttons have sufficient touch target size (44x44px minimum)
3. Test in actual mobile device, not just DevTools

---

## 🔍 Debugging Tips

### Enable Debug Mode
```bash
# Frontend - check browser console
F12 → Console

# Backend - enable debug logging
DEBUG=* node server.js

# MySQL - log all queries  
mysql -u root -p
SET GLOBAL general_log = 'ON';
```

### Use Browser DevTools
- **Network Tab**: See API calls and performance
- **Console Tab**: See JavaScript errors
- **Application Tab**: Check localStorage, sessionStorage
- **Sources Tab**: Set breakpoints to debug code

### Use Database GUI
```bash
# Install MySQL Workbench for visual database debugging
# Or use command line:
mysql -u root -p calendly_db
SELECT * FROM Events;
SELECT * FROM Bookings;
```

---

## 📞 Still Stuck?

1. Check all error messages carefully - they usually tell you the problem
2. Google the error message + "Stack Overflow"
3. Check GitHub Issues for similar problems
4. Look at server console output and browser console
5. Try with a fresh browser tab / incognito mode
6. Restart both the frontend and backend servers
7. Reinstall dependencies: `rm -rf node_modules && npm install`

---

**Most problems can be solved by:**
1. Reading the error message carefully
2. Checking backend console output
3. Checking browser console (F12)
4. Restarting servers
5. Clearing browser cache

**Good luck! 🚀**
