import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { FileCheck, UserCheck, UserX, Clock } from 'lucide-react'

export default function AgentDashboard() {
    const [stats, setStats] = useState({
        pending: 0,
        validated: 0,
        rejected: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch real stats from DB
        async function fetchStats() {
            try {
                const { count: pendingCount } = await supabase
                    .from('registrations')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending')

                const { count: validatedCount } = await supabase
                    .from('registrations')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'validated')

                const { count: rejectedCount } = await supabase
                    .from('registrations')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'rejected')

                setStats({
                    pending: pendingCount || 0,
                    validated: validatedCount || 0,
                    rejected: rejectedCount || 0
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Agent Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
                        <h3 className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.pending}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Validated</p>
                        <h3 className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.validated}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <UserX className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Rejected</p>
                        <h3 className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.rejected}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                    <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View All</button>
                </div>
                <div className="p-12 text-center text-gray-500">
                    <FileCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p>Select "Pending Applications" from the sidebar to manage files.</p>
                </div>
            </div>
        </div>
    )
}
