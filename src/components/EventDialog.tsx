'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, MapPin, FileText, Bell, Link, Tag } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: any
}

export default function EventDialog({ open, onOpenChange, event }: EventDialogProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    type: event?.type || 'meeting',
    date: event?.date || '',
    time: event?.time || '',
    duration: event?.duration || '60',
    location: event?.location || '',
    description: event?.description || '',
    attendees: event?.attendees || [] as string[],
    tags: event?.tags || [] as string[],
    priority: event?.priority || 'medium',
    reminders: event?.reminders || ['15min'],
    isPublic: event?.isPublic || false,
    allowInvitations: event?.allowInvitations || true,
    maxAttendees: event?.maxAttendees || ''
  })

  const [newTag, setNewTag] = useState('')
  const [newAttendee, setNewAttendee] = useState('')

  const handleSave = () => {
    // Here would be the save logic
    console.log('Saving event:', formData)
    onOpenChange(false)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag)
    }))
  }

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }))
      setNewAttendee('')
    }
  }

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((a: string) => a !== attendee)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Редактировать событие' : 'Создать новое событие'}
          </DialogTitle>
          <DialogDescription>
            Заполните информацию о событии. Поля отмеченные * обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="attendees">Участники</TabsTrigger>
            <TabsTrigger value="reminders">Уведомления</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название события *</Label>
              <Input
                id="title"
                placeholder="Например: Встреча с инвестором ABC Ventures"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Тип события *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Встреча</SelectItem>
                    <SelectItem value="event">Мероприятие</SelectItem>
                    <SelectItem value="deadline">Дедлайн</SelectItem>
                    <SelectItem value="personal">Личное</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Дата *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Время *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Длительность (мин)</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 минут</SelectItem>
                    <SelectItem value="30">30 минут</SelectItem>
                    <SelectItem value="60">1 час</SelectItem>
                    <SelectItem value="90">1.5 часа</SelectItem>
                    <SelectItem value="120">2 часа</SelectItem>
                    <SelectItem value="180">3 часа</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Место проведения</Label>
              <Input
                id="location"
                placeholder="Например: Офис ABC Ventures, ул. Тверская 1"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Дополнительная информация о событии..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Теги</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Добавить тег"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Пригласить участников</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Email или никнейм в RoundC"
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAttendee()}
                />
                <Button type="button" onClick={addAttendee} size="sm">
                  <Users className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.attendees.map((attendee: string) => (
                  <div key={attendee} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{attendee}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeAttendee(attendee)}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Максимальное количество участников</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Без ограничений"
                value={formData.maxAttendees}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allowInvitations"
                checked={formData.allowInvitations}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowInvitations: checked }))}
              />
              <Label htmlFor="allowInvitations">Разрешить участникам приглашать других</Label>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Label>Напоминания</Label>
              {['5min', '15min', '30min', '1hour', '1day'].map((reminder) => (
                <div key={reminder} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.reminders.includes(reminder)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, reminders: [...prev.reminders, reminder] }))
                      } else {
                        setFormData(prev => ({ ...prev, reminders: prev.reminders.filter((r: string) => r !== reminder) }))
                      }
                    }}
                  />
                  <Label>
                    {reminder === '5min' && 'За 5 минут'}
                    {reminder === '15min' && 'За 15 минут'}
                    {reminder === '30min' && 'За 30 минут'}
                    {reminder === '1hour' && 'За 1 час'}
                    {reminder === '1day' && 'За 1 день'}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="isPublic">Публичное событие</Label>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Link className="w-4 h-4 mr-2" />
                  Ссылка для приглашения
                </h4>
                <div className="flex space-x-2">
                  <Input
                    value="https://roundc.com/events/abc123"
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Копировать
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Эта ссылка будет создана после сохранения события
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            {event ? 'Сохранить изменения' : 'Создать событие'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
