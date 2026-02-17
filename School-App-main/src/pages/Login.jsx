import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendSuccess, setResendSuccess] = useState('')
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setResendSuccess('')
        setLoading(true)

        const { data, error } = await signIn({ email, password })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Redirect based on role
            const role = data.user?.user_metadata?.role || 'student'
            if (role === 'admin') navigate('/admin/dashboard')
            else if (role === 'agent') navigate('/agent/dashboard')
            else navigate('/student/dashboard')
        }
    }

    const handleResendEmail = async () => {
        if (!email) {
            setError('Please enter your email address first.')
            return
        }

        setResendLoading(true)
        setError('')
        setResendSuccess('')

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        })

        if (error) {
            setError(error.message)
        } else {
            setResendSuccess('Confirmation email resent! Please check your inbox.')
        }
        setResendLoading(false)
    }

    const isEmailNotConfirmed = error && error.toLowerCase().includes('email not confirmed')

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/hero-bg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-slate-900/90 mix-blend-multiply" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 py-8 sm:px-0">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Home
                        </Link>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="mt-2 text-sm text-blue-200">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex flex-col gap-3 text-sm mb-6 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                            {isEmailNotConfirmed && (
                                <button
                                    type="button"
                                    onClick={handleResendEmail}
                                    disabled={resendLoading}
                                    className="flex items-center justify-center gap-2 mt-1 py-1.5 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs font-medium transition-colors"
                                >
                                    <RefreshCw className={`w-3 h-3 ${resendLoading ? 'animate-spin' : ''}`} />
                                    {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                                </button>
                            )}
                        </div>
                    )}

                    {resendSuccess && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-4 rounded-xl flex items-center gap-3 text-sm mb-6 backdrop-blur-sm">
                            <AlertCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            {resendSuccess}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-1">Email address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 bg-white/5 border border-white/10 rounded-xl py-2.5 text-white placeholder-blue-300/30 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:bg-white/10 transition-all sm:text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 bg-white/5 border border-white/10 rounded-xl py-2.5 text-white placeholder-blue-300/30 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:bg-white/10 transition-all sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-900/20 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        <div className="text-sm text-center">
                            <Link to="/register" className="font-medium text-blue-300 hover:text-white transition-colors">
                                Don't have an account? <span className="underline decoration-blue-400/30 hover:decoration-blue-400">Sign up</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
