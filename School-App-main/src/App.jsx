import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/student/Dashboard'
import NewRegistration from './pages/student/NewRegistration'
import Profile from './pages/student/Profile'
import StudentLayout from './components/layout/StudentLayout'

import AgentLayout from './components/layout/AgentLayout'
import AdminLayout from './components/layout/AdminLayout'
import AgentDashboard from './pages/agent/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import Majors from './pages/admin/Majors'
import AcademicYears from './pages/admin/AcademicYears'
import Users from './pages/admin/Users'
import Settings from './pages/admin/Settings'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/register" element={<NewRegistration />} />
                <Route path="/student/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Protected Agent Routes */}
            <Route element={<ProtectedRoute allowedRoles={['agent', 'admin']} />}>
              <Route element={<AgentLayout />}>
                <Route path="/agent/dashboard" element={<AgentDashboard />} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/majors" element={<Majors />} />
                <Route path="/admin/academic-years" element={<AcademicYears />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
