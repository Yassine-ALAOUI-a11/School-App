import { Settings as SettingsIcon, Save, Database, Bell, Shield } from 'lucide-react'

export default function Settings() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <SettingsIcon className="h-8 w-8 text-indigo-600" />
                    System Settings
                </h1>
                <p className="text-gray-500 mt-1">Configure global application settings</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4 text-indigo-700">
                        <Database className="h-6 w-6" />
                        <h2 className="font-semibold text-lg">System Information</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-600">App Version</span>
                            <span className="font-medium">1.0.0</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-600">Framework</span>
                            <span className="font-medium">React + Vite</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-600">Backend</span>
                            <span className="font-medium">Supabase</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Status</span>
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">OPERATIONAL</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4 text-indigo-700">
                        <Shield className="h-6 w-6" />
                        <h2 className="font-semibold text-lg">Security Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Allow Registration</h3>
                                <p className="text-sm text-gray-500">Enable new student registrations</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                                <p className="text-sm text-gray-500">Disable access for all users except admins</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
