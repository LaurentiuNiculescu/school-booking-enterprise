import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { assetsApi } from '../../services/api'

export default function QRScanTab() {
  const [asset, setAsset] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [checkoutName, setCheckoutName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const scannerRef = useRef(null)

  const startScanner = () => {
    setScanning(true)
    setAsset(null)
    setError('')
    setMessage('')

    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false)
    scanner.render(
      async (code) => {
        try { scanner.clear() } catch {}
        setScanning(false)
        try {
          const res = await assetsApi.getByQr(code)
          setAsset(res.data)
        } catch {
          setError('No asset found for this QR code')
        }
      },
      () => {}
    )
    scannerRef.current = scanner
  }

  const stopScanner = () => {
    try { scannerRef.current?.clear() } catch {}
    setScanning(false)
  }

  useEffect(() => () => { try { scannerRef.current?.clear() } catch {} }, [])

  const handleCheckout = async () => {
    if (!checkoutName.trim()) return
    try {
      await assetsApi.checkout(asset.id, checkoutName)
      setMessage(`✅ ${asset.name} checked out to ${checkoutName}`)
      setAsset({ ...asset, status: 'checkedOut', assignedTo: checkoutName })
      setCheckoutName('')
    } catch { setError('Failed to check out asset') }
  }

  const handleCheckin = async () => {
    try {
      await assetsApi.checkin(asset.id)
      setMessage(`✅ ${asset.name} checked in successfully`)
      setAsset({ ...asset, status: 'available', assignedTo: null })
    } catch { setError('Failed to check in asset') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">QR Scanner</h1>
      <p className="text-slate-500 mb-8">Scan an asset's QR code to check it in or out instantly</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {!scanning ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-slate-600 mb-6">Point your camera at an asset's QR code to identify it instantly</p>
              <button onClick={startScanner}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">
                Start Camera Scanner
              </button>
            </div>
          ) : (
            <div>
              <div id="qr-reader" className="w-full" />
              <button onClick={stopScanner} className="mt-4 text-slate-500 hover:text-slate-700 text-sm underline">Cancel</button>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}

          {asset ? (
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-4">Asset Found</h2>
              <div className="space-y-2 mb-6">
                {[['Name', asset.name], ['Type', asset.type], ['Serial', asset.serialNumber || '—'],
                  ['Status', asset.status], ['Assigned To', asset.assignedTo || '—'], ['Location', asset.location || '—']
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">{label}</span>
                    <span className="font-medium text-slate-900 text-sm">{value}</span>
                  </div>
                ))}
              </div>

              {asset.status === 'available' && (
                <div className="space-y-3">
                  <input value={checkoutName} onChange={e => setCheckoutName(e.target.value)}
                    placeholder="Assign to (teacher name / classroom) *"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={handleCheckout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm">Check Out</button>
                </div>
              )}
              {asset.status === 'checkedOut' && (
                <button onClick={handleCheckin}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm">Check In</button>
              )}
              {['maintenance', 'lost'].includes(asset.status) && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 text-sm">
                  This asset is marked as <strong>{asset.status}</strong>. Update its status in Asset Management first.
                </div>
              )}

              <button onClick={() => { setAsset(null); setMessage(''); setError('') }}
                className="w-full mt-3 text-slate-500 hover:text-slate-700 text-sm border border-slate-200 rounded-lg py-2">
                Scan Another
              </button>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <div className="text-5xl mb-3">⬅️</div>
              <p className="text-sm">Scan a QR code to see the asset details here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
