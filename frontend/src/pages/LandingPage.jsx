import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-blue-700">Welcome to Schedulify</h1>
        <p className="mb-8 text-slate-600 text-center">Choose your experience:</p>
        <div className="flex flex-col gap-6 w-full">
          <Link
            to="/user-dashboard"
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-xl text-center hover:bg-blue-700 transition"
          >
            User Dashboard
          </Link>
          <Link
            to="/dashboard"
            className="w-full py-4 bg-slate-200 text-blue-700 rounded-lg font-semibold text-xl text-center hover:bg-blue-100 transition"
          >
            Creator Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
