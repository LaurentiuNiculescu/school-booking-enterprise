import { useState, useEffect } from 'react'
import { assetsApi } from '../../services/api'

const TYPES = ['Laptop', 'Projector', 'Tablet', 'Desktop', 'Camera', 'Other']
const STATUS_STYLE = {
  available: 'bg-green-100 text-green-800',
  checkedOut: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  lost: 'bg-red-100 text-red-800'
}

export default function AssetsTab() {
  const [assets, setAssets] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [checkoutAsset, setCheckoutAsset] = useState(null)
  const [form, setForm] = useState({ name: '', type: 'Laptop', serialNumber: '', location: '', notes: '' })
  const [checkoutName, setCheckoutName] = useState('')

  const load = () => {
    assetsApi.getAll().then(r => setAssets(r.data)).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = assets.filter(a => {
    const q = search.toLowerCase()
    return (a.name.toLowerCase().includes(q) || (a.serialNumber || '').toLowerCase().includes(q) || (a.type || '').toLowerCase().includes(q))
      && (filter === 'all' || a.status === filter)
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    try { await assetsApi.create(form); setShowAdd(false); setForm({ name: '', type: 'Laptop', serialNumber: '', location: '', notes: '' }); load() }
    catch { alert('Error adding asset') }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    try { await assetsApi.checkout(checkoutAsset.id, checkoutName); setCheckoutAsset(null); setCheckoutName(''); load() }
    catch { alert('Error checking out') }
  }

  if (loading) return <div className="text-slate-500">Loading assets...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-slate-500">Track and manage all school IT equipment</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg">
          + Add Asset
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, serial, type..."
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none">
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="checkedOut">Checked Out</option>
          <option value="maintenance">Maintenance</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Asset Name', 'Type', 'Serial Number', 'Status', 'Assigned To', 'Location', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-600 font-semibold text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">No assets found</td></tr>
            )}
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{a.name}</td>
                <td className="px-4 py-3 text-slate-600">{a.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.serialNumber || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[a.status] || ''}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{a.assignedTo || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{a.location || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    {a.status === 'available' && (
                      <button onClick={() => setCheckoutAsset(a)} className="text-blue-600 hover:underline text-xs font-medium">Check Out</button>
                    )}
                    {a.status === 'checkedOut' && (
                      <button onClick={() => assetsApi.checkin(a.id).then(load)} className="text-green-600 hover:underline text-xs font-medium">Check In</button>
                    )}
                    <button onClick={() => { if (confirm('Delete this asset?')) assetsApi.delete(a.id).then(load) }}
                      className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Asset Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Asset</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Asset Name *"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <input value={form.serialNumber} onChange={e => setForm({...form, serialNumber: e.target.value})} placeholder="Serial Number"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Location / Classroom"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Notes (optional)" rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Check Out Asset</h2>
            <p className="text-slate-500 text-sm mb-4">{checkoutAsset.name} · {checkoutAsset.type}</p>
            <form onSubmit={handleCheckout} className="space-y-4">
              <input required value={checkoutName} onChange={e => setCheckoutName(e.target.value)}
                placeholder="Assign to (teacher name / classroom) *"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setCheckoutAsset(null)} className="px-4 py-2 text-slate-600 text-sm">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Confirm Check Out</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
