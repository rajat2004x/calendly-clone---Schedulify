# REST API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Event Types (Meeting Types)

### 1. Create Event Type
**POST** `/events`

**Request Body:**
```json
{
  "name": "30 Minute Consultation",
  "duration": 30,
  "description": "Short introductory call for new clients",
  "buffer_time": 15,
  "custom_questions": [
    "What is the main topic?",
    "Have you used our service before?"
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "name": "30 Minute Consultation",
  "duration": 30,
  "slug": "30-minute-consultation",
  "description": "Short introductory call for new clients",
  "buffer_time": 15,
  "custom_questions": [...],
  "createdAt": "2026-03-31T10:00:00.000Z",
  "updatedAt": "2026-03-31T10:00:00.000Z"
}
```

---

### 2. List All Event Types
**GET** `/events`

**Response:**
```json
[
  {
    "id": 1,
    "name": "30 Minute Consultation",
    "duration": 30,
    "slug": "30-minute-consultation",
    ...
  },
  {
    "id": 2,
    "name": "1 Hour Strategy Session",
    "duration": 60,
    "slug": "1-hour-strategy-session",
    ...
  }
]
```

---

### 3. Get Event by ID
**GET** `/events/:id`

**Response:**
```json
{
  "id": 1,
  "name": "30 Minute Consultation",
  "duration": 30,
  "slug": "30-minute-consultation",
  ...
}
```

---

### 4. Get Event by Username and Slug (Public)
**GET** `/events/:username/:eventSlug`

**Example:** `/events/rajat/30-minute-consultation`

**Response:**
```json
{
  "id": 1,
  "name": "30 Minute Consultation",
  ...
}
```

---

### 5. Update Event Type
**PUT** `/events/:id`

**Request Body:**
```json
{
  "name": "45 Minute Consultation",
  "duration": 45,
  "description": "Updated description",
  "buffer_time": 20
}
```

**Response:**
```json
{
  "id": 1,
  "name": "45 Minute Consultation",
  "duration": 45,
  ...
}
```

---

### 6. Delete Event Type
**DELETE** `/events/:id`

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

---

## Availability Settings

### 1. Set Availability
**POST** `/availability`

**Request Body:**
```json
{
  "event_type_id": 1,
  "day_of_week": 1,
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "timezone": "America/New_York"
}
```

**Note:** `day_of_week` is 0=Sunday, 1=Monday, ..., 6=Saturday

**Response:**
```json
{
  "id": 1,
  "event_type_id": 1,
  "day_of_week": 1,
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "timezone": "America/New_York",
  "createdAt": "2026-03-31T10:00:00.000Z"
}
```

---

### 2. Get Availability for Event
**GET** `/availability/:eventId`

**Optional Query:** `?date=2026-04-05`

**Without date** - Returns raw availability settings:
```json
[
  {
    "id": 1,
    "event_type_id": 1,
    "day_of_week": 1,
    "start_time": "09:00:00",
    "end_time": "17:00:00",
    "timezone": "America/New_York"
  }
]
```

**With date** - Returns available slots for that day:
```json
[
  {
    "start": "09:00",
    "end": "09:30",
    "available": true
  },
  {
    "start": "09:30",
    "end": "10:00",
    "available": true
  },
  {
    "start": "10:00",
    "end": "10:30",
    "available": false
  }
]
```

---

## Time Slots

### Get Available Slots for a Date
**GET** `/slots?eventId=1&date=2026-04-05`

**Response:**
```json
[
  {
    "start": "09:00",
    "end": "09:30",
    "available": true
  },
  {
    "start": "09:30",
    "end": "10:00",
    "available": true
  },
  {
    "start": "10:00",
    "end": "10:30",
    "available": false
  }
]
```

---

## Bookings

### 1. Create Booking
**POST** `/bookings`

**Request Body:**
```json
{
  "event_type_id": 1,
  "event_id": 1,
  "date": "2026-04-05",
  "start_time": "09:00",
  "end_time": "09:30",
  "name": "John Doe",
  "email": "john@example.com",
  "guest_notes": "Looking forward to our meeting"
}
```

**Response:**
```json
{
  "id": 1,
  "event_type_id": 1,
  "event_id": 1,
  "date": "2026-04-05",
  "start_time": "09:00:00",
  "end_time": "09:30:00",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "scheduled",
  "guest_notes": "Looking forward to our meeting",
  "createdAt": "2026-03-31T10:00:00.000Z"
}
```

**Error (Double Booking):**
```json
{
  "error": "Slot unavailable (buffer applied)"
}
```

---

### 2. Get All Bookings (Admin)
**GET** `/bookings`

**Response:**
```json
[
  {
    "id": 1,
    "event_type_id": 1,
    "date": "2026-04-05",
    "start_time": "09:00:00",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "scheduled",
    ...
  }
]
```

---

### 3. Get User's Bookings (by Email)
**GET** `/bookings/user/:email`

**Example:** `/bookings/user/john@example.com`

**Response:**
```json
[
  {
    "id": 1,
    "event_type_id": 1,
    "date": "2026-04-05",
    "start_time": "09:00:00",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "scheduled",
    ...
  }
]
```

---

### 4. Cancel Booking
**DELETE** `/bookings/:id`

**Response:**
```json
{
  "message": "Booking cancelled successfully"
}
```

---

### 5. Reschedule Booking
**PUT** `/bookings/:id/reschedule`

**Request Body:**
```json
{
  "date": "2026-04-08",
  "start_time": "14:00",
  "end_time": "14:30"
}
```

**Response:**
```json
{
  "id": 1,
  "event_type_id": 1,
  "date": "2026-04-08",
  "start_time": "14:00:00",
  "end_time": "14:30:00",
  "status": "scheduled",
  ...
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "error": "Event not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting. Recommended for production:
- 10 requests/minute for booking creation
- 100 requests/minute for read operations

---

## Authentication

Currently no authentication required. Single default user (admin/host).

For production, implement:
- JWT-based authentication
- Role-based access control (admin, user)
- API key authentication for external integrations

---

## Timezone Handling

All times are stored in UTC in the database. Visitor timezone is detected and stored with the booking.

Frontend handles conversion to local time for display.

---

## Testing with cURL

### Create Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "30 Minute Consultation",
    "duration": 30,
    "description": "Short intro call"
  }'
```

### Create Availability
```bash
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -d '{
    "event_type_id": 1,
    "day_of_week": 1,
    "start_time": "09:00:00",
    "end_time": "17:00:00",
    "timezone": "UTC"
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "event_type_id": 1,
    "date": "2026-04-05",
    "start_time": "09:00",
    "end_time": "09:30",
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Get Available Slots
```bash
curl "http://localhost:5000/api/slots?eventId=1&date=2026-04-05"
```

### Get User Bookings
```bash
curl "http://localhost:5000/api/bookings/user/john@example.com"
```

---

**Last Updated**: March 31, 2026
