import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Check if user has required role (assuming role is in user metadata)
    const userRole = user.user_metadata?.role || 'student'

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace /> // Unauthorized access redirects to home
    }

    return <Outlet />
}
