'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, addDays, addWeeks, addMonths, startOfWeek, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'

interface CalendarViewProps {
  view: 'month' | 'week' | 'day'
}

interface Event {
  id: string
  title: string
  time: string
  type: 'meeting' | 'event' | 'deadline' | 'personal'
  attendees?: number
  location?: string
  color: string
}

// Mock events data
const mockEvents: Record<string, Event[]> = {
  '2024-01-15': [
    {
      id: '1',
      title: 'Встреча с инвестором ABC Ventures',
      time: '10:00',
      type: 'meeting',
      attendees: 3,
      location: 'Офис ABC',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Питч на Demo Day',
      time: '14:00',
      type: 'event',
      attendees: 50,
      location: 'Технопарк',
      color: 'bg-green-500'
    }
  ],
  '2024-01-16': [
    {
      id: '3',
      title: 'Дедлайн по финансовой отчетности',
      time: '23:59',
      type: 'deadline',
      color: 'bg-red-500'
    }
  ],
  '2024-01-17': [
    {
      id: '4',
      title: 'Нетворкинг в RoundC',
      time: '18:00',
      type: 'event',
      attendees: 25,
      location: 'Коворкинг RoundC',
      color: 'bg-purple-500'
    }
  ]
}

export default function CalendarView({ view }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : addMonths(prev, -1))
    } else if (view === 'week') {
      setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : addWeeks(prev, -1))
    } else {
      setCurrentDate(prev => direction === 'next' ? addDays(prev, 1) : addDays(prev, -1))
    }
  }

  const getEventForDate = (date: Date): Event[] => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return mockEvents[dateKey] || []
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })

    const weeks = []
    let currentWeekStart = startDate

    for (let week = 0; week < 6; week++) {
      const days = []
      for (let day = 0; day < 7; day++) {
        const currentDay = addDays(currentWeekStart, day)
        const events = getEventForDate(currentDay)
        const isCurrentMonth = isSameMonth(currentDay, currentDate)
        const isToday = isSameDay(currentDay, new Date())

        days.push(
          <div
            key={day}
            className={`min-h-32 p-2 border border-gray-100 ${
              isCurrentMonth ? 'bg-white' : 'bg-gray-50'
            } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className={`text-sm mb-2 ${
              isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            } ${isToday ? 'font-bold text-blue-600' : ''}`}>
              {format(currentDay, 'd')}
            </div>
            <div className="space-y-1">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`p-1 rounded text-xs text-white truncate ${event.color} cursor-pointer hover:opacity-80`}
                  title={event.title}
                >
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="truncate">{event.title}</div>
                </div>
              ))}
              {events.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{events.length - 3} еще
                </div>
              )}
            </div>
          </div>
        )
      }
      weeks.push(
        <div key={week} className="grid grid-cols-7">
          {days}
        </div>
      )
      currentWeekStart = addDays(currentWeekStart, 7)
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 border-b">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="divide-y">
          {weeks}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const days = []

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i)
      const events = getEventForDate(day)
      const isToday = isSameDay(day, new Date())

      days.push(
        <div key={i} className="flex-1 border-r last:border-r-0">
          <div className={`p-3 text-center border-b ${
            isToday ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-gray-50'
          }`}>
            <div className="text-sm">{format(day, 'EEE', { locale: ru })}</div>
            <div className={`text-lg ${isToday ? 'text-blue-600' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
          <div className="p-2 space-y-2 min-h-96">
            {events.map((event) => (
              <Card key={event.id} className="p-2 cursor-pointer hover:shadow-md transition-shadow">
                <div className={`w-full p-2 rounded text-white text-sm ${event.color}`}>
                  <div className="flex items-center space-x-1 mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="font-medium mb-1">{event.title}</div>
                  {event.attendees && (
                    <div className="flex items-center space-x-1 text-xs opacity-90">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center space-x-1 text-xs opacity-90">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex">
          {days}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const events = getEventForDate(currentDate)
    const isToday = isSameDay(currentDate, new Date())

    return (
      <div className="bg-white rounded-lg shadow">
        <div className={`p-6 border-b ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {format(currentDate, 'dd MMMM yyyy, EEEE', { locale: ru })}
          </h2>
          {isToday && (
            <Badge variant="secondary" className="mt-2">Сегодня</Badge>
          )}
        </div>
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>На этот день событий не запланировано</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-4 h-16 rounded ${event.color}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{event.time}</span>
                          <Badge variant="outline">{
                            event.type === 'meeting' ? 'Встреча' :
                            event.type === 'event' ? 'Мероприятие' :
                            event.type === 'deadline' ? 'Дедлайн' : 'Личное'
                          }</Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {event.attendees && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees} участников</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {view === 'month' && format(currentDate, 'LLLL yyyy', { locale: ru })}
            {view === 'week' && `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'dd MMM', { locale: ru })} - ${format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), 'dd MMM yyyy', { locale: ru })}`}
            {view === 'day' && format(currentDate, 'dd MMMM yyyy', { locale: ru })}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
        >
          Сегодня
        </Button>
      </div>

      {/* Calendar Content */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  )
}
