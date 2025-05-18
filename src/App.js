import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Map from "./components/Map";
import Contribute from "./pages/Contribute";
import Experience from "./pages/Experience";
import Hbcu from "./pages/Hbcu";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Programs from "./pages/Programs";
import MyContributions from "./pages/MyContributions";
import AdminDashboard from "./pages/AdminDashboard";
import Resume from './pages/Resume';
import PublicResumes from './pages/PublicResumes';
import ResumeFeedbackPage from './pages/ResumeFeedbackPage';
import GoogleCallback from './pages/GoogleCallback';
import Mentor from './pages/Mentor';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Don't render anything until auth state is determined
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Define routes where Navbar should be hidden (these pages use Sidebar instead)
  const hideNavbarRoutes = ['/landing', '/programs', '/', '/about', '/hbcu', '/experience'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* Conditionally render Navbar */}
      {shouldShowNavbar && <Navbar />}
      
      <Routes>
        {/* Public Routes - Always Accessible */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/hbcu" element={<Hbcu />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/mentor" element={<Mentor />} />

        {/* Auth Routes - Only when not logged in */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/programs" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/programs" /> : <Signup />} 
        />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/programs"
          element={<ProtectedRoute><Programs /></ProtectedRoute>}
        />
        <Route 
          path="/contribute" 
          element={<ProtectedRoute><Contribute /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-dashboard" 
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
        />
    
        <Route 
          path="/my-contributions" 
          element={<ProtectedRoute><MyContributions /></ProtectedRoute>} 
        />
        
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />
       
        <Route path="/resume" element={<Resume />} />
        
        {/* Resume Feedback Routes */}
        <Route 
          path="/public-resumes" 
          element={<ProtectedRoute><PublicResumes /></ProtectedRoute>} 
        />
        <Route 
          path="/resume-feedback/:userId" 
          element={<ProtectedRoute><ResumeFeedbackPage /></ProtectedRoute>} 
        />
        
        {/* Google Callback Route */}
        <Route 
          path="/auth/google/callback" 
          element={<GoogleCallback />} 
        />
        
        {/* Fallback route */}
        <Route 
          path="*" 
          element={user ? <Navigate to="/programs" /> : <Navigate to="/" />} 
        />
      </Routes>
    </>
  );
}

export default App;
