import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, User, GraduationCap } from 'lucide-react'

export default function Navbar() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-blue-600" />
                            <span className="font-bold text-xl text-gray-800">EST SB Registration</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User className="h-5 w-5" />
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
