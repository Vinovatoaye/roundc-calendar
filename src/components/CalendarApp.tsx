'use client'

import { useState } from 'react'
import { Calendar, Clock, Plus, Settings, Bell, Users, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CalendarView from './CalendarView'
import EventsList from './EventsList'
import EventDialog from './EventDialog'
import NotificationsPanel from './NotificationsPanel'
import RoundCEvents from './RoundCEvents'
import NotesManager from './NotesManager'
import AnalyticsDashboard from './AnalyticsDashboard'

export default function CalendarApp() {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">RoundC Calendar</span>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Поиск событий, встреч, заметок..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>

              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>

              <Button
                onClick={() => setShowEventDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить событие
              </Button>

              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Сегодня</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Встреч</span>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Мероприятий</span>
                  <Badge variant="secondary">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Напоминаний</span>
                  <Badge variant="destructive">1</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Event Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Категории</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Встречи с инвесторами</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Питчи</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Нетворкинг</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Обучение</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Дедлайны</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <EventsList />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="calendar" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="calendar">Календарь</TabsTrigger>
                  <TabsTrigger value="events">Мероприятия RoundC</TabsTrigger>
                  <TabsTrigger value="notes">Заметки</TabsTrigger>
                  <TabsTrigger value="analytics">Аналитика</TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={currentView === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('day')}
                  >
                    День
                  </Button>
                  <Button
                    variant={currentView === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('week')}
                  >
                    Неделя
                  </Button>
                  <Button
                    variant={currentView === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('month')}
                  >
                    Месяц
                  </Button>
                </div>
              </div>

              <TabsContent value="calendar" className="space-y-4">
                <CalendarView view={currentView} />
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <RoundCEvents />
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <NotesManager />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EventDialog
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
      />

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  )
}
