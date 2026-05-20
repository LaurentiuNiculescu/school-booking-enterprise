import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Layout/Sidebar'
import OverviewTab from '../components/Dashboard/OverviewTab'
import AssetsTab from '../components/Dashboard/AssetsTab'
import QRGenerateTab from '../components/Dashboard/QRGenerateTab'
import QRScanTab from '../components/Dashboard/QRScanTab'
import SystemSettingsTab from '../components/Dashboard/SystemSettingsTab'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { isSuperAdmin } = useAuth()

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />
      case 'assets': return <AssetsTab />
      case 'qr-generate': return <QRGenerateTab />
      case 'qr-scan': return <QRScanTab />
      case 'settings': return isSuperAdmin() ? <SystemSettingsTab /> : <OverviewTab />
      default: return <OverviewTab />
    }
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{renderTab()}</div>
      </main>
    </div>
  )
}
