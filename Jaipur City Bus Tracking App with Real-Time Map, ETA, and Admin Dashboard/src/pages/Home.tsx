
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Search, MapPin, Clock, Heart, Accessibility, Zap, Shield, Users} from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '../store/languageStore'
import { useBusStore } from '../store/busStore'
import BusMap from '../components/BusMap'

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useLanguageStore()
  const { routes, buses, setUserLocation } = useBusStore()
  
  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
          // Default to Jaipur center
          setUserLocation({ lat: 26.9124, lng: 75.7873 })
        }
      )
    }
  }, [setUserLocation])

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.number.includes(searchQuery) ||
    route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeBuses = buses.filter(bus => bus.status !== 'cancelled')
  const onTimeBuses = buses.filter(bus => bus.status === 'on-time')

  const features = [
    {
      icon: MapPin,
      title: t('home.liveTracking'),
      description: 'Track buses in real-time on an interactive map',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: t('home.eta'),
      description: 'Get accurate arrival times for all stops',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: t('home.favorites'),
      description: 'Save your frequently used routes',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Accessibility,
      title: t('home.accessibility'),
      description: 'Information about wheelchair accessible buses',
      color: 'from-purple-500 to-violet-500'
    }
  ]

  const stats = [
    { label: 'Active Buses', value: activeBuses.length, icon: Zap },
    { label: 'On-Time Performance', value: `${Math.round((onTimeBuses.length / buses.length) * 100)}%`, icon: Shield },
    { label: 'Routes Available', value: routes.length, icon: MapPin },
    { label: 'Daily Passengers', value: '50K+', icon: Users }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {t('home.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 opacity-90"
          >
            {t('home.subtitle')}
          </motion.p>
          
          {/* Quick Search */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative max-w-md"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 shadow-lg border-0 focus:ring-4 focus:ring-white/30 transition-all"
            />
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center"
            >
              <Icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          )
        })}
      </motion.section>

      {/* Live Map Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Bus Tracking</h2>
          <p className="text-gray-600">Real-time positions of all active buses in Jaipur</p>
        </div>
        <BusMap height="500px" />
      </motion.section>

      {/* Search Results */}
      {searchQuery && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Search Results</h3>
          {filteredRoutes.length > 0 ? (
            <div className="grid gap-4">
              {filteredRoutes.slice(0, 5).map((route) => (
                <Link
                  key={route.id}
                  to={`/route/${route.id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.number}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{route.name}</h4>
                      <p className="text-sm text-gray-600">{route.origin} → {route.destination}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{route.fare}</p>
                    <p className="text-xs text-gray-500">{route.estimatedDuration} min</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No routes found matching your search.</p>
          )}
        </motion.section>
      )}

      {/* Features Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          )
        })}
      </motion.section>

      {/* Popular Routes */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Routes</h2>
          <Link to="/search" className="text-orange-600 hover:text-orange-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.slice(0, 3).map((route) => (
            <Link
              key={route.id}
              to={`/route/${route.id}`}
              className="group block p-6 border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: route.color }}
                >
                  {route.number}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {route.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{route.origin} → {route.destination}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>₹{route.fare}</span>
                <span>{route.estimatedDuration} min</span>
                <span>Every {route.frequency} min</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Home
