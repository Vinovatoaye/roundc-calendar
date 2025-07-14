'use client'

import { useState } from 'react'
import { Settings, Calendar, Bell, Users, Link, Shield, Globe, Smartphone, Mail, Zap, Check, X, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  lastSync?: string
  features: string[]
  status: 'active' | 'error' | 'pending'
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  reminders: {
    meetings: boolean
    events: boolean
    deadlines: boolean
    followUps: boolean
  }
  timing: {
    beforeMeeting: string[]
    beforeEvent: string[]
    beforeDeadline: string[]
  }
}

const mockIntegrations: Integration[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Синхронизация с Google Calendar для автоматического импорта событий',
    icon: '📅',
    connected: true,
    lastSync: '2024-01-15T10:30:00Z',
    features: ['Двусторонняя синхронизация', 'Автоматические напоминания', 'Участники встреч'],
    status: 'active'
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Интеграция с Outlook Calendar и Exchange',
    icon: '📧',
    connected: false,
    features: ['Синхронизация календаря', 'Email напоминания', 'Teams интеграция'],
    status: 'pending'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Автоматическое создание Zoom ссылок для онлайн встреч',
    icon: '🎥',
    connected: true,
    lastSync: '2024-01-15T09:15:00Z',
    features: ['Автоссылки на встречи', 'Запись звонков', 'Участники'],
    status: 'active'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Уведомления о встречах и событиях в Slack каналах',
    icon: '💬',
    connected: true,
    lastSync: '2024-01-15T11:00:00Z',
    features: ['Уведомления в каналах', 'Статус в профиле', 'Напоминания команде'],
    status: 'active'
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    description: 'Персональные уведомления через Telegram бота',
    icon: '📱',
    connected: false,
    features: ['Мгновенные уведомления', 'Быстрые ответы', 'Управление через чат'],
    status: 'pending'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Синхронизация заметок и планов с Notion workspace',
    icon: '📝',
    connected: false,
    features: ['Синхронизация заметок', 'Шаблоны встреч', 'База контактов'],
    status: 'pending'
  }
]

export default function SettingsPanel() {
  const [integrations, setIntegrations] = useState(mockIntegrations)
  const [profile, setProfile] = useState({
    name: 'Алексей Фаундеров',
    email: 'alexey@startup.com',
    company: 'MyStartup',
    position: 'CEO & Founder',
    timezone: 'Europe/Moscow',
    language: 'ru',
    avatar: ''
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    reminders: {
      meetings: true,
      events: true,
      deadlines: true,
      followUps: true
    },
    timing: {
      beforeMeeting: ['15min', '1hour'],
      beforeEvent: ['1day', '1hour'],
      beforeDeadline: ['3days', '1day', '1hour']
    }
  })

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, connected: !integration.connected, lastSync: integration.connected ? undefined : new Date().toISOString() }
        : integration
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="w-4 h-4 text-green-500" />
      case 'error': return <X className="w-4 h-4 text-red-500" />
      case 'pending': return <Zap className="w-4 h-4 text-yellow-500" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile)
  }

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Настройки</h2>
          <p className="text-gray-600">Настройте интеграции, уведомления и персональные данные</p>
        </div>
        <Settings className="w-8 h-8 text-gray-400" />
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="privacy">Приватность</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Персональная информация</span>
              </CardTitle>
              <CardDescription>
                Обновите информацию о себе и своей компании
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-xl">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Изменить фото</Button>
                  <p className="text-sm text-gray-500 mt-2">Рекомендуемый размер: 400x400px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Полное имя</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Компания</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Должность</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Часовой пояс</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Europe/London">Лондон (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">Нью-Йорк (UTC-5)</SelectItem>
                      <SelectItem value="Asia/Singapore">Сингапур (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Язык</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile}>
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link className="w-5 h-5" />
                <span>Внешние интеграции</span>
              </CardTitle>
              <CardDescription>
                Подключите внешние сервисы для синхронизации и автоматизации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                        </Badge>
                        <Switch
                          checked={integration.connected}
                          onCheckedChange={() => toggleIntegration(integration.id)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Возможности:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {integration.connected && integration.lastSync && (
                      <div className="text-xs text-gray-500">
                        Последняя синхронизация: {new Date(integration.lastSync).toLocaleString('ru-RU')}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleIntegration(integration.id)}
                      >
                        {integration.connected ? 'Отключить' : 'Подключить'}
                      </Button>
                      {integration.connected && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Настройки уведомлений</span>
              </CardTitle>
              <CardDescription>
                Настройте способы и время получения уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Способы уведомлений</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Email уведомления</div>
                        <div className="text-sm text-gray-600">Получать уведомления на email</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Push уведомления</div>
                        <div className="text-sm text-gray-600">Уведомления в браузере</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">SMS уведомления</div>
                        <div className="text-sm text-gray-600">Срочные уведомления по SMS</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Типы событий</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Встречи и созвоны</span>
                    <Switch
                      checked={notifications.reminders.meetings}
                      onCheckedChange={(checked) => setNotifications(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, meetings: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Мероприятия RoundC</span>
                    <Switch
                      checked={notifications.reminders.events}
                      onCheckedChange={(checked) => setNotifications(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, events: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Дедлайны</span>
                    <Switch
                      checked={notifications.reminders.deadlines}
                      onCheckedChange={(checked) => setNotifications(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, deadlines: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Follow-up напоминания</span>
                    <Switch
                      checked={notifications.reminders.followUps}
                      onCheckedChange={(checked) => setNotifications(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, followUps: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Приватность и безопасность</span>
              </CardTitle>
              <CardDescription>
                Управляйте доступом к данным и настройками безопасности
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Публичный профиль</div>
                    <div className="text-sm text-gray-600">Разрешить другим видеть ваш профиль</div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Автоматический импорт событий</div>
                    <div className="text-sm text-gray-600">Импортировать события из внешних календарей</div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Аналитика использования</div>
                    <div className="text-sm text-gray-600">Помочь улучшить продукт анонимными данными</div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Экспорт данных</h3>
                <div className="space-y-2">
                  <Button variant="outline">Скачать архив данных</Button>
                  <p className="text-sm text-gray-600">
                    Получите копию всех ваших данных в формате JSON
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4 text-red-600">Удаление аккаунта</h3>
                <div className="space-y-2">
                  <Button variant="destructive">Удалить аккаунт</Button>
                  <p className="text-sm text-gray-600">
                    Это действие нельзя отменить. Все ваши данные будут удалены навсегда.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
