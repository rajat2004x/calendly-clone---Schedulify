// Script to seed demo events for the user dashboard
const axios = require('axios');

async function seedEvents() {
  const events = [
    {
      name: "1:1 Intro Meeting",
      duration: 30,
      description: "A quick introduction call to discuss your needs and how I can help.",
    },
    {
      name: "Product Demo",
      duration: 45,
      description: "A detailed walkthrough of our product with Q&A.",
    },
    {
      name: "Strategy Session",
      duration: 60,
      description: "A deep-dive strategy session to plan your next steps.",
    },
    {
      name: "Coffee Chat",
      duration: 20,
      description: "An informal chat to get to know each other.",
    },
    {
      name: "Project Kickoff",
      duration: 90,
      description: "Kickoff meeting for new projects, including timeline and deliverables.",
    }
  ];

  for (const event of events) {
    try {
      const res = await axios.post('http://localhost:10000/api/events', event);
      console.log('Created event:', res.data.name);
    } catch (err) {
      console.error('Error creating event:', event.name, err.response?.data || err.message);
    }
  }
}

seedEvents();
