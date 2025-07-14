'use client'

import { useState } from 'react'
import { FileText, Plus, Search, Filter, Clock, Users, Tag, Paperclip, Share2, Lock, Unlock, Save, History } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

interface Note {
  id: string
  title: string
  content: string
  eventId?: string
  eventTitle?: string
  tags: string[]
  isPrivate: boolean
  createdAt: string
  updatedAt: string
  author: string
  sharedWith: string[]
  attachments: Attachment[]
  checklist: ChecklistItem[]
  lastSaved: string
  version: number
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  assignee?: string
}

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Подготовка к встрече с ABC Ventures',
    content: `# Встреча с ABC Ventures

## Цели встречи
- Презентация нашего продукта
- Обсуждение условий инвестирования
- Получение фидбека от инвесторов

## Ключевые вопросы
1. **Размер раунда**: $2M Series A
2. **Валюация**: pre-money $8M
3. **Use of funds**:
   - 60% - разработка продукта
   - 30% - маркетинг и продажи
   - 10% - операционные расходы

## Материалы для презентации
- [ ] Питч-дек (последняя версия)
- [x] Финансовая модель
- [ ] Demo продукта
- [x] Team deck

## Заметки после встречи
*Будет заполнено после встречи*`,
    eventId: '1',
    eventTitle: 'Встреча с инвестором ABC Ventures',
    tags: ['investment', 'abc-ventures', 'series-a'],
    isPrivate: true,
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T09:30:00Z',
    author: 'Вы',
    sharedWith: [],
    attachments: [
      { id: '1', name: 'pitch-deck-v3.pdf', size: 2400000, type: 'application/pdf', url: '#' },
      { id: '2', name: 'financial-model.xlsx', size: 156000, type: 'application/vnd.ms-excel', url: '#' }
    ],
    checklist: [
      { id: '1', text: 'Питч-дек (последняя версия)', completed: false },
      { id: '2', text: 'Финансовая модель', completed: true },
      { id: '3', text: 'Demo продукта', completed: false },
      { id: '4', text: 'Team deck', completed: true }
    ],
    lastSaved: '2024-01-14T09:30:00Z',
    version: 3
  },
  {
    id: '2',
    title: 'Заметки с Demo Day',
    content: `# Demo Day - Технопарк

## Участники
- 15 стартапов
- ~50 инвесторов
- Медиа представители

## Интересные стартапы
1. **TechMed** - AI для медицинской диагностики
2. **GreenLogistics** - Оптимизация грузоперевозок
3. **EduTech** - Персонализированное обучение

## Полезные контакты
- Андрей Смирнов (Partner @ XYZ Fund) - заинтересован в B2B решениях
- Мария Петрова (Angel investor) - фокус на медтех

## Следующие шаги
- [ ] Отправить питч-дек Андрею Смирнову
- [ ] Назначить follow-up встречу с Марией Петровой
- [x] Обменяться контактами с TechMed`,
    eventId: '2',
    eventTitle: 'Питч на Demo Day',
    tags: ['demo-day', 'networking', 'contacts'],
    isPrivate: false,
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T18:00:00Z',
    author: 'Вы',
    sharedWith: ['team@startup.com'],
    attachments: [],
    checklist: [
      { id: '1', text: 'Отправить питч-дек Андрею Смирнову', completed: false },
      { id: '2', text: 'Назначить follow-up встречу с Марией Петровой', completed: false },
      { id: '3', text: 'Обменяться контактами с TechMed', completed: true }
    ],
    lastSaved: '2024-01-15T18:00:00Z',
    version: 1
  }
]

export default function NotesManager() {
  const [notes, setNotes] = useState(mockNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [newTag, setNewTag] = useState('')

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    isPrivate: true,
    sharedWith: [] as string[]
  })

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = filterTag === 'all' || note.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)))

  const handleSaveNote = () => {
    if (selectedNote) {
      // Update existing note
      setNotes(prev => prev.map(note =>
        note.id === selectedNote.id
          ? {
              ...note,
              ...noteForm,
              updatedAt: new Date().toISOString(),
              version: note.version + 1,
              lastSaved: new Date().toISOString()
            }
          : note
      ))
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Вы',
        attachments: [],
        checklist: [],
        lastSaved: new Date().toISOString(),
        version: 1
      }
      setNotes(prev => [newNote, ...prev])
    }

    setShowNoteDialog(false)
    setSelectedNote(null)
    setNoteForm({ title: '', content: '', tags: [], isPrivate: true, sharedWith: [] })
  }

  const openNoteDialog = (note?: Note) => {
    if (note) {
      setSelectedNote(note)
      setNoteForm({
        title: note.title,
        content: note.content,
        tags: note.tags,
        isPrivate: note.isPrivate,
        sharedWith: note.sharedWith
      })
    } else {
      setSelectedNote(null)
      setNoteForm({ title: '', content: '', tags: [], isPrivate: true, sharedWith: [] })
    }
    setShowNoteDialog(true)
  }

  const toggleChecklistItem = (noteId: string, itemId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? {
            ...note,
            checklist: note.checklist.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
            updatedAt: new Date().toISOString()
          }
        : note
    ))
  }

  const addTag = () => {
    if (newTag.trim() && !noteForm.tags.includes(newTag.trim())) {
      setNoteForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setNoteForm(prev => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag)
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Заметки к встречам</h2>
          <p className="text-gray-600">Ведите записи и планы по вашим встречам и мероприятиям</p>
        </div>
        <Button onClick={() => openNoteDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Новая заметка
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск по заметкам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Фильтр по тегам" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все теги</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>#{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight mb-2">{note.title}</CardTitle>
                  {note.eventTitle && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{note.eventTitle}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {note.isPrivate ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                  {note.sharedWith.length > 0 && (
                    <Share2 className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {note.content.replace(/[#*\-\[\]]/g, '').substring(0, 150)}...
              </p>

              {/* Checklist Preview */}
              {note.checklist.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Чек-лист:</div>
                  {note.checklist.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklistItem(note.id, item.id)}
                        className="h-3 w-3"
                      />
                      <span className={`text-xs ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                  {note.checklist.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{note.checklist.length - 3} задач
                    </div>
                  )}
                </div>
              )}

              {/* Attachments */}
              {note.attachments.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Paperclip className="w-4 h-4" />
                  <span>{note.attachments.length} файлов</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <span>
                  Обновлено {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
                </span>
                <div className="flex items-center space-x-2">
                  <History className="w-3 h-3" />
                  <span>v{note.version}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openNoteDialog(note)}
                >
                  Редактировать
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">Заметки не найдены</p>
            <p className="text-sm text-gray-400">Создайте первую заметку или измените фильтры</p>
          </CardContent>
        </Card>
      )}

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedNote ? 'Редактировать заметку' : 'Новая заметка'}
            </DialogTitle>
            <DialogDescription>
              Создайте подробную заметку с чек-листом, тегами и возможностью поделиться с командой
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger value="content">Содержание</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
              <TabsTrigger value="sharing">Доступ</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название заметки</Label>
                <Input
                  id="title"
                  placeholder="Например: Подготовка к встрече с инвестором"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Содержание (поддерживается Markdown)</Label>
                <Textarea
                  id="content"
                  placeholder="# Заголовок заметки

## Подзаголовок

Ваш текст здесь...

- [ ] Задача 1
- [x] Выполненная задача
- [ ] Задача 3"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Теги</Label>
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
                  {noteForm.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPrivate"
                  checked={noteForm.isPrivate}
                  onCheckedChange={(checked) => setNoteForm(prev => ({ ...prev, isPrivate: checked }))}
                />
                <Label htmlFor="isPrivate">Приватная заметка</Label>
              </div>
            </TabsContent>

            <TabsContent value="sharing" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Поделиться заметкой</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Отправьте заметку коллегам или сделайте её доступной для команды
                  </p>
                  <Input placeholder="Email адреса через запятую" />
                  <Button className="mt-2" size="sm">Отправить приглашение</Button>
                </div>

                {selectedNote && selectedNote.sharedWith.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Кто имеет доступ</h4>
                    <div className="space-y-2">
                      {selectedNote.sharedWith.map((email) => (
                        <div key={email} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{email}</span>
                          <Button variant="ghost" size="sm">Убрать доступ</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveNote}>
              <Save className="w-4 h-4 mr-2" />
              Сохранить заметку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
