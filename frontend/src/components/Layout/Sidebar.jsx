import { useAuth } from '../../context/AuthContext'

const NAV = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'assets', label: 'Asset Management', icon: '💻' },
  { id: 'qr-generate', label: 'QR Generator', icon: '🔲' },
  { id: 'qr-scan', label: 'QR Scanner', icon: '📷' },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, isSuperAdmin, logout } = useAuth()

  return (
    <aside className="w-64 bg-[#161c2d] flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-slate-700">
        <p className="text-white font-bold text-base">Alpha IT Solutions</p>
        <p className="text-slate-400 text-xs mt-0.5">School Booking Enterprise</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}

        {isSuperAdmin() && (
          <button onClick={() => setActiveTab('settings')}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium mt-4 border border-red-800 ${
              activeTab === 'settings'
                ? 'bg-red-700 text-white'
                : 'text-red-400 hover:bg-red-900/30'
            }`}>
            <span>⚙️</span>System Settings
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full text-slate-400 hover:text-white text-sm py-1.5 text-left transition-colors">
          → Sign out
        </button>
      </div>
    </aside>
  )
}
