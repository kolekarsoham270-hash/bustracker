
import React from 'react'
import {X, Clock, AlertTriangle, Info, CheckCircle} from 'lucide-react'
import { useBusStore } from '../store/busStore'
import { useLanguageStore } from '../store/languageStore'
import { formatDistanceToNow } from 'date-fns'

interface NotificationPanelProps {
  onClose: () => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationRead } = useBusStore()
  const { language } = useLanguageStore()

  const getIcon = (type: string) => {
    switch (type) {
      case 'arrival':
        return <Clock className="text-blue-500" size={20} />
      case 'delay':
        return <AlertTriangle className="text-yellow-500" size={20} />
      case 'service-alert':
        return <AlertTriangle className="text-red-500" size={20} />
      case 'route-update':
        return <Info className="text-green-500" size={20} />
      default:
        return <CheckCircle className="text-gray-500" size={20} />
    }
  }

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id)
  }

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {language === 'hi' ? notification.titleHi : notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === 'hi' ? notification.messageHi : notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
