import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Calendar, Plus, Check, Archive, AlertCircle } from 'lucide-react'

export default function AcademicYears() {
    const [years, setYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [newYear, setNewYear] = useState({ name: '', start_date: '', end_date: '' })
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchYears()
    }, [])

    async function fetchYears() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('academic_years')
                .select('*')
                .order('start_date', { ascending: false })

            if (error) throw error
            setYears(data || [])
        } catch (error) {
            console.error('Error fetching years:', error)
            setError('Failed to load academic years')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('academic_years')
                .insert([{ ...newYear, is_active: false }])

            if (error) throw error

            setNewYear({ name: '', start_date: '', end_date: '' })
            await fetchYears()
        } catch (error) {
            console.error('Error creating year:', error)
            setError('Failed to create academic year.')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function toggleActive(id, currentStatus) {
        try {
            // If setting to active, first deactivate all others (optional business rule, depends on requirements)
            // For now, assuming only one active year enforcement might be good but let's stick to simple toggle

            if (!currentStatus) {
                // Deactivate all others first
                await supabase
                    .from('academic_years')
                    .update({ is_active: false })
                    .neq('id', id)
            }

            const { error } = await supabase
                .from('academic_years')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            fetchYears()
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Failed to update status')
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                        Academic Years
                    </h1>
                    <p className="text-gray-500 mt-1">Manage school years and registration periods</p>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Section */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-semibold text-gray-700">History</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading years...</div>
                    ) : years.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No academic years found.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {years.map((year) => (
                                <div key={year.id} className={`p-4 flex items-center justify-between ${year.is_active ? 'bg-green-50/50' : 'hover:bg-gray-50'} transition-colors`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${year.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-gray-900">{year.name}</h3>
                                                {year.is_active && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleActive(year.id, year.is_active)}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${year.is_active
                                                ? 'text-yellow-600 hover:bg-yellow-50 border border-transparent'
                                                : 'text-green-600 hover:bg-green-50 border border-transparent'
                                            }`}
                                    >
                                        {year.is_active ? 'Deactivate' : 'Set Active'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Form Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-semibold text-gray-700">New Academic Year</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year Name</label>
                            <input
                                type="text"
                                required
                                value={newYear.name}
                                onChange={e => setNewYear({ ...newYear, name: e.target.value })}
                                placeholder="e.g. 2026-2027"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newYear.start_date}
                                    onChange={e => setNewYear({ ...newYear, start_date: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newYear.end_date}
                                    onChange={e => setNewYear({ ...newYear, end_date: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            {isSubmitting ? 'Creating...' : 'Create Year'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
