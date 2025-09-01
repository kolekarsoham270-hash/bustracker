
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import BusSearch from './pages/BusSearch'
import RouteDetails from './pages/RouteDetails'
import Favorites from './pages/Favorites'
import AdminDashboard from './pages/AdminDashboard'
import DriverPanel from './pages/DriverPanel'
import Analytics from './pages/Analytics'
import { useLanguageStore } from './store/languageStore'

function App() {
  const { language } = useLanguageStore()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50" dir={language === 'hi' ? 'rtl' : 'ltr'}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<BusSearch />} />
            <Route path="/route/:routeId" element={<RouteDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/driver" element={<DriverPanel />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
