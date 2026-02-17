import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, UserCircle, FilePlus, LogOut, GraduationCap, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function StudentLayout() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', href: '/student/profile', icon: UserCircle },
        { name: 'New Registration', href: '/student/register', icon: FilePlus },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 fixed h-full z-20">
                <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-200">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    <span className="font-bold text-lg text-gray-900">Student Portal</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'}`} />
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {user?.email?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.user_metadata?.full_name || 'Student'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Overlay */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-gray-900">Student Portal</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'pt-16' : 'pt-16 md:pt-0'} md:pl-64`}>
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
