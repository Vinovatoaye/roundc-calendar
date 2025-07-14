'use client'

import { Clock, Users, MapPin, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Event {
  id: string
  title: string
  date: string
  time: string
  type: 'meeting' | 'event' | 'deadline' | 'personal'
  attendees?: number
  location?: string
  color: string
  priority: 'high' | 'medium' | 'low'
}

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Встреча с инвестором ABC Ventures',
    date: 'Сегодня',
    time: '10:00',
    type: 'meeting',
    attendees: 3,
    location: 'Офис ABC',
    color: 'bg-blue-500',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Питч на Demo Day',
    date: 'Сегодня',
    time: '14:00',
    type: 'event',
    attendees: 50,
    location: 'Технопарк',
    color: 'bg-green-500',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Дедлайн по финансовой отчетности',
    date: 'Завтра',
    time: '23:59',
    type: 'deadline',
    color: 'bg-red-500',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Нетворкинг в RoundC',
    date: '17 янв',
    time: '18:00',
    type: 'event',
    attendees: 25,
    location: 'Коворкинг RoundC',
    color: 'bg-purple-500',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Обучение: Fundraising 101',
    date: '20 янв',
    time: '15:00',
    type: 'event',
    attendees: 15,
    location: 'Онлайн',
    color: 'bg-orange-500',
    priority: 'medium'
  }
]

export default function EventsList() {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'Встреча'
      case 'event': return 'Мероприятие'
      case 'deadline': return 'Дедлайн'
      case 'personal': return 'Личное'
      default: return 'Событие'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500'
      case 'medium': return 'border-yellow-500'
      case 'low': return 'border-green-500'
      default: return 'border-gray-300'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ближайшие события</CardTitle>
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className={`p-3 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors ${getPriorityColor(event.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(event.type)}
                </Badge>
              </div>
              <span className="text-xs text-gray-500">{event.date}</span>
            </div>

            <h4 className="font-medium text-sm mb-2 leading-tight">
              {event.title}
            </h4>

            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{event.time}</span>
              </div>

              {event.attendees && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  <span>{event.attendees} участников</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <Button variant="ghost" className="w-full text-sm" size="sm">
          Показать все события
        </Button>
      </CardContent>
    </Card>
  )
}
