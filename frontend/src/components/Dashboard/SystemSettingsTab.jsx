import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'

export default function SystemSettingsTab() {
  const [schools, setSchools] = useState([])
  const [users, setUsers] = useState([])
  const [section, setSection] = useState('schools')
  const [schoolForm, setSchoolForm] = useState({ name: '', location: '', contactEmail: '' })
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'Admin', schoolId: '' })
  const [msg, setMsg] = useState('')

  const load = async () => {
    const [s, u] = await Promise.all([adminApi.getSchools(), adminApi.getUsers()])
    setSchools(s.data)
    setUsers(u.data)
  }
  useEffect(() => { load() }, [])

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const handleAddSchool = async (e) => {
    e.preventDefault()
    await adminApi.createSchool(schoolForm)
    setSchoolForm({ name: '', location: '', contactEmail: '' })
    flash('School added successfully')
    load()
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    await adminApi.createUser(userForm)
    setUserForm({ name: '', email: '', password: '', role: 'Admin', schoolId: '' })
    flash('User created successfully')
    load()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">⚙️</div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Godmode — System Settings</h1>
          <p className="text-red-500 text-sm font-semibold">Super Admin Access Only</p>
        </div>
      </div>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-6 text-sm">{msg}</div>}

      <div className="flex gap-2 mb-6">
        {[['schools', '🏫 Schools'], ['users', '👥 Users']].map(([id, label]) => (
          <button key={id} onClick={() => setSection(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              section === id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>{label}</button>
        ))}
      </div>

      {section === 'schools' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Add New School</h2>
            <form onSubmit={handleAddSchool} className="space-y-3">
              <input required value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name: e.target.value})}
                placeholder="School Name *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input value={schoolForm.location} onChange={e => setSchoolForm({...schoolForm, location: e.target.value})}
                placeholder="Location" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" value={schoolForm.contactEmail} onChange={e => setSchoolForm({...schoolForm, contactEmail: e.target.value})}
                placeholder="Contact Email" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold">Add School</button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">All Schools ({schools.length})</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {schools.length === 0 && <p className="text-slate-400 text-sm">No schools added yet</p>}
              {schools.map(s => (
                <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div><p className="font-medium text-slate-900 text-sm">{s.name}</p><p className="text-slate-500 text-xs">{s.location}</p></div>
                  <span className="text-green-600 text-xs font-medium">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Create New User</h2>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})}
                placeholder="Full Name *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})}
                placeholder="Email *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input required type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})}
                placeholder="Password *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">Super Admin</option>
              </select>
              <select value={userForm.schoolId} onChange={e => setUserForm({...userForm, schoolId: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="">No School (Super Admin)</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold">Create User</button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">All Users ({users.length})</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {users.length === 0 && <p className="text-slate-400 text-sm">No users yet</p>}
              {users.map(u => (
                <div key={u.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-slate-900 text-sm">{u.name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.role === 'SuperAdmin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-2">{u.email} · {u.isActive ? 'Active' : 'Inactive'}</p>
                  <div className="flex gap-3">
                    <button onClick={() => adminApi.resetUser(u.id).then(() => flash('User reset'))} className="text-xs text-blue-600 hover:underline">Reset</button>
                    <button onClick={() => adminApi.toggleUser(u.id, !u.isActive).then(load)}
                      className={`text-xs hover:underline ${u.isActive ? 'text-red-500' : 'text-green-600'}`}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
