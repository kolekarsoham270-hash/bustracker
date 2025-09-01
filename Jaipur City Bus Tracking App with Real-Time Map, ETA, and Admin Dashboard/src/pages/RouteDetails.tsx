
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {ArrowLeft, MapPin, Clock, Users, Accessibility, Heart, AlertTriangle, Navigation} from 'lucide-react'
import { motion } from 'framer-motion'
import { useBusStore } from '../store/busStore'
import { useLanguageStore } from '../store/languageStore'
import BusMap from '../components/BusMap'

const RouteDetails: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>()
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  const { routes, buses, stops, favorites, addFavorite, removeFavorite, addNotification } = useBusStore()
  const { t, language } = useLanguageStore()

  const route = routes.find(r => r.id === routeId)
  const routeBuses = buses.filter(bus => bus.routeNumber === route?.number)
  const routeStops = route ? stops.filter(stop => stop.routes.includes(route.number)) : []
  const isFavorite = route ? favorites.includes(route.id) : false

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (route) {
        // Check for buses arriving at stops
        routeBuses.forEach(bus => {
          routeStops.forEach(stop => {
            const distance = Math.sqrt(
              Math.pow(bus.currentLat - stop.lat, 2) + Math.pow(bus.currentLng - stop.lng, 2)
            )
            // If bus is within ~100m of stop (very rough calculation)
            if (distance < 0.001) {
              addNotification({
                type: 'arrival',
                title: 'Bus Arriving',
                titleHi: 'बस आ रही है',
                message: `Bus ${bus.routeNumber} is arriving at ${stop.name}`,
                messageHi: `बस ${bus.routeNumber} ${stop.nameHi} पर पहुंच रही है`,
                timestamp: new Date(),
                read: false
              })
            }
          })
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [route, routeBuses, routeStops, addNotification])

  if (!route) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Route not found</h2>
        <Link to="/search" className="text-orange-600 hover:text-orange-700">
          ← Back to search
        </Link>
      </div>
    )
  }

  const calculateETA = (stopId: string) => {
    // Simple ETA calculation based on nearest bus
    const stop = routeStops.find(s => s.id === stopId)
    if (!stop) return 'N/A'

    const nearestBus = routeBuses
      .filter(bus => bus.status !== 'cancelled')
      .reduce((nearest, bus) => {
        const distance = Math.sqrt(
          Math.pow(bus.currentLat - stop.lat, 2) + Math.pow(bus.currentLng - stop.lng, 2)
        )
        return !nearest || distance < nearest.distance 
          ? { bus, distance } 
          : nearest
      }, null as { bus: any; distance: number } | null)

    if (!nearestBus) return 'No buses'

    // Rough ETA calculation (distance * 60 km/h average speed)
    const eta = Math.round(nearestBus.distance * 111 * 60 / 30) // Convert to minutes
    return eta < 1 ? 'Arriving' : `${eta} min`
  }

  const getStopFacilities = (facilities: string[]) => {
    const facilityIcons: { [key: string]: string } = {
      'shelter': '🏠',
      'seating': '💺',
      'wheelchair-access': '♿',
      'restroom': '🚻',
      'parking': '🅿️'
    }
    return facilities.map(facility => facilityIcons[facility] || '•').join(' ')
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(route.id)
    } else {
      addFavorite(route.id)
    }
  }

  const activeBuses = routeBuses.filter(bus => bus.status !== 'cancelled')
  const onTimeBuses = routeBuses.filter(bus => bus.status === 'on-time')
  const onTimePercentage = routeBuses.length > 0 
    ? Math.round((onTimeBuses.length / routeBuses.length) * 100) 
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: route.color }}
            >
              {route.number}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'hi' ? route.nameHi : route.name}
              </h1>
              <p className="text-lg text-gray-600">{route.origin} → {route.destination}</p>
            </div>
          </div>
          
          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-pink-100 text-pink-600'
                : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
            }`}
          >
            <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm text-gray-600">Distance</p>
            <p className="text-xl font-bold text-gray-900">{route.distance} km</p>
          </div>
          <div className="text-center">
            <Clock className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-xl font-bold text-gray-900">{route.estimatedDuration} min</p>
          </div>
          <div className="text-center">
            <Users className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm text-gray-600">Frequency</p>
            <p className="text-xl font-bold text-gray-900">Every {route.frequency} min</p>
          </div>
          <div className="text-center">
            <span className="block text-3xl mb-2">₹</span>
            <p className="text-sm text-gray-600">Fare</p>
            <p className="text-xl font-bold text-gray-900">₹{route.fare}</p>
          </div>
          <div className="text-center">
            <Accessibility className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm text-gray-600">Accessible</p>
            <p className="text-xl font-bold text-gray-900">
              {routeBuses.some(bus => bus.isAccessible) ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Service Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeBuses.length}</div>
            <div className="text-sm text-gray-600">Active Buses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{onTimePercentage}%</div>
            <div className="text-sm text-gray-600">On Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{routeStops.length}</div>
            <div className="text-sm text-gray-600">Total Stops</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Operating Hours</div>
            <div className="font-semibold">{route.operatingHours.start} - {route.operatingHours.end}</div>
          </div>
        </div>
      </motion.div>

      {/* Live Map */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Live Tracking</h2>
          <p className="text-gray-600">Real-time positions of buses on this route</p>
        </div>
        <BusMap selectedRoute={route.number} height="500px" />
      </motion.div>

      {/* Bus Stops */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Bus Stops & ETAs</h2>
        <div className="space-y-4">
          {routeStops.map((stop, index) => {
            const eta = calculateETA(stop.id)
            const isSelected = selectedStop === stop.id
            
            return (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => setSelectedStop(isSelected ? null : stop.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === routeStops.length - 1 ? 'bg-red-500' : 
                        'bg-gray-400'
                      }`}></div>
                      {index < routeStops.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === 'hi' ? stop.nameHi : stop.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getStopFacilities(stop.facilities)} {stop.facilities.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      eta === 'Arriving' ? 'text-green-600' :
                      eta === 'No buses' ? 'text-gray-400' :
                      'text-blue-600'
                    }`}>
                      {eta}
                    </div>
                    <div className="text-xs text-gray-500">ETA</div>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-orange-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Facilities</h4>
                        <ul className="space-y-1 text-gray-600">
                          {stop.facilities.map((facility, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <span>{getStopFacilities([facility])}</span>
                              <span>{facility.replace('-', ' ')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Next Buses</h4>
                        <div className="space-y-1">
                          {routeBuses.slice(0, 3).map((bus, idx) => (
                            <div key={bus.id} className="flex justify-between text-gray-600">
                              <span>Bus {bus.routeNumber}</span>
                              <span className={
                                bus.status === 'on-time' ? 'text-green-600' :
                                bus.status === 'delayed' ? 'text-yellow-600' :
                                'text-red-600'
                              }>
                                {bus.status === 'delayed' ? `+${bus.delay} min` : bus.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Active Buses */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Buses</h2>
        {activeBuses.length > 0 ? (
          <div className="grid gap-4">
            {activeBuses.map((bus, index) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: route.color }}
                  >
                    {bus.routeNumber}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Bus {bus.id}</h3>
                    <p className="text-sm text-gray-600">
                      Occupancy: {bus.occupancy}/{bus.capacity} passengers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {bus.isAccessible && (
                    <Accessibility className="text-blue-600" size={20} />
                  )}
                  <div className="text-right">
                    <div className={`font-semibold ${
                      bus.status === 'on-time' ? 'text-green-600' :
                      bus.status === 'delayed' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {bus.status === 'on-time' ? 'On Time' :
                       bus.status === 'delayed' ? `Delayed ${bus.delay} min` :
                       'Cancelled'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated {bus.lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No active buses</h3>
            <p className="text-gray-600">All buses on this route are currently out of service</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default RouteDetails
