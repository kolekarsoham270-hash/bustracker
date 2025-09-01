
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {Search, Filter, MapPin, Clock, Users, Accessibility, Heart, Calculator} from 'lucide-react'
import { motion } from 'framer-motion'
import { useBusStore } from '../store/busStore'
import { useLanguageStore } from '../store/languageStore'

const BusSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrigin, setSelectedOrigin] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [showAccessibleOnly, setShowAccessibleOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'fare' | 'duration' | 'frequency'>('fare')
  const [showFareCalculator, setShowFareCalculator] = useState(false)
  
  const { routes, buses, stops, favorites, addFavorite, removeFavorite } = useBusStore()
  const { t } = useLanguageStore()

  // Get unique origins and destinations
  const origins = useMemo(() => {
    const uniqueOrigins = Array.from(new Set(routes.map(route => route.origin)))
    return uniqueOrigins.sort()
  }, [routes])

  const destinations = useMemo(() => {
    const uniqueDestinations = Array.from(new Set(routes.map(route => route.destination)))
    return uniqueDestinations.sort()
  }, [routes])

  // Filter and sort routes
  const filteredRoutes = useMemo(() => {
    let filtered = routes.filter(route => {
      const matchesSearch = 
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.number.includes(searchQuery) ||
        route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesOrigin = !selectedOrigin || route.origin === selectedOrigin
      const matchesDestination = !selectedDestination || route.destination === selectedDestination
      
      const matchesAccessibility = !showAccessibleOnly || 
        buses.some(bus => bus.routeNumber === route.number && bus.isAccessible)

      return matchesSearch && matchesOrigin && matchesDestination && matchesAccessibility
    })

    // Sort routes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'fare':
          return a.fare - b.fare
        case 'duration':
          return a.estimatedDuration - b.estimatedDuration
        case 'frequency':
          return a.frequency - b.frequency
        default:
          return 0
      }
    })

    return filtered
  }, [routes, searchQuery, selectedOrigin, selectedDestination, showAccessibleOnly, sortBy, buses])

  const getRouteStatus = (routeNumber: string) => {
    const routeBuses = buses.filter(bus => bus.routeNumber === routeNumber)
    if (routeBuses.length === 0) return 'No buses'
    
    const activeBuses = routeBuses.filter(bus => bus.status !== 'cancelled')
    const onTimeBuses = routeBuses.filter(bus => bus.status === 'on-time')
    
    if (activeBuses.length === 0) return 'Service suspended'
    
    const onTimePercentage = Math.round((onTimeBuses.length / activeBuses.length) * 100)
    return `${activeBuses.length} active • ${onTimePercentage}% on time`
  }

  const calculateFare = (distance: number, stages: number) => {
    // Basic fare calculation: ₹5 base + ₹2 per km + ₹1 per stage
    return Math.round(5 + (distance * 2) + stages)
  }

  const toggleFavorite = (routeId: string) => {
    if (favorites.includes(routeId)) {
      removeFavorite(routeId)
    } else {
      addFavorite(routeId)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.search')} Routes</h1>
        <p className="text-gray-600">Find the best bus routes for your journey in Jaipur</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-6"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by route number, name, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Any origin</option>
              {origins.map(origin => (
                <option key={origin} value={origin}>{origin}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Any destination</option>
              {destinations.map(destination => (
                <option key={destination} value={destination}>{destination}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'fare' | 'duration' | 'frequency')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="fare">Lowest fare</option>
              <option value="duration">Shortest duration</option>
              <option value="frequency">Most frequent</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={showAccessibleOnly}
                onChange={(e) => setShowAccessibleOnly(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <Accessibility size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">Accessible only</span>
            </label>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFareCalculator(!showFareCalculator)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <Calculator size={18} />
            <span>Fare Calculator</span>
          </button>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedOrigin('')
              setSelectedDestination('')
              setShowAccessibleOnly(false)
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={18} />
            <span>Clear Filters</span>
          </button>
        </div>

        {/* Fare Calculator */}
        {showFareCalculator && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-orange-50 rounded-lg p-4 border border-orange-200"
          >
            <h3 className="font-semibold text-orange-900 mb-3">Fare Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-1">Distance (km)</label>
                <input type="number" placeholder="10" className="w-full p-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-1">Number of stops</label>
                <input type="number" placeholder="5" className="w-full p-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
                  Calculate
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        {filteredRoutes.length > 0 ? (
          <div className="grid gap-6">
            {filteredRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{route.name}</h3>
                      <p className="text-gray-600">{route.origin} → {route.destination}</p>
                      <p className="text-sm text-gray-500">{getRouteStatus(route.number)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(route.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorites.includes(route.id)
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                      }`}
                    >
                      <Heart size={20} fill={favorites.includes(route.id) ? 'currentColor' : 'none'} />
                    </button>
                    <Link
                      to={`/route/${route.id}`}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <MapPin className="text-gray-400" size={20} />
                    <span className="text-sm text-gray-600">Distance</span>
                    <span className="font-semibold">{route.distance} km</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Clock className="text-gray-400" size={20} />
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-semibold">{route.estimatedDuration} min</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Users className="text-gray-400" size={20} />
                    <span className="text-sm text-gray-600">Frequency</span>
                    <span className="font-semibold">Every {route.frequency} min</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-2xl">₹</span>
                    <span className="text-sm text-gray-600">Fare</span>
                    <span className="font-semibold">₹{route.fare}</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Accessibility className="text-gray-400" size={20} />
                    <span className="text-sm text-gray-600">Accessible</span>
                    <span className="font-semibold">
                      {buses.some(bus => bus.routeNumber === route.number && bus.isAccessible) ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Operating: {route.operatingHours.start} - {route.operatingHours.end}</span>
                    <span>{route.stops.length} stops</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
          >
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedOrigin('')
                setSelectedDestination('')
                setShowAccessibleOnly(false)
              }}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default BusSearch
