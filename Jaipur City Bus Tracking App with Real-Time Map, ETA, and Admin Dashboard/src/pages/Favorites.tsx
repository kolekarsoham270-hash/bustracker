
import React from 'react'
import { Link } from 'react-router-dom'
import {Heart, Clock, MapPin, Trash2, Star} from 'lucide-react'
import { motion } from 'framer-motion'
import { useBusStore } from '../store/busStore'
import { useLanguageStore } from '../store/languageStore'

const Favorites: React.FC = () => {
  const { routes, buses, favorites, removeFavorite } = useBusStore()
  const { t, language } = useLanguageStore()

  const favoriteRoutes = routes.filter(route => favorites.includes(route.id))

  const getRouteStatus = (routeNumber: string) => {
    const routeBuses = buses.filter(bus => bus.routeNumber === routeNumber && bus.status !== 'cancelled')
    return routeBuses.length > 0 ? 'Active' : 'No service'
  }

  const getNextBusETA = (routeNumber: string) => {
    const routeBuses = buses.filter(bus => bus.routeNumber === routeNumber && bus.status !== 'cancelled')
    if (routeBuses.length === 0) return 'N/A'
    
    // Simple ETA calculation
    const delays = routeBuses.map(bus => bus.delay)
    const avgDelay = delays.reduce((sum, delay) => sum + delay, 0) / delays.length
    
    return avgDelay > 0 ? `${Math.round(avgDelay)} min delay` : 'On time'
  }

  if (favoriteRoutes.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.favorites')}</h1>
          <p className="text-gray-600">Your saved routes for quick access</p>
        </motion.div>

        {/* Empty State */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
        >
          <Heart size={64} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No favorite routes yet</h2>
          <p className="text-gray-600 mb-8">
            Start adding your frequently used routes to access them quickly
          </p>
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Star size={20} />
            <span>Browse Routes</span>
          </Link>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.favorites')}</h1>
            <p className="text-gray-600">Your saved routes for quick access</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{favoriteRoutes.length}</div>
            <div className="text-sm text-gray-600">Saved Routes</div>
          </div>
        </div>
      </motion.div>

      {/* Favorite Routes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6"
      >
        {favoriteRoutes.map((route, index) => {
          const status = getRouteStatus(route.number)
          const eta = getNextBusETA(route.number)
          
          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
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
                    <h3 className="text-xl font-semibold text-gray-900">
                      {language === 'hi' ? route.nameHi : route.name}
                    </h3>
                    <p className="text-gray-600">{route.origin} → {route.destination}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </span>
                      <span className="text-sm text-gray-500">Next bus: {eta}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeFavorite(route.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 size={18} />
                  </button>
                  <Link
                    to={`/route/${route.id}`}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="text-gray-400" size={16} />
                  <div>
                    <p className="text-xs text-gray-600">Distance</p>
                    <p className="font-semibold">{route.distance} km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="text-gray-400" size={16} />
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-semibold">{route.estimatedDuration} min</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">₹</span>
                  <div>
                    <p className="text-xs text-gray-600">Fare</p>
                    <p className="font-semibold">₹{route.fare}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🚌</span>
                  <div>
                    <p className="text-xs text-gray-600">Frequency</p>
                    <p className="font-semibold">Every {route.frequency} min</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Operating: {route.operatingHours.start} - {route.operatingHours.end}
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/route/${route.id}#map`}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View on Map
                  </Link>
                  <Link
                    to={`/route/${route.id}#stops`}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    See Stops
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-6 text-white"
      >
        <h3 className="text-xl font-semibold mb-4">Your Travel Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{favoriteRoutes.length}</div>
            <div className="text-sm opacity-90">Favorite Routes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {favoriteRoutes.filter(route => getRouteStatus(route.number) === 'Active').length}
            </div>
            <div className="text-sm opacity-90">Currently Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              ₹{Math.round(favoriteRoutes.reduce((sum, route) => sum + route.fare, 0) / favoriteRoutes.length) || 0}
            </div>
            <div className="text-sm opacity-90">Avg. Fare</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(favoriteRoutes.reduce((sum, route) => sum + route.estimatedDuration, 0) / favoriteRoutes.length) || 0}m
            </div>
            <div className="text-sm opacity-90">Avg. Duration</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Favorites
