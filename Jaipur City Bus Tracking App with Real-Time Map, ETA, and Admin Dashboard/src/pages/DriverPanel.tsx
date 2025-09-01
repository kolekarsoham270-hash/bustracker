
import React, { useState, useEffect } from 'react'
import {MapPin, Clock, Users, AlertTriangle, CheckCircle, Navigation, Wifi} from 'lucide-react'
import { motion } from 'framer-motion'
import { useBusStore } from '../store/busStore'

const DriverPanel: React.FC = () => {
  const [driverId] = useState('driver-1') // In real app, this would come from auth
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [reportedDelay, setReportedDelay] = useState(0)
  const [issueReport, setIssueReport] = useState('')
  
  const { buses, updateBusLocation, updateBusStatus, addNotification } = useBusStore()
  
  // Find driver's assigned bus
  const assignedBus = buses.find(bus => bus.driverId === driverId)

  useEffect(() => {
    // Simulate GPS tracking
    const interval = setInterval(() => {
      if (navigator.geolocation && isOnline) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            setCurrentLocation(newLocation)
            
            // Update bus location if assigned
            if (assignedBus) {
              updateBusLocation(assignedBus.id, newLocation.lat, newLocation.lng)
            }
          },
          (error) => {
            console.log('GPS error:', error)
            // Use mock location for demo
            const mockLat = 26.9124 + (Math.random() - 0.5) * 0.01
            const mockLng = 75.7873 + (Math.random() - 0.5) * 0.01
            const mockLocation = { lat: mockLat, lng: mockLng }
            setCurrentLocation(mockLocation)
            
            if (assignedBus) {
              updateBusLocation(assignedBus.id, mockLocation.lat, mockLocation.lng)
            }
          }
        )
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [isOnline, assignedBus, updateBusLocation])

  const handleStatusUpdate = (status: 'on-time' | 'delayed' | 'cancelled') => {
    if (assignedBus) {
      updateBusStatus(assignedBus.id, status, status === 'delayed' ? reportedDelay : 0)
      
      // Send notification
      addNotification({
        type: status === 'delayed' ? 'delay' : 'service-alert',
        title: `Bus ${assignedBus.routeNumber} Status Update`,
        titleHi: `बस ${assignedBus.routeNumber} स्थिति अपडेट`,
        message: `Status changed to ${status}${status === 'delayed' ? ` (${reportedDelay} min delay)` : ''}`,
        messageHi: `स्थिति बदलकर ${status} हो गई${status === 'delayed' ? ` (${reportedDelay} मिनट देरी)` : ''}`,
        timestamp: new Date(),
        read: false
      })
    }
  }

  const handleIssueReport = () => {
    if (issueReport.trim() && assignedBus) {
      addNotification({
        type: 'service-alert',
        title: `Issue Reported - Bus ${assignedBus.routeNumber}`,
        titleHi: `समस्या रिपोर्ट - बस ${assignedBus.routeNumber}`,
        message: issueReport,
        messageHi: issueReport,
        timestamp: new Date(),
        read: false
      })
      setIssueReport('')
    }
  }

  if (!assignedBus) {
    return (
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
        >
          <AlertTriangle size={64} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Bus Assigned</h2>
          <p className="text-gray-600">
            You are not currently assigned to any bus. Please contact your supervisor.
          </p>
        </motion.div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Panel</h1>
            <p className="text-gray-600">Bus {assignedBus.routeNumber} - Route Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <Wifi size={18} />
              <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isOnline 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bus Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Bus Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-gray-600">Route</p>
            <p className="text-lg font-bold text-gray-900">{assignedBus.routeNumber}</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="text-green-600" size={24} />
            </div>
            <p className="text-sm text-gray-600">Occupancy</p>
            <p className="text-lg font-bold text-gray-900">{assignedBus.occupancy}/{assignedBus.capacity}</p>
          </div>
          
          <div className="text-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
              assignedBus.status === 'on-time' ? 'bg-green-100' :
              assignedBus.status === 'delayed' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Clock className={
                assignedBus.status === 'on-time' ? 'text-green-600' :
                assignedBus.status === 'delayed' ? 'text-yellow-600' :
                'text-red-600'
              } size={24} />
            </div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-bold text-gray-900">
              {assignedBus.status === 'on-time' ? 'On Time' :
               assignedBus.status === 'delayed' ? `${assignedBus.delay}m Delay` :
               'Cancelled'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Navigation className="text-purple-600" size={24} />
            </div>
            <p className="text-sm text-gray-600">GPS</p>
            <p className="text-lg font-bold text-gray-900">
              {currentLocation ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        {currentLocation && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Current Location:</p>
            <p className="font-mono text-sm">
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        )}
      </motion.div>

      {/* Status Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleStatusUpdate('on-time')}
            className="flex items-center justify-center space-x-2 p-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
          >
            <CheckCircle size={20} />
            <span className="font-medium">Mark On Time</span>
          </button>
          
          <button
            onClick={() => handleStatusUpdate('delayed')}
            className="flex items-center justify-center space-x-2 p-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <Clock size={20} />
            <span className="font-medium">Report Delay</span>
          </button>
          
          <button
            onClick={() => handleStatusUpdate('cancelled')}
            className="flex items-center justify-center space-x-2 p-4 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
          >
            <AlertTriangle size={20} />
            <span className="font-medium">Cancel Service</span>
          </button>
        </div>

        {/* Delay Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delay Duration (minutes)
          </label>
          <input
            type="number"
            value={reportedDelay}
            onChange={(e) => setReportedDelay(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter delay in minutes"
            min="0"
            max="120"
          />
        </div>

        {/* Issue Reporting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Issue or Incident
          </label>
          <div className="flex space-x-3">
            <textarea
              value={issueReport}
              onChange={(e) => setIssueReport(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Describe any issues, mechanical problems, or incidents..."
              rows={3}
            />
            <button
              onClick={handleIssueReport}
              disabled={!issueReport.trim()}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
            <MapPin className="mx-auto mb-2" size={24} />
            <span className="block text-sm font-medium">Update Location</span>
          </button>
          
          <button className="p-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
            <Users className="mx-auto mb-2" size={24} />
            <span className="block text-sm font-medium">Update Capacity</span>
          </button>
          
          <button className="p-4 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors">
            <Navigation className="mx-auto mb-2" size={24} />
            <span className="block text-sm font-medium">Emergency Stop</span>
          </button>
          
          <button className="p-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
            <AlertTriangle className="mx-auto mb-2" size={24} />
            <span className="block text-sm font-medium">Contact Control</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DriverPanel
