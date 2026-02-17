import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { User, MapPin, Phone, Calendar, CreditCard, Save, AlertCircle } from 'lucide-react'

export default function Profile() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [formData, setFormData] = useState({
        full_name: '',
        cne: '',
        cin: '',
        birth_date: '',
        address: '',
        phone: ''
    })

    useEffect(() => {
        if (user) {
            getProfile()
        }
    }, [user])

    async function getProfile() {
        try {
            setLoading(true)

            // 1. Get auth metadata for name if not in DB
            const { user_metadata } = user

            // 2. Get profile from public.students
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error)
            }

            setFormData({
                full_name: user_metadata?.full_name || '',
                cne: data?.cne || '',
                cin: data?.cin || '',
                birth_date: data?.birth_date || '',
                address: data?.address || '',
                phone: data?.phone || ''
            })

        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile(e) {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const updates = {
                id: user.id,
                cne: formData.cne,
                cin: formData.cin,
                birth_date: formData.birth_date,
                address: formData.address,
                phone: formData.phone,
                updated_at: new Date()
            }

            const { error } = await supabase
                .from('students')
                .upsert(updates)

            if (error) throw error

            // Also update auth metadata for full name if changed
            if (formData.full_name !== user.user_metadata.full_name) {
                const { error: authError } = await supabase.auth.updateUser({
                    data: { full_name: formData.full_name }
                })
                if (authError) throw authError
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        <AlertCircle className="h-5 w-5" />
                        {message.text}
                    </div>
                )}

                <form onSubmit={updateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info Section */}
                        <div className="md:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-500 shadow-sm p-2.5 border cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                                    placeholder="+212 6..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                                    placeholder="Your full address..."
                                />
                            </div>
                        </div>

                        {/* Academic Identifiers Section */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Academic Identifiers</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CNE / Code Massar</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="cne"
                                    value={formData.cne}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                                    placeholder="E.g., D13..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="cin"
                                    value={formData.cin}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                                    placeholder="E.g., M123456"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
