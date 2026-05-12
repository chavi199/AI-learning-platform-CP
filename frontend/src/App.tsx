import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Home, History, UserCircle, Shield, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import Admin from "./pages/Admin";

function Navigation() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600"
                >
                  <History className="w-5 h-5 mr-2" />
                  History
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <UserCircle className="w-5 h-5 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
