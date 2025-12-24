import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../UI/Loader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Loading State
  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  }

  // 2. Not Logged In
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ----------------------------------------------------
  // 🔍 DEBUGGING BLOCK (Masla pakadne ke liye)
  // ----------------------------------------------------
  // Agar role allow nahi hai, to hum screen par dikhayenge ke kyun nahi hai
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚫 Access Denied (Debug Mode)</h1>
          
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded border">
              <span className="font-bold block text-gray-500">My Role (From Database):</span>
              <code className="text-lg font-mono text-blue-700">"{user.role}"</code>
            </div>

            <div className="p-3 bg-gray-50 rounded border">
              <span className="font-bold block text-gray-500">Allowed Roles (For this Page):</span>
              <code className="text-lg font-mono text-green-700">{JSON.stringify(allowedRoles)}</code>
            </div>
          </div>

          <p className="mt-6 text-gray-600 text-xs">
            Note: Agar "My Role" <strong>guest</strong> hai, to iska matlab aap Admin wale account se login nahi hain.<br/>
            Agar "My Role" <strong>admin</strong> hai, lekin Allowed list mein nahi hai, to spelling check karein.
          </p>

          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-6 w-full py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700"
          >
            Logout & Try Again
          </button>
        </div>
      </div>
    );
  }
  // ----------------------------------------------------

  return <Outlet />;
};

export default ProtectedRoute;