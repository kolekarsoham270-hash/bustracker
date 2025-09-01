
import { create } from 'zustand'

export interface BusStop {
  id: string
  name: string
  nameHi: string
  lat: number
  lng: number
  routes: string[]
  facilities: string[]
}

export interface Bus {
  id: string
  routeNumber: string
  currentLat: number
  currentLng: number
  status: 'on-time' | 'delayed' | 'cancelled'
  delay: number
  capacity: number
  occupancy: number
  isAccessible: boolean
  driverId?: string
  lastUpdated: Date
}

export interface Route {
  id: string
  number: string
  name: string
  nameHi: string
  origin: string
  destination: string
  stops: BusStop[]
  color: string
  fare: number
  distance: number
  estimatedDuration: number
  frequency: number
  operatingHours: {
    start: string
    end: string
  }
}

export interface Notification {
  id: string
  type: 'arrival' | 'delay' | 'service-alert' | 'route-update'
  title: string
  titleHi: string
  message: string
  messageHi: string
  timestamp: Date
  read: boolean
}

interface BusStore {
  buses: Bus[]
  routes: Route[]
  stops: BusStop[]
  favorites: string[]
  notifications: Notification[]
  userLocation: { lat: number; lng: number } | null
  selectedRoute: string | null
  
  // Actions
  setBuses: (buses: Bus[]) => void
  setRoutes: (routes: Route[]) => void
  setStops: (stops: BusStop[]) => void
  addFavorite: (routeId: string) => void
  removeFavorite: (routeId: string) => void
  setUserLocation: (location: { lat: number; lng: number }) => void
  setSelectedRoute: (routeId: string | null) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  markNotificationRead: (id: string) => void
  updateBusLocation: (busId: string, lat: number, lng: number) => void
  updateBusStatus: (busId: string, status: Bus['status'], delay?: number) => void
}

export const useBusStore = create<BusStore>((set, get) => ({
  buses: [
    {
      id: 'bus-1',
      routeNumber: '101',
      currentLat: 26.9124,
      currentLng: 75.7873,
      status: 'on-time',
      delay: 0,
      capacity: 40,
      occupancy: 25,
      isAccessible: true,
      driverId: 'driver-1',
      lastUpdated: new Date()
    },
    {
      id: 'bus-2',
      routeNumber: '102',
      currentLat: 26.9200,
      currentLng: 75.8000,
      status: 'delayed',
      delay: 5,
      capacity: 35,
      occupancy: 30,
      isAccessible: false,
      driverId: 'driver-2',
      lastUpdated: new Date()
    },
    {
      id: 'bus-3',
      routeNumber: '201',
      currentLat: 26.8900,
      currentLng: 75.8200,
      status: 'on-time',
      delay: 0,
      capacity: 45,
      occupancy: 15,
      isAccessible: true,
      driverId: 'driver-3',
      lastUpdated: new Date()
    }
  ],
  
  routes: [
    {
      id: 'route-101',
      number: '101',
      name: 'Pink City Express',
      nameHi: 'पिंक सिटी एक्सप्रेस',
      origin: 'Jaipur Railway Station',
      destination: 'Amber Fort',
      stops: [],
      color: '#e91e63',
      fare: 15,
      distance: 12.5,
      estimatedDuration: 45,
      frequency: 15,
      operatingHours: { start: '06:00', end: '22:00' }
    },
    {
      id: 'route-102',
      number: '102',
      name: 'City Palace Route',
      nameHi: 'सिटी पैलेस मार्ग',
      origin: 'Sindhi Camp',
      destination: 'City Palace',
      stops: [],
      color: '#2196f3',
      fare: 12,
      distance: 8.2,
      estimatedDuration: 30,
      frequency: 20,
      operatingHours: { start: '06:30', end: '21:30' }
    },
    {
      id: 'route-201',
      number: '201',
      name: 'Airport Connector',
      nameHi: 'एयरपोर्ट कनेक्टर',
      origin: 'Jaipur Airport',
      destination: 'MI Road',
      stops: [],
      color: '#ff9800',
      fare: 25,
      distance: 15.8,
      estimatedDuration: 50,
      frequency: 30,
      operatingHours: { start: '05:00', end: '23:00' }
    }
  ],
  
  stops: [
    {
      id: 'stop-1',
      name: 'Jaipur Railway Station',
      nameHi: 'जयपुर रेलवे स्टेशन',
      lat: 26.9124,
      lng: 75.7873,
      routes: ['101', '102'],
      facilities: ['shelter', 'seating', 'wheelchair-access']
    },
    {
      id: 'stop-2',
      name: 'Hawa Mahal',
      nameHi: 'हवा महल',
      lat: 26.9239,
      lng: 75.8267,
      routes: ['101', '102'],
      facilities: ['shelter', 'seating']
    },
    {
      id: 'stop-3',
      name: 'City Palace',
      nameHi: 'सिटी पैलेस',
      lat: 26.9255,
      lng: 75.8235,
      routes: ['102'],
      facilities: ['shelter', 'seating', 'restroom']
    },
    {
      id: 'stop-4',
      name: 'Amber Fort',
      nameHi: 'आमेर किला',
      lat: 26.9855,
      lng: 75.8513,
      routes: ['101'],
      facilities: ['shelter', 'seating', 'parking']
    },
    {
      id: 'stop-5',
      name: 'Jaipur Airport',
      nameHi: 'जयपुर एयरपोर्ट',
      lat: 26.8242,
      lng: 75.8122,
      routes: ['201'],
      facilities: ['shelter', 'seating', 'wheelchair-access', 'restroom']
    }
  ],
  
  favorites: [],
  notifications: [],
  userLocation: null,
  selectedRoute: null,
  
  setBuses: (buses) => set({ buses }),
  setRoutes: (routes) => set({ routes }),
  setStops: (stops) => set({ stops }),
  
  addFavorite: (routeId) => set((state) => ({
    favorites: [...state.favorites, routeId]
  })),
  
  removeFavorite: (routeId) => set((state) => ({
    favorites: state.favorites.filter(id => id !== routeId)
  })),
  
  setUserLocation: (location) => set({ userLocation: location }),
  setSelectedRoute: (routeId) => set({ selectedRoute: routeId }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [{
      ...notification,
      id: Date.now().toString(),
    }, ...state.notifications]
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  
  updateBusLocation: (busId, lat, lng) => set((state) => ({
    buses: state.buses.map(bus =>
      bus.id === busId
        ? { ...bus, currentLat: lat, currentLng: lng, lastUpdated: new Date() }
        : bus
    )
  })),
  
  updateBusStatus: (busId, status, delay = 0) => set((state) => ({
    buses: state.buses.map(bus =>
      bus.id === busId
        ? { ...bus, status, delay, lastUpdated: new Date() }
        : bus
    )
  }))
}))
