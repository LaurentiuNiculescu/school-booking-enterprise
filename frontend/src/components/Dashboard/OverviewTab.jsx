import { useState, useEffect } from 'react'
import { dashboardApi } from '../../services/api'

function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value ?? '—'}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}

function StatusBar({ label, value, color, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value ?? 0}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full">
        <div className={`h-2 ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function OverviewTab() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-slate-500">Loading stats...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard Overview</h1>
      <p className="text-slate-500 mb-8">Real-time asset status across your institution</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Assets" value={stats?.totalAssets} color="text-slate-900" icon="💻" />
        <StatCard label="Checked Out" value={stats?.checkedOut} color="text-blue-600" icon="📤" />
        <StatCard label="Maintenance" value={stats?.underMaintenance} color="text-yellow-600" icon="🔧" />
        <StatCard label="Active Alerts" value={stats?.activeAlerts} color="text-red-600" icon="🚨" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-5">Asset Status Breakdown</h3>
          <div className="space-y-4">
            <StatusBar label="Available" value={stats?.available} color="bg-green-500" total={stats?.totalAssets} />
            <StatusBar label="Checked Out" value={stats?.checkedOut} color="bg-blue-500" total={stats?.totalAssets} />
            <StatusBar label="Maintenance" value={stats?.underMaintenance} color="bg-yellow-500" total={stats?.totalAssets} />
            <StatusBar label="Lost" value={stats?.lost} color="bg-red-500" total={stats?.totalAssets} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-5">Quick Actions</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <p>→ Use <strong>QR Scanner</strong> to check in/out equipment instantly</p>
            <p>→ Use <strong>Asset Management</strong> to add new hardware to inventory</p>
            <p>→ Use <strong>QR Generator</strong> to print labels for physical assets</p>
            {stats?.activeAlerts > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
                ⚠️ You have <strong>{stats.activeAlerts}</strong> unresolved alert{stats.activeAlerts > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
