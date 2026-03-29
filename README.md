
# 📅 Calendly Clone - Full Stack Scheduling System

A full-stack web application that allows users to create events, set availability, and let others book time slots — similar to Calendly.

---

##  Features

*  Create and manage event types (e.g., 30-min meeting)
*  Set weekly availability (day & time)
*  Automatic time slot generation
*  Book meetings with name & email
*  Reschedule bookings
*  Cancel bookings
*  Real-time slot availability (prevents double booking)

---

##  Tech Stack

###  Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* JavaScript (ES6+)

###  Backend

* Node.js
* Express.js

###  Database

* MySQL
* Sequelize ORM

###  Tools

* VS Code
* Postman
* Git & GitHub

---

##  Architecture

* RESTful API-based backend
* MVC Pattern (Models, Controllers, Routes)
* Client-Server Architecture

---



## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/calendly-clone.git
cd calendly-clone
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
DB_NAME=calendly_clone
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
```

Run server:

```
node server.js
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🔌 API Endpoints

### 📌 Events

* `POST /api/events` → Create event
* `GET /api/events` → Get events

### 📌 Availability

* `POST /api/availability` → Set availability
* `GET /api/availability/:eventId` → Get availability

### 📌 Slots

* `GET /api/slots?eventId=1&date=YYYY-MM-DD` → Get available slots

### 📌 Bookings

* `POST /api/bookings` → Create booking
* `PUT /api/bookings/:id/reschedule` → Reschedule
* `PUT /api/bookings/:id/cancel` → Cancel

---

## 🧠 Key Concepts Used

* REST API Design
* CRUD Operations
* Sequelize ORM & Model Relationships
* Async/Await & Error Handling
* Slot Generation Logic
* Input Validation

---


---

##  Future Improvements

*  Authentication (JWT)
*  Timezone support
*  Email notifications
*  Google Calendar integration
*  Paid booking support

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

##  License

This project is open-source and available under the MIT License.

---

##  Author

**Rajat Kumar Singh**

---


##  Screenshots
<img width="838" height="942" alt="image" src="https://github.com/user-attachments/assets/0a1212f8-ea4f-4f8a-9ad2-bbab8f3ad02c" />


  <img width="1919" height="1199" alt="Screenshot 2026-03-29 175201" src="https://github.com/user-attachments/assets/9604a698-a7d2-4bc1-ba2e-f4d6c8296bbd" />
  <img width="850" height="1039" alt="Screenshot 2026-03-29 175307" src="https://github.com/user-attachments/assets/d1477cd3-be86-460a-9795-3af60ab1674b" />
  <img width="1327" height="1018" alt="Screenshot 2026-03-29 175321" src="https://github.com/user-attachments/assets/13e6f068-a482-404a-afdc-402f2e53c636" />
<img width="1381" height="882" alt="Screenshot 2026-03-29 175338" src="https://github.com/user-attachments/assets/fd56e77b-89a3-449b-bb07-fbee875c2d83" />
<img width="1339" height="1021" alt="image" src="https://github.com/user-attachments/assets/8e7878fc-b134-447c-b093-23f553703b07" />


⭐ If you like this project, consider giving it a star!

--BACKEND IS NOT DEPLOYED YET
