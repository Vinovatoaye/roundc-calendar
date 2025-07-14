'use client'

import { useState } from 'react'
import { X, Bell, Clock, Users, Calendar, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface NotificationsPanelProps {
  onClose: () => void
}

interface Notification {
  id: string
  type: 'reminder' | 'invitation' | 'update' | 'event'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Встреча через 15 минут',
    message: 'Встреча с инвестором ABC Ventures начнется в 10:00',
    time: '2 мин назад',
    read: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '2',
    type: 'invitation',
    title: 'Новое приглашение',
    message: 'Иван Петров приглашает вас на питч-сессию завтра в 14:00',
    time: '1 час назад',
    read: false,
    priority: 'medium',
    actionRequired: true
  },
  {
    id: '3',
    type: 'event',
    title: 'Новое мероприятие RoundC',
    message: 'Доступно для регистрации: "Fundraising для B2B стартапов"',
    time: '3 часа назад',
    read: false,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'update',
    title: 'Изменение в расписании',
    message: 'Время встречи с инвестором перенесено на 15:00',
    time: '1 день назад',
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Дедлайн завтра',
    message: 'Не забудьте подготовить финансовую отчетность',
    time: '1 день назад',
    read: true,
    priority: 'high'
  }
]

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="w-4 h-4" />
      case 'invitation': return <Users className="w-4 h-4" />
      case 'event': return <Calendar className="w-4 h-4" />
      case 'update': return <Info className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'text-orange-600 bg-orange-100'
      case 'invitation': return 'text-blue-600 bg-blue-100'
      case 'event': return 'text-green-600 bg-green-100'
      case 'update': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'important') return notif.priority === 'high' || notif.actionRequired
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
      <div className="w-96 h-full bg-white shadow-xl overflow-hidden">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Уведомления</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Все
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Непрочитанные
                </Button>
                <Button
                  variant={filter === 'important' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('important')}
                >
                  Важные
                </Button>
              </div>

              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Прочитать все
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-y-auto flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <Bell className="w-12 h-12 mb-4 text-gray-300" />
                <p>Нет уведомлений</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>

                          {notification.actionRequired && (
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" className="h-6 text-xs">
                                Отклонить
                              </Button>
                              <Button size="sm" className="h-6 text-xs">
                                Принять
                              </Button>
                            </div>
                          )}
                        </div>

                        {notification.priority === 'high' && (
                          <div className="flex items-center space-x-1 mt-2">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600">Высокий приоритет</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <div className="border-t p-4">
            <Button variant="ghost" className="w-full" size="sm">
              Настройки уведомлений
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
