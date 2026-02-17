import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Users, Settings, LogOut, BarChart3, BookOpen, Menu, X, Calendar } from 'lucide-react'

import { useState } from 'react'

export default function AdminLayout() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Academic Years', href: '/admin/academic-years', icon: Calendar },
        { name: 'Majors', href: '/admin/majors', icon: BookOpen },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]



    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-indigo-900 text-white border-r border-indigo-800 fixed h-full z-20">
                <div className="flex items-center gap-3 px-6 h-16 border-b border-indigo-800">
                    <Settings className="h-8 w-8 text-indigo-400" />
                    <span className="font-bold text-lg text-white">Admin Panel</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                ? 'bg-indigo-700 text-white'
                                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-indigo-300'}`} />
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-indigo-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white font-bold text-xs">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.user_metadata?.full_name || 'Admin'}
                            </p>
                            <p className="text-xs text-indigo-300 truncate">System Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-indigo-900 text-white border-b border-indigo-800 z-20 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings className="h-6 w-6 text-indigo-400" />
                    <span className="font-bold">Admin Panel</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-indigo-200">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            <main className={`flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'pt-16' : 'pt-16 md:pt-0'} md:pl-64`}>
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
