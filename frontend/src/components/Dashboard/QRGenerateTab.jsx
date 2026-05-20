import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { assetsApi } from '../../services/api'

export default function QRGenerateTab() {
  const [assets, setAssets] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    assetsApi.getAll().then(r => setAssets(r.data)).catch(console.error)
  }, [])

  const filtered = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">QR Code Generator</h1>
      <p className="text-slate-500 mb-8">Select an asset to generate and print its unique QR label</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No assets found</p>}
            {filtered.map(a => (
              <button key={a.id} onClick={() => setSelected(a)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected?.id === a.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                <p className="font-medium text-slate-900 text-sm">{a.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{a.type} · QR: {a.qrCode}</p>
              </button>
            ))}
          </div>
        </div>

        {/* QR Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-80">
          {selected ? (
            <>
              <div className="bg-white p-4 border-2 border-slate-200 rounded-xl mb-5">
                <QRCodeSVG value={selected.qrCode} size={200} level="H" includeMargin />
              </div>
              <p className="font-bold text-slate-900 text-xl text-center">{selected.name}</p>
              <p className="text-slate-500 text-sm mt-1">{selected.type}</p>
              {selected.serialNumber && <p className="text-slate-400 text-xs mt-0.5">S/N: {selected.serialNumber}</p>}
              <p className="text-slate-400 text-xs font-mono mt-1">{selected.qrCode}</p>
              <button onClick={() => window.print()}
                className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
                🖨️ Print QR Label
              </button>
            </>
          ) : (
            <div className="text-center text-slate-400">
              <div className="text-6xl mb-4">🔲</div>
              <p className="text-sm">Select an asset from the list to generate its QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
