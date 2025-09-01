
import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { Icon, LatLng } from 'leaflet'
import { useBusStore } from '../store/busStore'
import { useLanguageStore } from '../store/languageStore'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const busIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iNiIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEwIiByeD0iMiIgZmlsbD0iIzMzNzNkYyIvPgo8Y2lyY2xlIGN4PSI3IiBjeT0iMTciIHI9IjIiIGZpbGw9IiM2NjY2NjYiLz4KPGP2cmNsZSBjeD0iMTciIGN5PSIxNyIgcj0iMiIgZmlsbD0iIzY2NjY2NiIvPgo8cmVjdCB4PSI1IiB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSIzIiBmaWxsPSIjZmZmZmZmIi8+CjxyZWN0IHg9IjEwIiB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSIzIiBmaWxsPSIjZmZmZmZmIi8+CjxyZWN0IHg9IjE1IiB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSIzIiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

const stopIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGP2cmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iI2ZmOTgwMCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})

interface BusMapProps {
  selectedRoute?: string
  height?: string
}

const MapUpdater: React.FC<{ center: LatLng; zoom: number }> = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

const BusMap: React.FC<BusMapProps> = ({ selectedRoute, height = '400px' }) => {
  const { buses, routes, stops, userLocation } = useBusStore()
  const { language } = useLanguageStore()
  
  // Jaipur center coordinates
  const center = userLocation ? new LatLng(userLocation.lat, userLocation.lng) : new LatLng(26.9124, 75.7873)
  
  // Filter data based on selected route
  const filteredBuses = selectedRoute 
    ? buses.filter(bus => bus.routeNumber === selectedRoute)
    : buses
    
  const filteredStops = selectedRoute
    ? stops.filter(stop => stop.routes.includes(selectedRoute))
    : stops
    
  const selectedRouteData = selectedRoute 
    ? routes.find(route => route.number === selectedRoute)
    : null

  // Create route path
  const routePath = selectedRouteData?.stops.map(stop => [stop.lat, stop.lng]) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#10b981'
      case 'delayed': return '#f59e0b'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapUpdater center={center} zoom={13} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route path */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            color={selectedRouteData?.color || '#3b82f6'}
            weight={4}
            opacity={0.7}
          />
        )}
        
        {/* Bus markers */}
        {filteredBuses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.currentLat, bus.currentLng]}
            icon={busIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">Bus {bus.routeNumber}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span style={{ color: getStatusColor(bus.status) }}>
                      {bus.status === 'on-time' ? 'On Time' : 
                       bus.status === 'delayed' ? `Delayed ${bus.delay} min` : 
                       'Cancelled'}
                    </span>
                  </p>
                  <p><span className="font-medium">Occupancy:</span> {bus.occupancy}/{bus.capacity}</p>
                  <p><span className="font-medium">Accessible:</span> {bus.isAccessible ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-gray-500">
                    Last updated: {bus.lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Stop markers */}
        {filteredStops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={stopIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">
                  {language === 'hi' ? stop.nameHi : stop.name}
                </h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Routes:</span> {stop.routes.join(', ')}</p>
                  <p><span className="font-medium">Facilities:</span></p>
                  <ul className="list-disc list-inside text-xs">
                    {stop.facilities.map((facility, index) => (
                      <li key={index}>{facility}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default BusMap
