import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Users, FileCheck, LogOut, ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AgentLayout() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/agent/dashboard', icon: LayoutDashboard },
        { name: 'Pending Applications', href: '/agent/applications', icon: FileCheck },
        { name: 'Students List', href: '/agent/students', icon: Users },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white border-r border-gray-800 fixed h-full z-20">
                <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-800">
                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                    <span className="font-bold text-lg text-white">Agent Portal</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-gray-400'}`} />
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold text-xs">
                            AG
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.user_metadata?.full_name || 'Agent'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">Administration</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white border-b border-gray-800 z-20 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    <span className="font-bold">Agent Portal</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400">
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
