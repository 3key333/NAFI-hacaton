# Цифровой гражданин — frontend

Лендинг платформы НАФИ для оценки цифровых компетенций с конфигуратором подключения, 5-шаговым визардом оформления и демо-страницей панели управления.

## Содержание

- [Стек](#стек)
- [Быстрый старт](#быстрый-старт)
- [Архитектура](#архитектура)
- [Маршрутизация](#маршрутизация)
- [Пользовательские сценарии](#пользовательские-сценарии)
- [Секции лендинга](#секции-лендинга)
- [Демо-панель управления](#демо-панель-управления)
- [Визард подключения](#визард-подключения)
- [Расчёт стоимости](#расчёт-стоимости)
- [Redux-состояние](#redux-состояние)
- [Что реализовано, а что mock](#что-реализовано-а-что-mock)
- [Структура проекта](#структура-проекта)
- [Контент и конфигурация](#контент-и-конфигурация)
- [Стили и UI](#стили-и-ui)
- [Интеграция с backend](#интеграция-с-backend)
- [Импорты (path aliases)](#импорты-path-aliases)

## Стек

| Технология | Назначение |
|------------|------------|
| **React 19** + **TypeScript** | UI и типизация |
| **Vite 8** | Сборка и dev-сервер |
| **Redux Toolkit** | Глобальное состояние конфигуратора и визарда |
| **SCSS Modules** | Изолированные стили компонентов |

Роутер (React Router и т.п.) не используется: переключение лендинг ↔ демо-панель — через `pathname` и History API.

## Быстрый старт

```bash
cd client
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

Демо-панель: `http://localhost:5173/panel`.

### Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | TypeScript-проверка + production-сборка в `dist/` |
| `npm run preview` | Локальный просмотр production-сборки |
| `npm run lint` | ESLint |

> В production для `/panel` нужен SPA-fallback (все пути → `index.html`), иначе прямой заход на URL отдаст 404.

## Архитектура

Точка входа — `src/main.tsx`: Redux Provider оборачивает `Layout`. `Layout` по текущему pathname рендерит либо лендинг, либо демо-панель.

```mermaid
flowchart TB
  main[main.tsx] --> Provider[Redux Provider]
  Provider --> Layout[Layout]
  Layout --> Header
  Layout --> Main{pathname}
  Main -->|/| LandingPage
  Main -->|/panel| DashboardPreviewPage
  Layout --> Footer
  Layout --> StickyMobileCta
  Layout --> ConsultationModal

  LandingPage --> LandingSections
  LandingSections --> HeroSection
  LandingSections --> Wizard
  LandingSections --> FeaturesSection
  LandingSections --> OtherSections[остальные секции]
  FeaturesSection -->|navigateToPanel| DashboardPreviewPage

  Wizard --> ConfiguratorPanel
  Wizard --> WizardSteps[WizardStep1–5]
  ConfiguratorPanel --> useConnection
  Wizard --> useConnection
  AudienceSection --> useConnection
  useConnection --> connectionSlice[(connectionSlice)]
  ConfiguratorPanel --> priceCalculator
  Wizard --> priceCalculator
  priceCalculator --> pricingConfig
  priceCalculator --> connectionConfig
```

### Потоки данных

1. **Конфигуратор** — параметры (`count`, `audience`, `options`) в Redux; используются в визарде, секции «Для кого» и расчёте цены.
2. **Визард** — форма, тип плательщика, способ оплаты и шаг — в том же slice; ошибки валидации — локальный `useState` в `Wizard`.
3. **Консультация и контакты** — локальный state в `ConsultationModal` и `ContactsSection`, не связаны с Redux.
4. **Демо-панель** — локальный UI-state (вкладки, анимации, раскрытие компетенций), без Redux.

## Маршрутизация

Логика в `src/helpers/navigation.ts`:

| Функция / константа | Назначение |
|---------------------|------------|
| `isPanelRoute()` | `true`, если pathname = `/panel` |
| `navigateToPanel()` | `history.pushState` → `/panel` + событие `popstate` |
| `navigateToHome()` | возврат на `/` + скролл вверх |

`Layout` слушает `popstate` и переключает контент. Sticky CTA на демо-панели скрыт.

## Пользовательские сценарии

### Подключение через визард

1. Пользователь настраивает параметры и смотрит стоимость (шаг 1) или переходит из секции «Для кого» к `#wizard`.
2. Выбирает тип плательщика и заполняет данные (шаг 2) — валидация на «Далее» (имя, фамилия, email, телефон, компания ≥ 3 символа, согласие на ПДн).
3. Принимает mock-договор (шаг 3).
4. Выбирает способ оплаты и нажимает «Оплатить» (шаг 4).
5. Экран успеха (шаг 5); сброс — `resetWizard()`. Повторный `openWizard()` после успеха тоже сбрасывает визард на шаг 1.

### Секция «Для кого»

При смене вкладки вызывается `setAudienceWithRecommendations()` — меняются тип организации и рекомендуемые опции из `AUDIENCE_RECOMMENDED_OPTIONS`. Чекбоксы опций синхронизированы с конфигуратором.

### Консультация

Кнопки «Получить консультацию» (шапка, hero, визард, FAQ, CTA-баннер, «Для кого», демо-панель) открывают `ConsultationModal`. Поля: имя, фамилия, email, телефон, согласие. Отправка — имитация с задержкой 800 ms.

### Демо-панель

Кнопка «Перейти к панели управления» в `FeaturesSection` ведёт на `/panel`. Назад — «Назад на лендинг» или логотип/навигация в шапке.

## Секции лендинга

Порядок рендера — `LandingSections.tsx`:

| # | Компонент | Якорь | Описание |
|---|-----------|-------|----------|
| 1 | `HeroSection` | — | Заголовок, чипы ЦА, сценарии, CTA |
| 2 | `TrustSection` | — | Слайдер логотипов, статистика |
| 3 | `BenefitsSection` | `#benefits` | Преимущества продукта |
| 4 | `StepsSection` | — | Этапы подключения |
| 5 | `Wizard` | `#wizard` | Конфигуратор + 5-шаговый визард |
| 6 | `WhyNafiSection` | — | Почему НАФИ |
| 7 | `AudienceSection` | — | Сегменты ЦА, рекомендуемые опции |
| 8 | `FeaturesSection` | — | Функционал + мини-дашборд + переход на `/panel` |
| 9 | `CompetenciesSection` | — | 5 компетенций DigComp, flip-карточки, демо-вопросы |
| 10 | `CasesSection` | `#cases` | Кейсы |
| 11 | `FaqSection` | `#faq` | Частые вопросы + ссылка на консультацию |
| 12 | `CtaBannerSection` | — | Промо-баннер с CTA |
| 13 | `ContactsSection` | `#contacts` | Контактная форма (mock) |

Навигация в шапке — `NAV_LINKS` в `landingData.ts`. Скролл к якорям — `scrollToSection` (с учётом sticky-хедера).

## Демо-панель управления

Страница `DashboardPreviewPage` (`/panel`) — ознакомительный UI с демо-данными.

| Вкладка | Содержание |
|---------|------------|
| Отчёт по компании | Индекс, анимированные полосы компетенций, раскрытие деталей |
| Отчёт по сотруднику | Радар (среднее по компании + сотрудник), легенда |
| Чему учить | Таблица тем / ошибок / % |

Фон — видео `public/hero-bg.mp4` + виньетка. CTA внизу: подключение и консультация.

## Визард подключения

| Шаг | Компонент | Содержание |
|-----|-----------|------------|
| 1 | `WizardStep1` | Параметры + стоимость (`ConfiguratorPanel` + детализация с НДС) |
| 2 | `WizardStep2` | Плательщик + контактные данные (`PhoneInput`) |
| 3 | `WizardStep3` | Mock-текст лицензионного договора + чекбокс принятия |
| 4 | `WizardStep4` | Способ оплаты (карта / счёт) + mock-форма карты |
| 5 | `WizardStep5` | Экран «Готово» + сброс визарда |

Названия шагов — `WIZARD_STEPS` в `landingData.ts`.

### Валидация при переходе между шагами

- **Шаг 2 → 3:** `validateConnectionForm()` — имя, фамилия, email, телефон (СНГ), компания (обязательна, мин. 3 символа), согласие на ПДн.
- **Шаг 3 → 4:** обязателен `contractAccepted`.
- **Шаг 4 → 5:** mock-оплата без реальной проверки карты.

В модалке консультации компания не обязательна (`requireCompany: false`).

## Расчёт стоимости

Логика в `src/helpers/priceCalculator.ts`:

```
licenseTotal   = count × pricePerUser
optionsTotal   = сумма фиксированных надбавок за включённые опции
subtotalExVat  = licenseTotal + optionsTotal
vatAmount      = round(subtotalExVat × VAT_RATE)   // 5%
total          = subtotalExVat + vatAmount
```

Итого в UI показывается **с НДС**.

### Тариф за пользователя

Файл `src/config/pricingConfig.ts` — ступени `USER_PRICE_TIERS` (без НДС):

| Диапазон | Цена за пользователя |
|----------|---------------------|
| до 500 чел. | 390 ₽ |
| 501–4000 чел. | 370 ₽ |
| более 4000 чел. | 340 ₽ |

Источник: [презентация НАФИ](https://nafi.ru/upload/presentations/Digiyal_Citizen.pdf).

`VAT_RATE = 0.05`.

### Дополнительные опции

Файл `src/config/connectionConfig.ts` — `CONNECTION_OPTIONS` (фиксированные надбавки, **упрощённый прототип**, не официальный прайс):

| Ключ | Название | Цена |
|------|----------|------|
| `certificates` | Сертификаты о прохождении теста | 15 000 ₽ |
| `hints` | Подсказки после неверных ответов | 8 000 ₽ |
| `recommendations` | Рекомендации по развитию | 12 000 ₽ |
| `api` | Интеграция по API | 25 000 ₽ |

Лимиты количества: `MIN_USER_COUNT = 3`, `MAX_USER_COUNT = 100 000`. Пресеты: 50 / 100 / 500 / 1000.

## Redux-состояние

Slice `connection` (`src/redux/slices/connectionSlice.ts`):

| Поле | Тип | Описание |
|------|-----|----------|
| `config.count` | `number` | Количество тестируемых |
| `config.audience` | `AudienceType` | Тип организации |
| `config.options` | `ConnectionOptions` | Включённые доп. опции |
| `form` | `ConnectionForm` | Данные формы визарда |
| `payerType` | `'individual' \| 'ip' \| 'legal'` | Тип плательщика |
| `paymentMethod` | `'card' \| 'invoice'` | Способ оплаты |
| `wizardStep` | `1…5` | Текущий шаг визарда |
| `contractAccepted` | `boolean` | Принятие договора |
| `wizardResetVersion` | `number` | Счётчик сброса (для локального UI) |

### Основные actions

| Action | Назначение |
|--------|------------|
| `setCount` | Установить число пользователей (с clamp) |
| `setAudience` | Сменить тип организации |
| `setAudienceWithRecommendations` | Сменить аудиторию + рекомендуемые опции |
| `toggleOption` | Переключить доп. опцию |
| `setFormField` | Обновить поле формы визарда |
| `setPayerType` | Сменить плательщика (авто-выбор способа оплаты) |
| `setWizardStep` | Перейти на шаг |
| `resetWizard` | Сбросить визард к начальному состоянию |

Хук **`useConnection()`** — единая точка доступа. `openWizard()` прокручивает к `#wizard`; если визард на «Готово», сначала вызывает `resetWizard()`. С демо-панели перед открытием визарда выполняется возврат на лендинг.

## Что реализовано, а что mock

| Функция | Статус |
|---------|--------|
| Лендинг (секции, тексты) | Реальный UI |
| Конфигуратор (кол-во, аудитория, опции) | Реальный UI + расчёт цены |
| Визард подключения (5 шагов) | Реальный UI |
| Расчёт стоимости | По тарифам НАФИ + НДС 5% |
| Надбавки за опции | Упрощённый прототип |
| Демо-панель `/panel` | Реальный UI, демо-данные |
| Лицензионный договор | Mock-текст |
| Оплата картой | Mock-форма |
| Отправка форм (консультация, контакты) | Mock (задержка 800 ms) |
| Backend / API | Отсутствует |

## Структура проекта

```
client/
├── public/                      # favicon, логотипы, стрелки, hero-bg.mp4
├── src/
│   ├── assets/
│   │   ├── competencies/        # Иконки сфер компетенций
│   │   └── global.css           # CSS-переменные, reset
│   ├── components/
│   │   ├── configurator/        # ConfiguratorPanel
│   │   ├── footer/
│   │   ├── header/
│   │   ├── modal/               # ConsultationModal, SampleTestModal
│   │   ├── stickyBar/           # StickyMobileCta
│   │   ├── ui/                  # Button, SectionTitle, PhoneInput
│   │   └── wizard/
│   │       ├── steps/           # WizardStep1 … WizardStep5
│   │       └── Wizard.tsx
│   ├── config/
│   │   ├── connectionConfig.ts  # Сегменты ЦА, опции, дефолты, лимиты
│   │   └── pricingConfig.ts     # Тарифные ступени, VAT_RATE
│   ├── data/
│   │   └── landingData.ts       # Тексты и контент лендинга
│   ├── helpers/
│   │   ├── animateCount.ts      # Анимация чисел на демо-панели
│   │   ├── navigation.ts        # /panel ↔ /
│   │   ├── phoneFormat.ts       # Форматирование телефонов СНГ
│   │   ├── priceCalculator.ts
│   │   ├── scrollToSection.ts
│   │   ├── typograph.ts         # Неразрывные пробелы после коротких слов
│   │   └── validateForm.ts
│   ├── layout/                  # Layout (Header + main + Footer)
│   ├── pages/
│   │   ├── dashboardPreview/    # Демо-панель управления
│   │   └── landingPage/
│   │       ├── sections/
│   │       ├── LandingPage.tsx
│   │       └── LandingSections.tsx
│   ├── redux/
│   │   ├── hooks/useConnection.ts
│   │   ├── slices/connectionSlice.ts
│   │   └── store.ts
│   ├── types.ts
│   └── main.tsx
├── index.html
├── vite.config.ts
└── tsconfig.app.json
```

## Контент и конфигурация

### Тексты лендинга

Файл **`src/data/landingData.ts`**:

| Константа | Назначение |
|-----------|------------|
| `NAV_LINKS` | Навигация в шапке |
| `HERO_BADGES`, `HERO_SCENARIOS` | Блок hero |
| `TRUST_LOGOS`, `TRUST_STATS` | Блок доверия |
| `BENEFITS`, `FAQ_ITEMS`, `CASES` | Секции |
| `PLATFORM_FEATURES`, `MOCK_LK_TABS` | Блок возможностей + мини-дашборд |
| `COMPETENCIES` | 5 сфер компетенций (иконка, skills, report) |
| `DEMO_QUESTIONS` | Примеры вопросов в `SampleTestModal` |
| `AUDIENCE_TABS` | Вкладки «Для кого» (боли, выгоды, кейсы) |
| `WIZARD_STEPS` | Названия шагов визарда |
| `BASE_FEATURES` | Базовый функционал в конфигураторе |

Разметка секций — в `src/pages/landingPage/sections/`.

### Типы организаций

Источник сегментов — `AUDIENCE_SEGMENTS` в `connectionConfig.ts`.

| Производная | Назначение |
|-------------|------------|
| `AUDIENCE_LABELS` | Короткие названия для select / конфигуратора |
| `AUDIENCE_RECOMMENDED_OPTIONS` | Рекомендуемые опции по сегменту |

Развёрнутые тексты вкладок — `AUDIENCE_TABS` в `landingData.ts`.

### Дефолты

`connectionConfig.ts`:

- `DEFAULT_CONNECTION_FORM` — пустая форма (`firstName`, `lastName`, `email`, `company`, `phone`, `comment`, `consent`)
- `DEFAULT_CONNECTION_CONFIG` — кол-во 100, аудитория `medium`, опции
- `DEFAULT_PAYER_TYPE` / `DEFAULT_PAYMENT_METHOD` — юрлицо + счёт

## Стили и UI

- Глобальные CSS-переменные и reset — `src/assets/global.css`
- Компонентные стили — SCSS Modules (`*.module.scss`)
- Общий контейнер — класс `.container` (max-width: 1100px)
- Секции — класс `.section`, альтернативный фон — `.section--alt`

### Дизайн-токены

| Переменная | Значение | Назначение |
|------------|----------|------------|
| `--color-primary` | `#ffc41e` | Акцент НАФИ |
| `--color-text` | `#2b2b2b` | Основной текст |
| `--color-bg` | `#f5f5f5` | Фон страницы |
| `--container-width` | `1100px` | Ширина контента |
| `--header-height` | `72px` | Высота шапки |
| `--radius` | `8px` | Скругления |

### UI-компоненты

- **`Button`** — варианты `primary` (по умолчанию) и `secondary`
- **`SectionTitle`** — заголовок и подзаголовок секции
- **`PhoneInput`** — телефон с кодом страны (СНГ)

## Интеграция с backend

Точки, куда можно подключить реальный API:

| Место | Файл | Что отправлять |
|-------|------|----------------|
| Заявка на консультацию | `ConsultationModal.tsx` → `handleSubmit` | поля формы консультации |
| Контактная форма | `ContactsSection.tsx` → `handleSubmit` | email, comment, consent |
| Завершение визарда | `Wizard.tsx` → `nextStep` на шаге 4 | `config`, `form`, `payerType`, `paymentMethod`, `price` |
| Оплата | `WizardStep4.tsx` | Данные карты / выбор счёта |

Рекомендуемый подход:

1. Создать `src/api/` с функциями `submitConsultation`, `submitContact`, `createOrder`, `processPayment`.
2. Вынести base URL в `VITE_API_URL`.
3. Заменить `setTimeout` в формах на `fetch` / axios с обработкой ошибок.
4. Mock-текст договора в `WizardStep3` заменить на загрузку PDF или HTML с сервера.
5. Для `/panel` настроить SPA-fallback на хостинге.

## Импорты (path aliases)

Используйте `@/` вместо относительных путей:

```ts
import { Button } from '@/components/ui/Button'
import { useConnection } from '@/redux/hooks/useConnection'
import { navigateToPanel } from '@/helpers/navigation'
```

Настроено в `vite.config.ts` и `tsconfig.app.json`.
