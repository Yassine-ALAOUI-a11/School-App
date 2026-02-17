import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function NewRegistration() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        cne: '',
        cin: '',
        level: '1ère année',
        birthDate: '',
        address: '',
        phone: '',
        majorId: '',
        academicYearId: '' // Should be fetched from active year
    })

    const [majors, setMajors] = useState([])
    const [academicYear, setAcademicYear] = useState(null)
    const [files, setFiles] = useState({
        cin: null,
        bac: null,
        transcripts: null,
        photo: null
    })

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            // Fetch active academic year
            const { data: yearData } = await supabase
                .from('academic_years')
                .select('*')
                .eq('is_active', true)
                .single()

            if (yearData) {
                setAcademicYear(yearData)
                setFormData(prev => ({ ...prev, academicYearId: yearData.id }))
            }

            // Fetch majors
            const { data: majorsData } = await supabase
                .from('majors')
                .select('*')
                .order('name')

            if (majorsData) setMajors(majorsData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleFileChange = (e, type) => {
        const file = e.target.files[0]
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }))
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!academicYear) throw new Error("No active academic year found")
            if (!formData.majorId) throw new Error("Please select a major")

            // 1. Update Student Profile
            const { error: profileError } = await supabase
                .from('students')
                .upsert({
                    id: user.id,
                    cne: formData.cne,
                    cin: formData.cin,
                    birth_date: formData.birthDate,
                    address: formData.address,
                    phone: formData.phone
                })

            if (profileError) throw profileError

            // 2. Create Registration
            const { data: registration, error: regError } = await supabase
                .from('registrations')
                .insert({
                    student_id: user.id,
                    academic_year_id: academicYear.id,
                    major_id: formData.majorId,
                    level: formData.level,
                    status: 'pending'
                })
                .select()
                .single()

            if (regError) throw regError

            // 3. Upload Documents & Create Records
            const fileTypes = [
                { key: 'cin', type: 'CIN', label: 'CIN' },
                { key: 'bac', type: 'BAC', label: 'Baccalauréat' },
                { key: 'transcripts', type: 'RELEVE_NOTES', label: 'Relevé de notes' },
                { key: 'photo', type: 'PHOTO', label: 'Photo' }
            ]

            for (const item of fileTypes) {
                const file = files[item.key]
                if (file) {
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${registration.id}/${item.type}_${Date.now()}.${fileExt}`

                    const { error: uploadError } = await supabase.storage
                        .from('documents')
                        .upload(fileName, file)

                    if (uploadError) throw uploadError

                    // Get Public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('documents')
                        .getPublicUrl(fileName)

                    const { error: docError } = await supabase
                        .from('documents')
                        .insert({
                            registration_id: registration.id,
                            type: item.type,
                            file_url: publicUrl
                        })

                    if (docError) throw docError
                }
            }

            alert("Registration submitted successfully!")
            navigate('/student/dashboard')

        } catch (error) {
            console.error(error)
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">New Registration</h1>

                {/* Progress Steps */}
                <div className="flex items-center mb-8 bg-gray-50 rounded-lg p-4">
                    <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <span className="w-8 h-8 flex items-center justify-center border-2 border-current rounded-full font-bold mr-2">1</span>
                        Personal Info
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                    <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <span className="w-8 h-8 flex items-center justify-center border-2 border-current rounded-full font-bold mr-2">2</span>
                        Academic Choice
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                    <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <span className="w-8 h-8 flex items-center justify-center border-2 border-current rounded-full font-bold mr-2">3</span>
                        Documents
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CNE / Massar</label>
                                    <input
                                        name="cne"
                                        type="text"
                                        required
                                        value={formData.cne}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                                    <input
                                        name="cin"
                                        type="text"
                                        required
                                        value={formData.cin}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                                <input
                                    name="birthDate"
                                    type="date"
                                    required
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    required
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                            >
                                Next Step
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Choose Major</label>
                                <select
                                    name="majorId"
                                    required
                                    value={formData.majorId}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                >
                                    <option value="">Select a major...</option>
                                    {majors.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                                >
                                    Next Step
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                <p className="font-semibold">Documents Required:</p>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li>National ID Card (CIN)</li>
                                    <li>Baccalaureate Diploma</li>
                                    <li>Transcripts (Relevé de notes)</li>
                                    <li>Recent Photo</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CIN Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CIN Scan</label>
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors bg-white">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange(e, 'cin')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="text-center">
                                            {files.cin ? (
                                                <div className="flex flex-col items-center text-green-600">
                                                    <CheckCircle className="h-8 w-8 mb-2" />
                                                    <span className="text-sm font-medium truncate w-full px-2">{files.cin.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <span className="text-sm">Click to upload CIN</span>
                                                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* BAC Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Baccalaureate</label>
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors bg-white">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange(e, 'bac')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="text-center">
                                            {files.bac ? (
                                                <div className="flex flex-col items-center text-green-600">
                                                    <CheckCircle className="h-8 w-8 mb-2" />
                                                    <span className="text-sm font-medium truncate w-full px-2">{files.bac.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <span className="text-sm">Click to upload BAC</span>
                                                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Transcripts Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Transcripts</label>
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors bg-white">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange(e, 'transcripts')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="text-center">
                                            {files.transcripts ? (
                                                <div className="flex flex-col items-center text-green-600">
                                                    <CheckCircle className="h-8 w-8 mb-2" />
                                                    <span className="text-sm font-medium truncate w-full px-2">{files.transcripts.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <span className="text-sm">Click to upload Relevé</span>
                                                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Personal Photo</label>
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors bg-white">
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange(e, 'photo')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="text-center">
                                            {files.photo ? (
                                                <div className="flex flex-col items-center text-green-600">
                                                    <CheckCircle className="h-8 w-8 mb-2" />
                                                    <span className="text-sm font-medium truncate w-full px-2">{files.photo.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <span className="text-sm">Click to upload Photo</span>
                                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : 'Submit Application'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
