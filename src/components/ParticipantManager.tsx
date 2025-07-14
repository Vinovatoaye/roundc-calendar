'use client'

import { useState } from 'react'
import { Users, Plus, Send, Clock, Check, X, AlertCircle, Mail, MessageSquare, Calendar, Star, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'organizer' | 'attendee' | 'speaker' | 'moderator'
  status: 'pending' | 'accepted' | 'declined' | 'tentative'
  company?: string
  position?: string
  linkedin?: string
  notes?: string
  addedAt: string
  respondedAt?: string
  lastInteraction?: string
  meetingHistory: number
  rating?: number
  tags: string[]
}

interface Invitation {
  id: string
  eventId: string
  eventTitle: string
  participantId: string
  participant: Participant
  sentAt: string
  status: 'sent' | 'delivered' | 'opened' | 'responded'
  remindersSent: number
  lastReminderAt?: string
  customMessage?: string
}

const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Алексей Петров',
    email: 'alexey@abcventures.com',
    role: 'attendee',
    status: 'accepted',
    company: 'ABC Ventures',
    position: 'Managing Partner',
    linkedin: 'linkedin.com/in/alexey-petrov',
    addedAt: '2024-01-10T10:00:00Z',
    respondedAt: '2024-01-10T14:30:00Z',
    lastInteraction: '2024-01-12T16:00:00Z',
    meetingHistory: 5,
    rating: 5,
    tags: ['investor', 'series-a', 'b2b']
  },
  {
    id: '2',
    name: 'Мария Иванова',
    email: 'maria@techstartup.io',
    role: 'speaker',
    status: 'pending',
    company: 'TechStartup',
    position: 'CEO & Founder',
    addedAt: '2024-01-12T09:00:00Z',
    meetingHistory: 2,
    rating: 4,
    tags: ['founder', 'tech', 'ai']
  },
  {
    id: '3',
    name: 'Дмитрий Сидоров',
    email: 'dmitry@xyzfund.ru',
    role: 'attendee',
    status: 'declined',
    company: 'XYZ Fund',
    position: 'Investment Director',
    addedAt: '2024-01-13T11:00:00Z',
    respondedAt: '2024-01-13T15:20:00Z',
    meetingHistory: 1,
    rating: 3,
    tags: ['investor', 'fintech']
  }
]

const mockInvitations: Invitation[] = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Встреча с инвестором ABC Ventures',
    participantId: '1',
    participant: mockParticipants[0],
    sentAt: '2024-01-10T10:00:00Z',
    status: 'responded',
    remindersSent: 1,
    lastReminderAt: '2024-01-14T09:00:00Z',
    customMessage: 'Привет Алексей! Было бы здорово обсудить наш продукт и возможности сотрудничества.'
  },
  {
    id: '2',
    eventId: '2',
    eventTitle: 'Питч на Demo Day',
    participantId: '2',
    participant: mockParticipants[1],
    sentAt: '2024-01-12T09:00:00Z',
    status: 'opened',
    remindersSent: 0
  }
]

export default function ParticipantManager() {
  const [participants, setParticipants] = useState(mockParticipants)
  const [invitations, setInvitations] = useState(mockInvitations)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const [inviteForm, setInviteForm] = useState({
    emails: '',
    message: '',
    role: 'attendee',
    sendReminder: true,
    reminderTime: '1day'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'tentative': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <Check className="w-4 h-4" />
      case 'declined': return <X className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'tentative': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      'organizer': 'Организатор',
      'attendee': 'Участник',
      'speaker': 'Спикер',
      'moderator': 'Модератор'
    }
    return labels[role as keyof typeof labels] || role
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      'pending': 'Ожидает',
      'accepted': 'Подтвердил',
      'declined': 'Отказался',
      'tentative': 'Возможно'
    }
    return labels[status as keyof typeof labels] || status
  }

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter
    const matchesRole = roleFilter === 'all' || participant.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleSendInvitations = () => {
    // Логика отправки приглашений
    console.log('Sending invitations:', inviteForm)
    setShowInviteDialog(false)
    setInviteForm({
      emails: '',
      message: '',
      role: 'attendee',
      sendReminder: true,
      reminderTime: '1day'
    })
  }

  const sendReminder = (participantId: string) => {
    console.log('Sending reminder to:', participantId)
  }

  const updateParticipantStatus = (participantId: string, newStatus: string) => {
    setParticipants(prev => prev.map(p =>
      p.id === participantId
        ? { ...p, status: newStatus as any, respondedAt: new Date().toISOString() }
        : p
    ))
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  const getStats = () => {
    const total = participants.length
    const accepted = participants.filter(p => p.status === 'accepted').length
    const pending = participants.filter(p => p.status === 'pending').length
    const declined = participants.filter(p => p.status === 'declined').length

    return { total, accepted, pending, declined }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление участниками</h2>
          <p className="text-gray-600">Приглашайте участников и отслеживайте их статус</p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Пригласить участников
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600">Всего участников</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Check className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.accepted}</div>
                <div className="text-sm text-gray-600">Подтвердили</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-gray-600">Ожидают</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <X className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{stats.declined}</div>
                <div className="text-sm text-gray-600">Отказались</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">Участники</TabsTrigger>
          <TabsTrigger value="invitations">Приглашения</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Поиск участников..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="pending">Ожидают</SelectItem>
                    <SelectItem value="accepted">Подтвердили</SelectItem>
                    <SelectItem value="declined">Отказались</SelectItem>
                    <SelectItem value="tentative">Возможно</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все роли</SelectItem>
                    <SelectItem value="organizer">Организатор</SelectItem>
                    <SelectItem value="attendee">Участник</SelectItem>
                    <SelectItem value="speaker">Спикер</SelectItem>
                    <SelectItem value="moderator">Модератор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Participants List */}
          <div className="space-y-4">
            {filteredParticipants.map((participant) => (
              <Card key={participant.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>
                        {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{participant.name}</h3>
                          <p className="text-gray-600">{participant.email}</p>
                          {participant.company && (
                            <p className="text-sm text-gray-500">
                              {participant.position} в {participant.company}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(participant.status)}>
                            {getStatusIcon(participant.status)}
                            <span className="ml-1">{getStatusLabel(participant.status)}</span>
                          </Badge>
                          <Badge variant="outline">{getRoleLabel(participant.role)}</Badge>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{participant.meetingHistory} встреч</span>
                          </div>
                          {participant.rating && (
                            <div className="flex items-center space-x-1">
                              {renderStars(participant.rating)}
                              <span>({participant.rating}/5)</span>
                            </div>
                          )}
                          <span>
                            Добавлен {new Date(participant.addedAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {participant.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendReminder(participant.id)}
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Напомнить
                            </Button>
                          )}

                          <Select
                            value={participant.status}
                            onValueChange={(value) => updateParticipantStatus(participant.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Ожидает</SelectItem>
                              <SelectItem value="accepted">Подтвердил</SelectItem>
                              <SelectItem value="declined">Отказался</SelectItem>
                              <SelectItem value="tentative">Возможно</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {participant.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {participant.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{invitation.eventTitle}</h3>
                      <p className="text-gray-600">{invitation.participant.name}</p>
                      <p className="text-sm text-gray-500">
                        Отправлено {new Date(invitation.sentAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{invitation.status}</Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        Напоминаний: {invitation.remindersSent}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Аналитика участников</CardTitle>
              <CardDescription>
                Статистика ответов и эффективность приглашений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Аналитика участников будет здесь</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Пригласить участников</DialogTitle>
            <DialogDescription>
              Отправьте приглашения на мероприятие с персональным сообщением
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email адреса (через запятую или новую строку)</label>
              <Textarea
                placeholder="john@example.com, jane@example.com"
                value={inviteForm.emails}
                onChange={(e) => setInviteForm(prev => ({ ...prev, emails: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Роль участников</label>
              <Select value={inviteForm.role} onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendee">Участник</SelectItem>
                  <SelectItem value="speaker">Спикер</SelectItem>
                  <SelectItem value="moderator">Модератор</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Персональное сообщение</label>
              <Textarea
                placeholder="Привет! Приглашаю тебя на интересное мероприятие..."
                value={inviteForm.message}
                onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={inviteForm.sendReminder}
                onCheckedChange={(checked) => setInviteForm(prev => ({ ...prev, sendReminder: checked as boolean }))}
              />
              <label className="text-sm">Отправить напоминание</label>
              <Select value={inviteForm.reminderTime} onValueChange={(value) => setInviteForm(prev => ({ ...prev, reminderTime: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">За 1 час</SelectItem>
                  <SelectItem value="1day">За 1 день</SelectItem>
                  <SelectItem value="3days">За 3 дня</SelectItem>
                  <SelectItem value="1week">За неделю</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSendInvitations}>
              <Send className="w-4 h-4 mr-2" />
              Отправить приглашения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
