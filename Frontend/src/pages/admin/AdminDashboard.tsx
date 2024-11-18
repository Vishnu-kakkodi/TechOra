import React from 'react'
import AdminSidebar from '../../components/sidebar/AdminSidebar'
import Dashboard from '../../layout/AdminLayout/Dashboard'

const AdminDashboard = () => {
  return (
    <div className='flex'>
        <AdminSidebar />
        <Dashboard />
    </div>
  )
}

export default AdminDashboard