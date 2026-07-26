import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { animateCount } from '@/helpers/animateCount'
import { navigateToHome } from '@/helpers/navigation'
import { useConnection } from '@/redux/hooks/useConnection'
import style from './dashboardPreview.module.scss'

const INDEX_SCORE = 62
const BAR_ANIMATION_MS = 1400

const TABS = [
  { id: 'company', label: 'Отчёт по компании' },
  { id: 'employee', label: 'Отчёт по сотруднику' },
  { id: 'training', label: 'Чему учить сотрудников' },
] as const

type TabId = (typeof TABS)[number]['id']

const COMPETENCIES = [
  {
    title: 'Информационная грамотность',
    value: 87,
    details: [
      { label: 'Поиск информации в сети', value: 92 },
      { label: 'Оценка достоверности источников', value: 84 },
      { label: 'Управление цифровым контентом', value: 88 },
      { label: 'Работа с файлами и облачными хранилищами', value: 80 },
    ],
  },
  {
    title: 'Коммуникативная грамотность',
    value: 62,
    details: [
      { label: 'Электронная почта и деловая переписка', value: 74 },
      { label: 'Работа в мессенджерах и чатах', value: 68 },
      { label: 'Совместная работа онлайн', value: 55 },
      { label: 'Участие в видеоконференциях', value: 51 },
    ],
  },
  {
    title: 'Создание цифрового контента',
    value: 67,
    details: [
      { label: 'Создание текстовых документов и электронных таблиц', value: 76 },
      { label: 'Создание изображений', value: 76 },
      { label: 'Создание аудио / видео и мультимедиа-контента', value: 33 },
      { label: 'Редактирование текстовых документов электронных таблиц', value: 80 },
      { label: 'Редактирование изображений', value: 52 },
    ],
  },
  {
    title: 'Цифровая безопасность',
    value: 71,
    details: [
      { label: 'Защита устройств и аккаунтов', value: 78 },
      { label: 'Безопасная работа с паролями', value: 70 },
      { label: 'Распознавание фишинга и мошенничества', value: 65 },
      { label: 'Защита персональных данных', value: 72 },
    ],
  },
  {
    title: 'Навыки решения проблем в цифровой среде',
    value: 64,
    details: [
      { label: 'Настройка рабочего ПО', value: 60 },
      { label: 'Решение типовых технических проблем', value: 58 },
      { label: 'Использование цифровых инструментов для задач', value: 72 },
      { label: 'Самообучение новым сервисам', value: 66 },
    ],
  },
]

const TRAINING_TOPICS = [
  { topic: 'Работа с информацией в сети', count: 7, percent: 100 },
  { topic: 'Создание аудио, видео и мультимедиа', count: 6, percent: 85 },
  { topic: 'Безопасность в цифровой среде', count: 5, percent: 71 },
  { topic: 'Облачные и мобильные сервисы', count: 5, percent: 71 },
  { topic: 'Работа с таблицами и данными', count: 0, percent: 0 },
  { topic: 'Настройка ПО и рабочих мест', count: 10, percent: 100 },
  { topic: 'Коммуникация в цифровых каналах', count: 5, percent: 50 },
  { topic: 'Создание текстовых документов', count: 0, percent: 15 },
]

const EMPLOYEE_AXES = [
  { label: 'Информационная\nграмотность', short: 'Информационная грамотность', employee: 94, average: 72 },
  { label: 'Коммуникативная\nграмотность', short: 'Коммуникативная грамотность', employee: 83, average: 68 },
  { label: 'Создание цифрового\nконтента', short: 'Создание цифрового контента', employee: 75, average: 58 },
  { label: 'Цифровая\nбезопасность', short: 'Цифровая безопасность', employee: 60, average: 64 },
  { label: 'Навыки решения проблем\nв цифровой среде', short: 'Навыки решения проблем', employee: 59, average: 61 },
] as const

const LEVEL_LEGEND = [
  { label: 'Начальный', color: '#e53935' },
  { label: 'Базовый', color: '#f0a04b' },
  { label: 'Продвинутый', color: '#5cb85c' },
]

const getLevelColor = (score: number) => {
  if (score >= 70) return '#5cb85c'
  if (score >= 50) return '#f0a04b'
  return '#e53935'
}

const RADAR_CX = 250
const RADAR_CY = 230
const RADAR_R = 110
const LABEL_R = 148

const radarPoint = (index: number, total: number, value: number, radius = RADAR_R) => {
  const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / total
  const r = (value / 100) * radius
  return {
    x: RADAR_CX + r * Math.cos(angle),
    y: RADAR_CY + r * Math.sin(angle),
    angle,
  }
}

const labelAnchor = (angle: number): 'start' | 'middle' | 'end' => {
  const cos = Math.cos(angle)
  if (cos > 0.35) return 'start'
  if (cos < -0.35) return 'end'
  return 'middle'
}

const radarPolygon = (values: number[]) =>
  values
    .map((value, index) => {
      const { x, y } = radarPoint(index, values.length, value)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

const GRID_LEVELS = [20, 40, 60, 80, 100]

interface DashboardPreviewPageProps {
  onConsultation: () => void
}

const CompanyReportPanel = () => {
  const [barsOn, setBarsOn] = useState(false)
  const [indexScore, setIndexScore] = useState(0)
  const [compScores, setCompScores] = useState(() => COMPETENCIES.map(() => 0))
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    const startId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setBarsOn(true))
    })

    const stoppers = [
      animateCount(0, INDEX_SCORE, BAR_ANIMATION_MS, setIndexScore),
      ...COMPETENCIES.map((item, index) =>
        animateCount(0, item.value, BAR_ANIMATION_MS + index * 90, (value) => {
          setCompScores((prev) => {
            if (prev[index] === value) return prev
            const next = [...prev]
            next[index] = value
            return next
          })
        }),
      ),
    ]

    return () => {
      cancelAnimationFrame(startId)
      stoppers.forEach((stop) => stop())
    }
  }, [])

  const toggleExpanded = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  return (
    <div className={style.panel} role="tabpanel">
      <h2>Отчёт по компании</h2>
      <div className={style.companyGrid}>
        <div className={style.indexCard}>
          <h3>Индекс цифровой грамотности</h3>
          <span className={style.indexCard__level}>Продвинутый</span>
          <div className={style.indexCard__bar}>
            <div
              className={style.indexCard__fill}
              style={{ width: barsOn ? `${INDEX_SCORE}%` : '0%' }}
            >
              {indexScore > 0 ? `${indexScore}%` : '—'}
            </div>
          </div>
          <div className={style.indexCard__note}>
            <span className={style.indexCard__noteIcon} aria-hidden="true">...</span>
            <span className={style.indexCard__noteText}>
              Число сотрудников,
              <br />
              прошедших тестирование
            </span>
          </div>
        </div>

        <div className={style.competenciesCard}>
          <h3>Результаты по компетенциям цифровой грамотности</h3>
          {COMPETENCIES.map((item, index) => {
            const barWidth = Math.max(item.value, 40)
            const isOpen = expanded.has(item.title)

            return (
              <div
                key={item.title}
                className={`${style.compRow} ${isOpen ? style['compRow--open'] : ''}`}
              >
                <div className={style.compRow__main}>
                  <button
                    type="button"
                    className={style.compRow__toggle}
                    onClick={() => toggleExpanded(item.title)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
                  >
                    <img
                      src={isOpen ? '/top-arrow-svgrepo-com.svg' : '/bottom-arrow-svgrepo-com.svg'}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                  <div className={style.compRow__label}>
                    <div
                      className={style.compRow__fill}
                      style={{
                        width: barsOn ? `${barWidth}%` : '0%',
                        transitionDelay: `${index * 70}ms`,
                      }}
                    />
                    <span className={style.compRow__title}>{item.title}</span>
                  </div>
                  <span className={style.compRow__value}>
                    {compScores[index] > 0 ? `${compScores[index]}%` : '—'}
                  </span>
                </div>

                {isOpen && (
                  <ul className={style.compRow__details}>
                    {item.details.map((detail) => (
                      <li
                        key={detail.label}
                        style={{ color: getLevelColor(detail.value) }}
                      >
                        {detail.label} ({detail.value}%)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const DashboardPreviewPage = ({ onConsultation }: DashboardPreviewPageProps) => {
  const { openWizard } = useConnection()
  const [activeTab, setActiveTab] = useState<TabId>('company')

  const handleBack = () => {
    navigateToHome()
  }

  return (
    <div className={style.page}>
      <video
        className={style.page__video}
        src="/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className={style.page__overlay} aria-hidden="true" />
      <div className={`container ${style.page__content}`}>
        <button type="button" className={style.back} onClick={handleBack}>
          ← Назад на лендинг
        </button>

        <div className={style.intro}>
          <h1>Панель управления</h1>
          <p>
            Ознакомительный пример, данные демонстрационные. <br />
            Так будет выглядеть аналитика и отчёты после подключения платформы.
          </p>
        </div>

        <div className={style.tabs} role="tablist" aria-label="Разделы панели">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${style.tab} ${activeTab === tab.id ? style['tab--active'] : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'company' && <CompanyReportPanel />}

        {activeTab === 'employee' && (
          <div className={style.panel} role="tabpanel">
            <h2>Отчёт по сотруднику</h2>
            <div className={style.employeeLayout}>
              <div className={style.radarWrap}>
                <svg
                  className={style.radar}
                  viewBox="0 0 500 470"
                  role="img"
                  aria-label="Сравнение результата сотрудника со средним по компании"
                >
                  <defs>
                    <linearGradient id="avgFill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5b7cfa" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.75" />
                    </linearGradient>
                  </defs>

                  <circle cx={RADAR_CX} cy={RADAR_CY} r={RADAR_R + 10} fill="var(--color-white)" />

                  {GRID_LEVELS.map((level) => (
                    <polygon
                      key={level}
                      points={radarPolygon(EMPLOYEE_AXES.map(() => level))}
                      fill="none"
                      stroke="rgba(87,87,87,0.14)"
                      strokeWidth="1"
                    />
                  ))}

                  {EMPLOYEE_AXES.map((_, index) => {
                    const end = radarPoint(index, EMPLOYEE_AXES.length, 100)
                    return (
                      <line
                        key={index}
                        x1={RADAR_CX}
                        y1={RADAR_CY}
                        x2={end.x}
                        y2={end.y}
                        stroke="rgba(87,87,87,0.18)"
                        strokeWidth="1"
                      />
                    )
                  })}

                  <polygon
                    points={radarPolygon(EMPLOYEE_AXES.map((item) => item.average))}
                    fill="url(#avgFill)"
                    stroke="#6b7cf7"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />

                  <polygon
                    points={radarPolygon(EMPLOYEE_AXES.map((item) => item.employee))}
                    fill="none"
                    stroke="#f0a04b"
                    strokeWidth="2.5"
                  />

                  {EMPLOYEE_AXES.map((item, index) => {
                    const point = radarPoint(index, EMPLOYEE_AXES.length, item.employee)
                    const labelPoint = radarPoint(index, EMPLOYEE_AXES.length, 100, LABEL_R)
                    const lines = item.label.split('\n')
                    const color = getLevelColor(item.employee)
                    const anchor = labelAnchor(labelPoint.angle)
                    const scoreOffsetY = point.y < RADAR_CY ? -14 : 20
                    const labelBlockOffset = labelPoint.y < RADAR_CY ? -6 : 4

                    return (
                      <g key={item.short}>
                        {lines.map((line, lineIndex) => (
                          <text
                            key={line}
                            x={labelPoint.x}
                            y={labelPoint.y + labelBlockOffset + lineIndex * 13}
                            textAnchor={anchor}
                            fontSize="11"
                            fill="#575757"
                          >
                            {line}
                          </text>
                        ))}
                        <text
                          x={point.x}
                          y={point.y + scoreOffsetY}
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="700"
                          fill="#2b2b2b"
                        >
                          {item.employee}
                        </text>
                        <circle cx={point.x} cy={point.y} r="6" fill={color} stroke="#fff" strokeWidth="2" />
                      </g>
                    )
                  })}
                </svg>
              </div>

              <div className={style.legend}>
                <div className={style.legend__item}>
                  <svg className={style.legend__icon} viewBox="0 0 20 20" aria-hidden="true">
                    <polygon
                      points="10,2 18,8 15,18 5,18 2,8"
                      fill="none"
                      stroke="#f0a04b"
                      strokeWidth="2"
                    />
                  </svg>
                  Результат сотрудника
                </div>
                <div className={style.legend__item}>
                  <svg className={style.legend__icon} viewBox="0 0 20 20" aria-hidden="true">
                    <defs>
                      <linearGradient id="legendAvg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5b7cfa" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <polygon points="10,2 18,8 15,18 5,18 2,8" fill="url(#legendAvg)" />
                  </svg>
                  Средние результаты сотрудников вашей компании
                </div>
                <div className={style.legend__levels}>
                  {LEVEL_LEGEND.map((item) => (
                    <div key={item.label} className={style.legend__item}>
                      <span className={style.legend__dot} style={{ background: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className={style.footnote}>
              Профиль компетенций по каждому сотруднику: сильные стороны, зоны роста и сравнение со средним по компании.
            </p>
          </div>
        )}

        {activeTab === 'training' && (
          <div className={style.panel} role="tabpanel">
            <h2>Чему учить сотрудников</h2>
            <div className={style.tableHead}>
              <span>Тема</span>
              <span>Сколько человек ошиблось</span>
              <span>Процентное соотношение от всех прошедших тестирование</span>
            </div>
            {TRAINING_TOPICS.map((row) => (
              <div key={row.topic} className={style.tableRow}>
                <span className={style.tableRow__topic}>{row.topic}</span>
                <span className={style.tableRow__count}>
                  {row.count}
                  <span className={style.tableRow__countLabel}> ошибок</span>
                </span>
                <div className={style.tableRow__barTrack}>
                  <div className={style.tableRow__barFill} style={{ width: `${row.percent}%` }} />
                  <span className={style.tableRow__percent}>{row.percent}</span>
                </div>
              </div>
            ))}
            <p className={style.footnote}>
              Вы сможете подобрать актуальные образовательные программы по цифровой грамотности.
            </p>
          </div>
        )}

        <div className={style.actions}>
          <Button onClick={openWizard}>Подключить платформу</Button>
          <Button variant="secondary" onClick={onConsultation}>
            Получить консультацию
          </Button>
        </div>
      </div>
    </div>
  )
}
