import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/UserDashboard";
import DummyBookingPage from "./pages/DummyBookingPage";
import EventSetupPage from "./pages/EventSetupPage";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import "./App.css";
import "./animations.css";

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/events" element={<EventSetupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            {/* Dummy event booking */}
            <Route path="/book/dummy/:eventSlug" element={<DummyBookingPage />} />
            {/* Real event booking (by id) */}
            <Route path="/book/real/:eventSlug" element={<BookingPage />} />
            {/* Legacy route for direct slug */}
            <Route path="/book/:eventSlug" element={<BookingPage />} />
            {/* Creator dashboard preview (optional) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-110 z-40 bounce-in"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}

        {/* Footer */}
        <footer className="bg-slate-900 text-white mt-24">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">Schedulify</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Professional scheduling platform for modern teams. Simplify your booking process.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="/events" className="hover:text-white transition">Event Setup</a></li>
                  <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
                  <li><a href="/" className="hover:text-white transition">Features</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Security</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8">
              <p className="text-center text-slate-400 text-sm">
                © 2026 Schedulify. All rights reserved. Built with ❤️
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;