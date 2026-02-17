import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Users, GraduationCap, BarChart3, TrendingUp } from 'lucide-react'


export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)

    // Mock data for display purposes until we have enough real data
    const data = [
        { name: 'G. Info', students: 120 },
        { name: 'T. Mgmt', students: 85 },
        { name: 'G. Elec', students: 65 },
        { name: 'Agro', students: 40 },
    ]

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +12%
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Students</p>
                    <h3 className="text-2xl font-bold text-gray-900">310</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">New Registrations</p>
                    <h3 className="text-2xl font-bold text-gray-900">45</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Active Majors</p>
                    <h3 className="text-2xl font-bold text-gray-900">4</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Students per Major</h2>
                    <div className="h-80">
                        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                            <p className="text-gray-400 font-medium mb-4">Chart visualization (Recharts) temporarily disabled for React 19 compatibility</p>
                            <button
                                onClick={async () => {
                                    if (!confirm('Initialize system with default data?')) return;
                                    setLoading(true);

                                    try {
                                        // 1. Create Academic Year
                                        const { error: yearError } = await supabase
                                            .from('academic_years')
                                            .upsert({
                                                name: '2025-2026',
                                                start_date: '2025-09-01',
                                                end_date: '2026-06-30',
                                                is_active: true
                                            }, { onConflict: 'name' })

                                        if (yearError) throw yearError;

                                        // 2. Create Majors
                                        const majors = [
                                            { name: 'Génie Informatique', code: 'GI' },
                                            { name: 'Techniques de Management', code: 'TM' },
                                            { name: 'Génie Électrique', code: 'GE' }
                                        ]

                                        for (const m of majors) {
                                            const { error: majorError } = await supabase
                                                .from('majors')
                                                .upsert(m, { onConflict: 'code' })
                                            if (majorError) throw majorError;
                                        }

                                        alert('System initialized successfully!');
                                        window.location.reload();
                                    } catch (err) {
                                        alert('Error: ' + err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Initialize System Data
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Registration Periods</h2>
                    <div className="flex flex-col gap-4">
                        <div className="p-4 border rounded-lg flex items-center justify-between bg-green-50 border-green-200">
                            <div>
                                <h4 className="font-semibold text-green-900">2026-2027</h4>
                                <p className="text-sm text-green-700">Currently Open</p>
                            </div>
                            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">ACTIVE</span>
                        </div>
                        <div className="p-4 border rounded-lg flex items-center justify-between bg-gray-50">
                            <div>
                                <h4 className="font-semibold text-gray-900">2025-2026</h4>
                                <p className="text-sm text-gray-500">Archived</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-bold">CLOSED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
