import { Link } from "react-router-dom";
import { CheckCircle, Clock, Settings, Share2, Calendar, Zap } from "lucide-react";

function HomePage() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Simple Scheduling",
      description: "Share your calendar and let others book time with you",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Avoid Back-and-Forth",
      description: "No more email chains trying to find a time that works",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Easy Sharing",
      description: "Share a unique link to your availability",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Setup",
      description: "Get started in minutes with our simple interface",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Full Control",
      description: "Manage your availability and booking preferences",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Confirmations",
      description: "Automatic confirmations and reminders for bookings",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Scheduling built for teams
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Stop spending time coordinating meetings. Schedulify makes it easy to schedule meetings, interviews, and appointments without the back-and-forth emails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/events"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl text-center"
              >
                Get Started
              </Link>
              <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                View Demo
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Calendar Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to schedule smarter
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features built to save time and improve your scheduling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition border border-slate-200"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to simplify your scheduling?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Create your first event and start sharing your availability today
          </p>
          <Link
            to="/events"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
          >
            Create an Event
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
