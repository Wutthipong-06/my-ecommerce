'use client'

import { useState, useEffect } from 'react'
import type { User, ApiResponse } from '@/types/user'
import Link from 'next/link'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'USER'
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  // ดึงข้อมูล users
  const fetchUsers = async (searchQuery = '') => {
    try {
      setLoading(true)
      const url = searchQuery
        ? `/api/users?search=${encodeURIComponent(searchQuery)}`
        : '/api/users'
      
      const response = await fetch(url)
      const result: ApiResponse<User[]> = await response.json()

      if (result.success && result.data) {
        setUsers(result.data)
      } else {
        setError(result.error || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้')
      }
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ค้นหา
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(search)
  }

  // สร้าง user ใหม่
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users', {
        // POST - ส่งข้อมูลเพื่อสร้าง user ใหม่
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      // POST - รับผลลัพธ์การสร้าง user ใหม่
      const result: ApiResponse<User> = await response.json()
      // ตรวจสอบผลลัพธ์ว่าสำเร็จหรือไม่ ถ้าไม่สำเร็จให้แสดงข้อความผิดพลาด
      if (result.success) {
        alert('สร้างผู้ใช้สำเร็จ!')
        setShowForm(false)
        setFormData({ email: '', name: '', password: '', role: 'USER' })
        fetchUsers(search)
      } else {
        alert(result.error || 'ไม่สามารถสร้างผู้ใช้ได้')
      }
    } catch (err) {
      alert('ไม่สามารถสร้างผู้ใช้ได้')
      console.error(err)
    }
  }

  // อัพเดท user
  const handleUpdate = async (id: string) => {
    const name = prompt('Enter new name:')
    if (!name) return
    // PUT - ส่งข้อมูลเพื่ออัพเดท user
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      // PUT - รับผลลัพธ์การอัพเดท user
      const result: ApiResponse<User> = await response.json()
      // ตรวจสอบผลลัพธ์ว่าสำเร็จหรือไม่ ถ้าไม่สำเร็จให้แสดงข้อความผิดพลาด
      if (result.success) {
        alert('อัพเดทผู้ใช้สำเร็จ!')
        fetchUsers(search)
      } else {
        alert(result.error || 'ไม่สามารถอัพเดทผู้ใช้ได้')
      }
    } catch (err) {
      alert('ไม่สามารถอัพเดทผู้ใช้ได้')
      console.error(err)
    }
  }

  // ลบ user
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    // DELETE - ส่งคำขอลบ user
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      // DELETE - รับผลลัพธ์การลบ user
      const result: ApiResponse<null> = await response.json()
      // ตรวจสอบผลลัพธ์ว่าสำเร็จหรือไม่ ถ้าไม่สำเร็จให้แสดงข้อความผิดพลาด
      if (result.success) {
        alert('ลบผู้ใช้สำเร็จ!')
        fetchUsers(search)
      } else {
        alert(result.error || 'ไม่สามารถลบผู้ใช้ได้')
      }
    } catch (err) {
      alert('ไม่สามารถลบผู้ใช้ได้')
      console.error(err)
    }
  }
  // แสดงผลหน้า UI Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-4xl font-bold mb-2">Users Management</h1>
        <p className="text-gray-600">Manage your users - CRUD operations demo</p>
        <Link href="/" className="text-blue-500 underline">
          กลับหน้าหลัก
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search และ Add Button */}
      <div className="flex gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                fetchUsers()
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </form>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {/* Form สร้าง User */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
          <h2 className="text-2xl font-bold mb-4">Create New User</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {/* ตาราง Users */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUpdate(user.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* สถิติ */}
      <div className="mt-6 text-center text-gray-600">
        Total: {users.length} user(s)
      </div>
    </div>
  )
}