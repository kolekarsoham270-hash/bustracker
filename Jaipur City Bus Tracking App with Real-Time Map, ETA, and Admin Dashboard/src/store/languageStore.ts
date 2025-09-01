
import { create } from 'zustand'

export type Language = 'en' | 'hi'

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.favorites': 'Favorites',
    'nav.admin': 'Admin',
    
    // Home page
    'home.title': 'Jaipur Bus Tracker',
    'home.subtitle': 'Track your bus in real-time',
    'home.searchPlaceholder': 'Search routes, stops, or destinations...',
    'home.liveTracking': 'Live Tracking',
    'home.eta': 'Real-time ETA',
    'home.favorites': 'Save Favorites',
    'home.accessibility': 'Accessibility Info',
    
    // Bus status
    'status.onTime': 'On Time',
    'status.delayed': 'Delayed',
    'status.cancelled': 'Cancelled',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    
    // Route details
    'route.stops': 'Stops',
    'route.duration': 'Duration',
    'route.frequency': 'Frequency',
    'route.fare': 'Fare',
    'route.operating': 'Operating Hours',
    'route.addToFavorites': 'Add to Favorites',
    'route.removeFromFavorites': 'Remove from Favorites',
    
    // Notifications
    'notification.busArriving': 'Bus arriving in 5 minutes',
    'notification.serviceAlert': 'Service Alert',
    'notification.routeUpdate': 'Route Updated',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.routes': 'Manage Routes',
    'admin.buses': 'Manage Buses',
    'admin.drivers': 'Manage Drivers',
    'admin.analytics': 'Analytics',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.search': 'खोजें',
    'nav.favorites': 'पसंदीदा',
    'nav.admin': 'एडमिन',
    
    // Home page
    'home.title': 'जयपुर बस ट्रैकर',
    'home.subtitle': 'अपनी बस को रियल-टाइम में ट्रैक करें',
    'home.searchPlaceholder': 'रूट, स्टॉप या गंतव्य खोजें...',
    'home.liveTracking': 'लाइव ट्रैकिंग',
    'home.eta': 'रियल-टाइम ईटीए',
    'home.favorites': 'पसंदीदा सेव करें',
    'home.accessibility': 'पहुंच की जानकारी',
    
    // Bus status
    'status.onTime': 'समय पर',
    'status.delayed': 'देरी',
    'status.cancelled': 'रद्द',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.retry': 'पुनः प्रयास',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.add': 'जोड़ें',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.refresh': 'रिफ्रेश',
    
    // Route details
    'route.stops': 'स्टॉप्स',
    'route.duration': 'अवधि',
    'route.frequency': 'आवृत्ति',
    'route.fare': 'किराया',
    'route.operating': 'संचालन समय',
    'route.addToFavorites': 'पसंदीदा में जोड़ें',
    'route.removeFromFavorites': 'पसंदीदा से हटाएं',
    
    // Notifications
    'notification.busArriving': 'बस 5 मिनट में आ रही है',
    'notification.serviceAlert': 'सेवा अलर्ट',
    'notification.routeUpdate': 'रूट अपडेट',
    
    // Admin
    'admin.dashboard': 'एडमिन डैशबोर्ड',
    'admin.routes': 'रूट प्रबंधन',
    'admin.buses': 'बस प्रबंधन',
    'admin.drivers': 'ड्राइवर प्रबंधन',
    'admin.analytics': 'एनालिटिक्स',
  }
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  t: (key) => {
    const { language } = get()
    return translations[language][key as keyof typeof translations['en']] || key
  }
}))
