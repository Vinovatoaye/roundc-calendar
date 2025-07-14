'use client'

import { useState } from 'react'
import { TrendingUp, Calendar, Users, Clock, Target, Zap, Award, Activity, BarChart3, PieChart, MapPin, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AnalyticsData {
  totalMeetings: number
  successfulMeetings: number
  totalHours: number
  averageMeetingDuration: number
  topCategories: CategoryStats[]
  monthlyTrends: MonthlyData[]
  meetingTypes: TypeStats[]
  productivity: ProductivityMetrics
  networkingStats: NetworkingStats
  upcomingTargets: Target[]
}

interface CategoryStats {
  category: string
  count: number
  hours: number
  successRate: number
  trend: 'up' | 'down' | 'stable'
}

interface MonthlyData {
  month: string
  meetings: number
  hours: number
  success: number
}

interface TypeStats {
  type: string
  count: number
  percentage: number
  avgDuration: number
}

interface ProductivityMetrics {
  score: number
  completedTasks: number
  totalTasks: number
  focusTime: number
  distractionTime: number
}

interface NetworkingStats {
  newContacts: number
  followUps: number
  activeConnections: number
  qualityScore: number
}

interface Target {
  id: string
  title: string
  target: number
  current: number
  deadline: string
  priority: 'high' | 'medium' | 'low'
}

const mockAnalytics: AnalyticsData = {
  totalMeetings: 127,
  successfulMeetings: 89,
  totalHours: 234,
  averageMeetingDuration: 1.84,
  topCategories: [
    { category: 'Инвесторы', count: 45, hours: 82, successRate: 78, trend: 'up' },
    { category: 'Питчи', count: 23, hours: 38, successRate: 85, trend: 'up' },
    { category: 'Нетворкинг', count: 34, hours: 51, successRate: 92, trend: 'stable' },
    { category: 'Команда', count: 25, hours: 63, successRate: 95, trend: 'up' }
  ],
  monthlyTrends: [
    { month: 'Окт', meetings: 15, hours: 28, success: 12 },
    { month: 'Ноя', meetings: 22, hours: 41, success: 18 },
    { month: 'Дек', meetings: 28, hours: 52, success: 22 },
    { month: 'Янв', meetings: 35, hours: 67, success: 28 }
  ],
  meetingTypes: [
    { type: 'Онлайн', count: 78, percentage: 61, avgDuration: 1.2 },
    { type: 'Офлайн', count: 35, percentage: 28, avgDuration: 2.1 },
    { type: 'Гибрид', count: 14, percentage: 11, avgDuration: 1.8 }
  ],
  productivity: {
    score: 87,
    completedTasks: 234,
    totalTasks: 267,
    focusTime: 156,
    distractionTime: 23
  },
  networkingStats: {
    newContacts: 67,
    followUps: 45,
    activeConnections: 128,
    qualityScore: 8.4
  },
  upcomingTargets: [
    { id: '1', title: 'Привлечь Series A ($2M)', target: 2000000, current: 750000, deadline: '2024-06-30', priority: 'high' },
    { id: '2', title: 'Нанять 5 разработчиков', target: 5, current: 2, deadline: '2024-04-30', priority: 'high' },
    { id: '3', title: '50 новых клиентов', target: 50, current: 23, deadline: '2024-03-31', priority: 'medium' }
  ]
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [data] = useState(mockAnalytics)

  const getSuccessRate = () => {
    return Math.round((data.successfulMeetings / data.totalMeetings) * 100)
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
    return <Activity className="w-4 h-4 text-gray-500" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTargetProgress = (target: Target) => {
    return Math.round((target.current / target.target) * 100)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Аналитика и метрики</h2>
          <p className="text-gray-600">Отслеживайте эффективность встреч и достижение целей</p>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Неделя</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
            <SelectItem value="quarter">Квартал</SelectItem>
            <SelectItem value="year">Год</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего встреч</p>
                <p className="text-2xl font-bold">{data.totalMeetings}</p>
                <p className="text-sm text-green-600">+15% к прошлому месяцу</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Успешные встречи</p>
                <p className="text-2xl font-bold">{getSuccessRate()}%</p>
                <p className="text-sm text-green-600">+3% к прошлому месяцу</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Часов на встречи</p>
                <p className="text-2xl font-bold">{data.totalHours}</p>
                <p className="text-sm text-gray-600">~{data.averageMeetingDuration}ч в среднем</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Новые контакты</p>
                <p className="text-2xl font-bold">{data.networkingStats.newContacts}</p>
                <p className="text-sm text-blue-600">Качество: {data.networkingStats.qualityScore}/10</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="productivity">Продуктивность</TabsTrigger>
          <TabsTrigger value="networking">Нетворкинг</TabsTrigger>
          <TabsTrigger value="targets">Цели</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Эффективность по категориям</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.topCategories.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{category.category}</span>
                        {getTrendIcon(category.trend)}
                      </div>
                      <Badge variant="secondary">{category.successRate}% успех</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.count} встреч • {category.hours} часов
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${category.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meeting Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Типы встреч</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.meetingTypes.map((type) => (
                  <div key={type.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">{type.type}</div>
                        <div className="text-sm text-gray-600">
                          {type.count} встреч • ~{type.avgDuration}ч
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{type.percentage}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Динамика по месяцам</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {data.monthlyTrends.map((month) => (
                  <div key={month.month} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{month.meetings}</div>
                    <div className="text-sm text-gray-600">{month.month}</div>
                    <div className="text-xs text-gray-500">{month.hours}ч • {month.success} успех</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Индекс продуктивности</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{data.productivity.score}</div>
                  <div className="text-gray-600 mb-4">из 100 баллов</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${data.productivity.score}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold">{data.productivity.completedTasks}</div>
                    <div className="text-sm text-gray-600">Выполнено задач</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{data.productivity.focusTime}ч</div>
                    <div className="text-sm text-gray-600">Время фокуса</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Качество встреч</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Подготовка к встречам</span>
                  <Badge className="bg-green-100 text-green-800">Отлично</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Следование повестке</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Хорошо</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Follow-up действия</span>
                  <Badge className="bg-green-100 text-green-800">Отлично</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Пунктуальность</span>
                  <Badge className="bg-green-100 text-green-800">Отлично</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{data.networkingStats.activeConnections}</div>
                  <div className="text-sm text-gray-600">Активные связи</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <MessageSquare className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{data.networkingStats.followUps}</div>
                  <div className="text-sm text-gray-600">Follow-up встреч</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Award className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                  <div className="text-2xl font-bold">{data.networkingStats.qualityScore}</div>
                  <div className="text-sm text-gray-600">Качество связей</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Качество нетворкинга</CardTitle>
              <CardDescription>
                Анализ эффективности ваших связей и контактов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Карта связей и анализ будут здесь</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets" className="space-y-6">
          <div className="space-y-4">
            {data.upcomingTargets.map((target) => (
              <Card key={target.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{target.title}</h3>
                      <Badge className={getPriorityColor(target.priority)}>
                        {target.priority === 'high' ? 'Высокий' :
                         target.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      До {new Date(target.deadline).toLocaleDateString('ru-RU')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Прогресс</span>
                      <span>{getTargetProgress(target)}% выполнено</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getTargetProgress(target)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {target.title.includes('$')
                          ? formatCurrency(target.current)
                          : target.current
                        } из {target.title.includes('$')
                          ? formatCurrency(target.target)
                          : target.target
                        }
                      </span>
                      <span>
                        Остается: {target.title.includes('$')
                          ? formatCurrency(target.target - target.current)
                          : target.target - target.current
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Добавьте новую цель</p>
                <Button>Создать цель</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
