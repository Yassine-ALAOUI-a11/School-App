import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Users, GraduationCap, BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalStudents: 0,
        newRegistrations: 0,
        activeMajors: 0,
        studentsPerMajor: []
    })
    const [years, setYears] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    async function fetchDashboardData() {
        try {
            setLoading(true)

            // 1. Total Students (Profiles with role 'student')
            const { count: studentCount, error: studentError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student')

            if (studentError) throw studentError

            // 2. Active Majors
            const { count: majorsCount, error: majorsError } = await supabase
                .from('majors')
                .select('*', { count: 'exact', head: true })

            if (majorsError) throw majorsError

            // 3. Registrations (Total)
            const { count: regCount, error: regError } = await supabase
                .from('registrations')
                .select('*', { count: 'exact', head: true })

            if (regError) throw regError

            // 4. Students per Major (Distribution)
            // Fetch all registrations with their major
            const { data: regData, error: distError } = await supabase
                .from('registrations')
                .select('major:majors(name)')

            if (distError) throw distError

            // Calculate distribution
            const distribution = {}
            regData.forEach(reg => {
                const majorName = reg.major?.name || 'Unknown'
                distribution[majorName] = (distribution[majorName] || 0) + 1
            })

            const distributionArray = Object.entries(distribution)
                .map(([name, count]) => ({ name, value: count }))
                .sort((a, b) => b.value - a.value)

            // 5. Academic Years
            const { data: yearsData, error: yearsError } = await supabase
                .from('academic_years')
                .select('*')
                .order('start_date', { ascending: false })
                .limit(3)

            if (yearsError) throw yearsError

            setStats({
                totalStudents: studentCount || 0,
                newRegistrations: regCount || 0,
                activeMajors: majorsCount || 0,
                studentsPerMajor: distributionArray
            })
            setYears(yearsData || [])

        } catch (err) {
            console.error('Error loading dashboard:', err)
            setError('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Students</p>
                    <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalStudents}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                            Total
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Registrations</p>
                    <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.newRegistrations}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Active Majors</p>
                    <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.activeMajors}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Students per Major</h2>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
                    ) : stats.studentsPerMajor.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                            <p>No registration data available</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.studentsPerMajor.map((item, index) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                        <span className="text-gray-500">{item.value} students</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{ width: `${(item.value / stats.newRegistrations) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Registration Periods</h2>
                        <Link to="/admin/academic-years" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Manage</Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {years.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No academic years configured.</p>
                            ) : (
                                years.map(year => (
                                    <div key={year.id} className={`p-4 border rounded-lg flex items-center justify-between ${year.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                        <div>
                                            <h4 className={`font-semibold ${year.is_active ? 'text-green-900' : 'text-gray-900'}`}>{year.name}</h4>
                                            <p className={`text-sm ${year.is_active ? 'text-green-700' : 'text-gray-500'}`}>
                                                {year.is_active ? 'Currently Open' : 'Closed'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${year.is_active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                            {year.is_active ? 'ACTIVE' : 'ARCHIVED'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
