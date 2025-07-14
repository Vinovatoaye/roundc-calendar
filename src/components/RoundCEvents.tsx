'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, MapPin, Star, Tag, Plus, ExternalLink, Heart, Share2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface RoundCEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  location: string
  type: 'meetup' | 'webinar' | 'demo-day' | 'workshop' | 'networking' | 'pitch-session'
  category: 'finance' | 'investors' | 'pitch' | 'education' | 'networking' | 'ai' | 'fintech'
  attendees: number
  maxAttendees: number
  price: number
  currency: 'RUB' | 'USD' | 'EUR'
  organizer: string
  speakers: string[]
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  reviews: number
  isBookmarked: boolean
  registrationUrl: string
  image?: string
}

const mockEvents: RoundCEvent[] = [
  {
    id: '1',
    title: 'Fundraising для B2B стартапов: от идеи до Series A',
    description: 'Комплексный воркшоп по привлечению инвестиций для B2B стартапов. Разберем реальные кейсы, питч-деки и стратегии работы с инвесторами.',
    date: '2024-01-20',
    time: '15:00',
    duration: 180,
    location: 'Технопарк «Сколково»',
    type: 'workshop',
    category: 'finance',
    attendees: 45,
    maxAttendees: 60,
    price: 0,
    currency: 'RUB',
    organizer: 'RoundC Team',
    speakers: ['Алексей Петров (Managing Partner, ABC Ventures)', 'Мария Иванова (CEO, TechStartup)'],
    tags: ['fundraising', 'b2b', 'series-a', 'investment'],
    difficulty: 'intermediate',
    rating: 4.8,
    reviews: 127,
    isBookmarked: true,
    registrationUrl: 'https://roundc.com/events/fundraising-b2b'
  },
  {
    id: '2',
    title: 'Demo Day: AI стартапы в финтехе',
    description: 'Презентация 10 лучших AI стартапов в области финансовых технологий. Питчи, нетворкинг с инвесторами.',
    date: '2024-01-22',
    time: '18:00',
    duration: 240,
    location: 'Digital October',
    type: 'demo-day',
    category: 'ai',
    attendees: 120,
    maxAttendees: 150,
    price: 0,
    currency: 'RUB',
    organizer: 'Digital October',
    speakers: ['10 AI стартапов', 'Панель инвесторов'],
    tags: ['ai', 'fintech', 'demo-day', 'investment'],
    difficulty: 'intermediate',
    rating: 4.9,
    reviews: 89,
    isBookmarked: false,
    registrationUrl: 'https://roundc.com/events/ai-fintech-demo'
  },
  {
    id: '3',
    title: 'Нетворкинг завтрак для фаундеров',
    description: 'Неформальная встреча фаундеров стартапов для обмена опытом и установления полезных связей.',
    date: '2024-01-25',
    time: '09:00',
    duration: 120,
    location: 'Кафе Entrepreneurs',
    type: 'networking',
    category: 'networking',
    attendees: 25,
    maxAttendees: 30,
    price: 500,
    currency: 'RUB',
    organizer: 'Founders Club',
    speakers: [],
    tags: ['networking', 'founders', 'breakfast'],
    difficulty: 'beginner',
    rating: 4.6,
    reviews: 45,
    isBookmarked: true,
    registrationUrl: 'https://roundc.com/events/founders-breakfast'
  },
  {
    id: '4',
    title: 'Мастер-класс: Создание убедительного питч-дека',
    description: 'Практический мастер-класс по созданию питч-дека, который привлечет внимание инвесторов. Анализ лучших примеров.',
    date: '2024-01-28',
    time: '14:00',
    duration: 150,
    location: 'Онлайн',
    type: 'webinar',
    category: 'pitch',
    attendees: 78,
    maxAttendees: 100,
    price: 0,
    currency: 'RUB',
    organizer: 'RoundC Academy',
    speakers: ['Дмитрий Сидоров (Investment Director, XYZ Fund)'],
    tags: ['pitch-deck', 'presentation', 'investment'],
    difficulty: 'beginner',
    rating: 4.7,
    reviews: 156,
    isBookmarked: false,
    registrationUrl: 'https://roundc.com/events/pitch-deck-masterclass'
  }
]

export default function RoundCEvents() {
  const [events, setEvents] = useState(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const toggleBookmark = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, isBookmarked: !event.isBookmarked }
        : event
    ))
  }

  const addToCalendar = (event: RoundCEvent) => {
    // Логика добавления в личный календарь
    console.log('Adding to calendar:', event.title)
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    const matchesType = selectedType === 'all' || event.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || event.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesType && matchesDifficulty
  })

  const getTypeLabel = (type: string) => {
    const labels = {
      'meetup': 'Митап',
      'webinar': 'Вебинар',
      'demo-day': 'Demo Day',
      'workshop': 'Воркшоп',
      'networking': 'Нетворкинг',
      'pitch-session': 'Питч-сессия'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      'finance': 'Финансы',
      'investors': 'Инвесторы',
      'pitch': 'Питчи',
      'education': 'Обучение',
      'networking': 'Нетворкинг',
      'ai': 'Искусственный интеллект',
      'fintech': 'Финтех'
    }
    return labels[category as keyof typeof labels] || category
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      'beginner': 'Начальный',
      'intermediate': 'Средний',
      'advanced': 'Продвинутый'
    }
    return labels[difficulty as keyof typeof labels] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Мероприятия RoundC</CardTitle>
          <CardDescription>
            Найдите мероприятия для развития вашего стартапа и нетворкинга с инвесторами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Поиск по названию, описанию или тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="finance">Финансы</SelectItem>
                <SelectItem value="investors">Инвесторы</SelectItem>
                <SelectItem value="pitch">Питчи</SelectItem>
                <SelectItem value="education">Обучение</SelectItem>
                <SelectItem value="networking">Нетворкинг</SelectItem>
                <SelectItem value="ai">ИИ</SelectItem>
                <SelectItem value="fintech">Финтех</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Тип мероприятия" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="meetup">Митап</SelectItem>
                <SelectItem value="webinar">Вебинар</SelectItem>
                <SelectItem value="demo-day">Demo Day</SelectItem>
                <SelectItem value="workshop">Воркшоп</SelectItem>
                <SelectItem value="networking">Нетворкинг</SelectItem>
                <SelectItem value="pitch-session">Питч-сессия</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Уровень сложности" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="beginner">Начальный</SelectItem>
                <SelectItem value="intermediate">Средний</SelectItem>
                <SelectItem value="advanced">Продвинутый</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Tag className="w-4 h-4 mr-2" />
              Мои теги
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{getTypeLabel(event.type)}</Badge>
                    <Badge variant="secondary">{getCategoryLabel(event.category)}</Badge>
                    <Badge className={getDifficultyColor(event.difficulty)}>
                      {getDifficultyLabel(event.difficulty)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight mb-2">{event.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(event.id)}
                  className={event.isBookmarked ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart className={`w-4 h-4 ${event.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{event.attendees}/{event.maxAttendees} участников</span>
                </div>

                {event.speakers.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Спикеры:</span>
                    <div className="mt-1">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="text-gray-600">{speaker}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{event.rating}</span>
                    <span className="text-sm text-gray-500">({event.reviews} отзывов)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {event.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.tags.length - 3} еще
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  {event.price === 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Бесплатно
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {event.price} {event.currency}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCalendar(event)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    В календарь
                  </Button>

                  <Button size="sm" asChild>
                    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                      Регистрация
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">Мероприятия не найдены</p>
            <p className="text-sm text-gray-400">Попробуйте изменить фильтры поиска</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
