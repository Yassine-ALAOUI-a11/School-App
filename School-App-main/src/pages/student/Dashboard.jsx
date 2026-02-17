import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
    const { user } = useAuth()
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        async function fetchRegistrations() {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from('registrations')
                    .select(`
                        *,
                        majors(name),
                        academic_years(name)
                    `)
                    .eq('student_id', user.id)
                    .order('created_at', { ascending: false })

                if (mounted) {
                    if (error) {
                        console.error('Error fetching registrations:', error)
                    } else if (data) {
                        setRegistrations(data)
                    }
                    setLoading(false)
                }
            } catch (err) {
                console.error('Exception fetching registrations:', err)
                if (mounted) setLoading(false)
            }
        }

        fetchRegistrations()

        return () => { mounted = false }
    }, [user])

    const getStatusColor = (status) => {
        switch (status) {
            case 'validated': return 'text-green-600 bg-green-50 border-green-200'
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name}</p>
                </div>
                <Link
                    to="/student/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    New Registration
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        My Applications
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : registrations.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                            <FileText className="h-full w-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                        <p className="mt-1 text-gray-500">Start a new registration application to get started.</p>
                        <div className="mt-6">
                            <Link
                                to="/student/register"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Start Application
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {registrations.map((reg) => (
                            <li key={reg.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-medium text-blue-600 truncate">
                                                {reg.majors?.name}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reg.status)}`}>
                                                {reg.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 gap-4">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {new Date(reg.created_at).toLocaleDateString()}
                                            </span>
                                            <span>{reg.academic_years?.name}</span>
                                            <span>{reg.level}</span>
                                        </div>
                                        {reg.rejection_reason && (
                                            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                                Reason: {reg.rejection_reason}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
