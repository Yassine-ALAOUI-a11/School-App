import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react'

export default function Majors() {
    const [majors, setMajors] = useState([])
    const [loading, setLoading] = useState(true)
    const [newMajor, setNewMajor] = useState({ name: '', code: '' })
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchMajors()
    }, [])

    async function fetchMajors() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('majors')
                .select('*')
                .order('name')

            if (error) throw error
            setMajors(data || [])
        } catch (error) {
            console.error('Error fetching majors:', error)
            setError('Failed to load majors')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!newMajor.name || !newMajor.code) return

        setIsSubmitting(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('majors')
                .insert([newMajor])

            if (error) throw error

            setNewMajor({ name: '', code: '' })
            await fetchMajors()
        } catch (error) {
            console.error('Error creating major:', error)
            setError('Failed to create major. Code might already exist.')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this major?')) return

        try {
            const { error } = await supabase
                .from('majors')
                .delete()
                .eq('id', id)

            if (error) throw error

            setMajors(majors.filter(m => m.id !== id))
        } catch (error) {
            console.error('Error deleting major:', error)
            alert('Failed to delete major')
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-indigo-600" />
                        Majors Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage study fields and departments</p>
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
                        <h2 className="font-semibold text-gray-700">Existing Majors</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading majors...</div>
                    ) : majors.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No majors found. Add one to get started.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {majors.map((major) => (
                                <div key={major.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {major.code}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{major.name}</h3>
                                            <p className="text-sm text-gray-500">Code: {major.code}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(major.id)}
                                        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                        title="Delete Major"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Form Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-semibold text-gray-700">Add New Major</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Major Name</label>
                            <input
                                type="text"
                                required
                                value={newMajor.name}
                                onChange={e => setNewMajor({ ...newMajor, name: e.target.value })}
                                placeholder="e.g. Computer Science"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Major Code</label>
                            <input
                                type="text"
                                required
                                value={newMajor.code}
                                onChange={e => setNewMajor({ ...newMajor, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. CS"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 uppercase"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            {isSubmitting ? 'Adding...' : 'Add Major'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
