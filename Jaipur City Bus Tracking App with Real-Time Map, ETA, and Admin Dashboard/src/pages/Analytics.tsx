
import React, { useState } from 'react'
import {BarChart3, TrendingUp, Users, Clock, MapPin, Calendar} from 'lucide-react'
import { motion } from 'framer-motion'
import { useBusStore } from '../store/busStore'

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week')
  const { routes, buses } = useBusStore()

  // Mock analytics data - in real app this would come from API
  const analyticsData = {
    today: {
      totalPassengers: 12543,
      totalTrips: 324,
      onTimePerformance: 87,
      avgOccupancy: 68,
      peakHours: ['08:00-09:00', '17:00-18:00'],
      popularRoutes: ['101', '102', '201']
    },
    week: {
      totalPassengers: 89432,
      totalTrips: 2156,
      onTimePerformance: 84,
      avgOccupancy: 71,
      peakHours: ['08:00-09:00', '17:00-18:00'],
      popularRoutes: ['101', '102', '201']
    },
    month: {
      totalPassengers: 387651,
      totalTrips: 9234,
      onTimePerformance: 82,
      avgOccupancy: 73,
      peakHours: ['08:00-09:00', '17:00-18:00'],
      popularRoutes: ['101', '102', '201']
    }
  }

  const currentData = analyticsData[timeRange]

  const routePerformance = routes.map(route => {
    const routeBuses = buses.filter(bus => bus.routeNumber === route.number)
    const onTimeBuses = routeBuses.filter(bus => bus.status === 'on-time')
    const avgOccupancy = routeBuses.length > 0 
      ? Math.round(routeBuses.reduce((sum, bus) => sum + (bus.occupancy / bus.capacity * 100), 0) / routeBuses.length)
      : 0
    
    return {
      ...route,
      onTimePerformance: routeBuses.length > 0 ? Math.round((onTimeBuses.length / routeBuses.length) * 100) : 0,
      avgOccupancy,
      dailyPassengers: Math.floor(Math.random() * 2000) + 500 // Mock data
    }
  })

  const timeRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Jaipur Transport Authority - System Insights</p>
          </div>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Passengers</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.totalPassengers.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.totalTrips.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-green-600 font-medium">+8.2%</span>
            <span className="text-gray-500">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">On-Time Performance</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.onTimePerformance}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-green-600 font-medium">+3.1%</span>
            <span className="text-gray-500">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.avgOccupancy}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-green-600 font-medium">+5.7%</span>
            <span className="text-gray-500">vs last {timeRange}</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Passenger Trends */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Passenger Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Chart visualization would appear here</p>
              <p className="text-sm text-gray-400">Showing passenger count over time</p>
            </div>
          </div>
        </motion.div>

        {/* Route Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Hours Analysis</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Clock size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Peak hours visualization</p>
              <div className="mt-4 space-y-2">
                {currentData.peakHours.map((hour, index) => (
                  <div key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    {hour}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Route Performance Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Route Performance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Route</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Daily Passengers</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">On-Time %</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg. Occupancy</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {routePerformance.map((route) => (
                <tr key={route.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: route.color }}
                      >
                        {route.number}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{route.name}</p>
                        <p className="text-sm text-gray-500">{route.origin} → {route.destination}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">{route.dailyPassengers.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      route.onTimePerformance >= 90 ? 'text-green-600' :
                      route.onTimePerformance >= 80 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {route.onTimePerformance}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${route.avgOccupancy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{route.avgOccupancy}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">
                      ₹{(route.dailyPassengers * route.fare).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      route.onTimePerformance >= 90 ? 'bg-green-100 text-green-800' :
                      route.onTimePerformance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {route.onTimePerformance >= 90 ? 'Excellent' :
                       route.onTimePerformance >= 80 ? 'Good' :
                       'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Most Popular Route</h4>
            <p className="text-blue-100">Route {currentData.popularRoutes[0]} leads with highest passenger count</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Peak Performance</h4>
            <p className="text-blue-100">Morning rush hour shows 95% capacity utilization</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Improvement Areas</h4>
            <p className="text-blue-100">Evening services need frequency optimization</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics
