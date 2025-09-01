
import React, { useState } from 'react'
import {Bus, Route, Users, BarChart3, Plus, Edit, Trash2, AlertTriangle} from 'lucide-react'
import { motion } from 'framer-motion'
import { useBusStore } from '../store/busStore'
import { useLanguageStore } from '../store/languageStore'

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'buses' | 'drivers'>('overview')
  const { routes, buses, updateBusStatus } = useBusStore()
  const { t } = useLanguageStore()

  const activeBuses = buses.filter(bus => bus.status !== 'cancelled')
  const delayedBuses = buses.filter(bus => bus.status === 'delayed')
  const onTimeBuses = buses.filter(bus => bus.status === 'on-time')
  const onTimePercentage = buses.length > 0 ? Math.round((onTimeBuses.length / buses.length) * 100) : 0

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'routes', name: 'Routes', icon: Route },
    { id: 'buses', name: 'Buses', icon: Bus },
    { id: 'drivers', name: 'Drivers', icon: Users },
  ]

  const handleBusStatusUpdate = (busId: string, status: 'on-time' | 'delayed' | 'cancelled', delay = 0) => {
    updateBusStatus(busId, status, delay)
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bus className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-gray-900">{buses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Route className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delayed Buses</p>
              <p className="text-2xl font-bold text-gray-900">{delayedBuses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">On-Time Performance</p>
              <p className="text-2xl font-bold text-gray-900">{onTimePercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {delayedBuses.slice(0, 5).map((bus) => (
            <div key={bus.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-yellow-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Bus {bus.routeNumber} - {bus.id}</p>
                  <p className="text-sm text-gray-600">Delayed by {bus.delay} minutes</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBusStatusUpdate(bus.id, 'on-time')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Mark On Time
                </button>
                <button
                  onClick={() => handleBusStatusUpdate(bus.id, 'cancelled')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const RoutesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Route Management</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus size={18} />
          <span>Add Route</span>
        </button>
      </div>

      <div className="grid gap-4">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: route.color }}
                >
                  {route.number}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{route.name}</h4>
                  <p className="text-gray-600">{route.origin} → {route.destination}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                  <Edit size={18} />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Distance</p>
                <p className="font-semibold">{route.distance} km</p>
              </div>
              <div>
                <p className="text-gray-600">Fare</p>
                <p className="font-semibold">₹{route.fare}</p>
              </div>
              <div>
                <p className="text-gray-600">Frequency</p>
                <p className="font-semibold">{route.frequency} min</p>
              </div>
              <div>
                <p className="text-gray-600">Active Buses</p>
                <p className="font-semibold">{buses.filter(bus => bus.routeNumber === route.number && bus.status !== 'cancelled').length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const BusesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Bus Fleet Management</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus size={18} />
          <span>Add Bus</span>
        </button>
      </div>

      <div className="grid gap-4">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Bus className="text-gray-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Bus {bus.id}</h4>
                  <p className="text-gray-600">Route {bus.routeNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bus.status === 'on-time' ? 'bg-green-100 text-green-800' :
                  bus.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {bus.status === 'on-time' ? 'On Time' :
                   bus.status === 'delayed' ? `Delayed ${bus.delay}m` :
                   'Cancelled'}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Occupancy</p>
                <p className="font-semibold">{bus.occupancy}/{bus.capacity}</p>
              </div>
              <div>
                <p className="text-gray-600">Accessible</p>
                <p className="font-semibold">{bus.isAccessible ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Driver</p>
                <p className="font-semibold">{bus.driverId || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-gray-600">Last Update</p>
                <p className="font-semibold">{bus.lastUpdated.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const DriversTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Driver Management</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus size={18} />
          <span>Add Driver</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <p className="text-gray-600">Driver management features coming soon...</p>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />
      case 'routes': return <RoutesTab />
      case 'buses': return <BusesTab />
      case 'drivers': return <DriversTab />
      default: return <OverviewTab />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('admin.dashboard')}</h1>
        <p className="text-gray-600">Manage routes, buses, and monitor system performance</p>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}

export default AdminDashboard
