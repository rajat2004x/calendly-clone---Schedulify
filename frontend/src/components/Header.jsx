import { Link } from "react-router-dom";
import { Calendar, Menu } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg group-hover:shadow-lg transition">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Schedulify
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 hover:text-slate-900 transition font-medium">
              Home
            </Link>
            <Link to="/events" className="text-slate-600 hover:text-slate-900 transition font-medium">
              My Events
            </Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition font-medium">
              Dashboard
            </Link>
          </nav>

          {/* CTA Button */}
          <button className="hidden md:block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg">
            Sign In
          </button>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
