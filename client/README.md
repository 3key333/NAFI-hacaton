# Цифровой гражданин — frontend

Лендинг платформы НАФИ для оценки цифровых компетенций с конфигуратором подключения и 7-шаговым визардом оформления.

## Содержание

- [Стек](#стек)
- [Быстрый старт](#быстрый-старт)
- [Архитектура](#архитектура)
- [Пользовательские сценарии](#пользовательские-сценарии)
- [Секции лендинга](#секции-лендинга)
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

## Быстрый старт

```bash
cd client
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

### Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | TypeScript-проверка + production-сборка в `dist/` |
| `npm run preview` | Локальный просмотр production-сборки |
| `npm run lint` | ESLint |

## Архитектура

Приложение — одностраничный лендинг без роутера. Точка входа — `src/main.tsx`: Redux Provider оборачивает `Layout`.

```mermaid
flowchart TB
  main[main.tsx] --> Provider[Redux Provider]
  Provider --> Layout[Layout]
  Layout --> Header
  Layout --> LandingPage
  Layout --> Footer
  Layout --> StickyMobileCta
  Layout --> ConsultationModal

  LandingPage --> LandingSections
  LandingSections --> HeroSection
  LandingSections --> Wizard
  LandingSections --> AudienceSection
  LandingSections --> OtherSections[остальные секции]

  Wizard --> ConfiguratorPanel
  Wizard --> WizardSteps[WizardStep1–7]
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

1. **Конфигуратор** — параметры (`count`, `audience`, `options`) хранятся в Redux и используются в визарде, секции «Для кого» и расчёте цены.
2. **Визард** — форма заявки, тип плательщика, способ оплаты и шаг проходят через тот же slice; локальные ошибки валидации — в `useState` компонента `Wizard`.
3. **Консультация и контакты** — локальный state в модалке и `ContactsSection`, не связаны с Redux.

## Пользовательские сценарии

### Подключение через визард

1. Пользователь настраивает параметры (шаг 1) или переходит из секции «Для кого» к `#wizard`.
2. Просматривает расчёт (шаг 2), выбирает тип плательщика (шаг 3).
3. Заполняет контактные данные (шаг 4) — валидация на переход «Далее».
4. Принимает mock-договор (шаг 5).
5. Выбирает способ оплаты и нажимает «Оплатить» (шаг 6).
6. Видит экран успеха (шаг 7); кнопка сброса вызывает `resetWizard()`.

### Секция «Для кого»

При смене вкладки вызывается `setAudienceWithRecommendations()` — одновременно меняются тип организации и рекомендуемые опции из `AUDIENCE_RECOMMENDED_OPTIONS`. Чекбоксы опций синхронизированы с конфигуратором.

### Консультация

Кнопки «Получить консультацию» в шапке, hero, визарде, CTA-баннере и секции «Для кого» открывают `ConsultationModal`. Отправка — имитация с задержкой 800 ms.

## Секции лендинга

Порядок рендера задаётся в `LandingSections.tsx`:

| # | Компонент | Якорь | Описание |
|---|-----------|-------|----------|
| 1 | `HeroSection` | — | Заголовок, сценарии, CTA, mock-дашборд |
| 2 | `TrustSection` | — | Логотипы клиентов, статистика |
| 3 | `BenefitsSection` | `#benefits` | Преимущества продукта |
| 4 | `StepsSection` | — | Этапы подключения |
| 5 | `Wizard` | `#wizard` | Конфигуратор + 7-шаговый визард |
| 6 | `WhyNafiSection` | — | Почему НАФИ |
| 7 | `AudienceSection` | — | Сегменты ЦА, рекомендуемые опции |
| 8 | `FeaturesSection` | — | Функционал платформы |
| 9 | `CompetenciesSection` | — | Компетенции DigComp |
| 10 | `CasesSection` | `#cases` | Кейсы |
| 11 | `FaqSection` | `#faq` | Частые вопросы |
| 12 | `CtaBannerSection` | — | Промо-баннер с CTA |
| 13 | `ContactsSection` | `#contacts` | Контактная форма (mock) |

Навигация в шапке — константа `NAV_LINKS` в `landingData.ts`.

## Визард подключения

| Шаг | Компонент | Содержание |
|-----|-----------|------------|
| 1 | `WizardStep1` | `ConfiguratorPanel` с базовым функционалом |
| 2 | `WizardStep2` | Детализация стоимости по тарифу и опциям |
| 3 | `WizardStep3` | Выбор плательщика (физлицо / ИП / юрлицо) |
| 4 | `WizardStep4` | Форма: имя, фамилия, email, компания, телефон, согласие ПДн |
| 5 | `WizardStep5` | Mock-текст лицензионного договора + чекбокс принятия |
| 6 | `WizardStep6` | Способ оплаты (карта / счёт) + mock-форма карты |
| 7 | `WizardStep7` | Экран «Готово» + сброс визарда |

Названия шагов в прогресс-баре — `WIZARD_STEPS` в `landingData.ts`.

### Валидация при переходе между шагами

- **Шаг 4 → 5:** `validateConnectionForm()` — имя, фамилия, email, согласие на ПДн.
- **Шаг 5 → 6:** обязателен `contractAccepted`.
- **Шаг 6 → 7:** mock-оплата без реальной проверки карты.

## Расчёт стоимости

Логика в `src/helpers/priceCalculator.ts`:

```
licenseTotal = count × pricePerUser
optionsTotal = сумма фиксированных надбавок за включённые опции
total        = licenseTotal + optionsTotal
```

### Тариф за пользователя

Файл `src/config/pricingConfig.ts` — ступени `USER_PRICE_TIERS` (без НДС):

| Диапазон | Цена за пользователя |
|----------|---------------------|
| до 500 чел. | 390 ₽ |
| 501–4000 чел. | 370 ₽ |
| более 4000 чел. | 340 ₽ |

Источник: [презентация НАФИ](https://nafi.ru/upload/presentations/Digiyal_Citizen.pdf).

### Дополнительные опции

Файл `src/config/connectionConfig.ts` — массив `CONNECTION_OPTIONS` (фиксированные надбавки, **упрощённый прототип**, не официальный прайс):

| Ключ | Название | Цена |
|------|----------|------|
| `certificates` | Сертификаты | 15 000 ₽ |
| `hints` | Подсказки после неверных ответов | 8 000 ₽ |
| `recommendations` | Рекомендации по развитию | 12 000 ₽ |
| `api` | Интеграция по API | 25 000 ₽ |

Лимиты количества пользователей: `MIN_USER_COUNT = 10`, `MAX_USER_COUNT = 100 000`.

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
| `wizardStep` | `1…7` | Текущий шаг визарда |
| `contractAccepted` | `boolean` | Принятие договора |
| `wizardResetVersion` | `number` | Счётчик сброса (для сброса локального UI) |

### Основные actions

| Action | Назначение |
|--------|------------|
| `setCount` | Установить число пользователей (с clamp) |
| `setAudience` | Сменить тип организации |
| `setAudienceWithRecommendations` | Сменить аудиторию + применить рекомендуемые опции |
| `toggleOption` | Переключить доп. опцию |
| `setFormField` | Обновить поле формы визарда |
| `setPayerType` | Сменить плательщика (авто-выбор способа оплаты) |
| `setWizardStep` | Перейти на шаг |
| `resetWizard` | Сбросить визард к начальному состоянию |

Хук **`useConnection()`** — единая точка доступа для компонентов. Метод `openWizard()` прокручивает страницу к `#wizard`.

## Что реализовано, а что mock

| Функция | Статус |
|---------|--------|
| Лендинг (секции, тексты) | Реальный UI |
| Конфигуратор (кол-во, аудитория, опции) | Реальный UI + расчёт цены |
| Визард подключения (7 шагов) | Реальный UI |
| Расчёт стоимости | По тарифам из презентации НАФИ |
| Надбавки за опции | Упрощённый прототип (не официальный прайс) |
| Лицензионный договор | Mock-текст |
| Оплата картой | Mock-форма |
| Отправка форм (консультация, контакты) | Mock (задержка 800 ms) |
| Mock-дашборд в hero | Заглушка |
| Backend / API | Отсутствует |

## Структура проекта

```
client/
├── public/                 # favicon.svg
├── src/
│   ├── assets/             # global.css (CSS-переменные, reset)
│   ├── components/
│   │   ├── configurator/   # ConfiguratorPanel
│   │   ├── footer/
│   │   ├── header/
│   │   ├── modal/          # ConsultationModal
│   │   ├── stickyBar/      # StickyMobileCta (мобильный CTA)
│   │   ├── ui/             # Button, SectionTitle
│   │   └── wizard/
│   │       ├── steps/      # WizardStep1 … WizardStep7
│   │       └── Wizard.tsx
│   ├── config/
│   │   ├── connectionConfig.ts  # Опции, дефолты, типы организаций
│   │   └── pricingConfig.ts     # Тарифные ступени
│   ├── data/
│   │   └── landingData.ts       # Тексты лендинга
│   ├── helpers/
│   │   ├── priceCalculator.ts
│   │   └── validateForm.ts
│   ├── layout/             # Layout (Header + main + Footer)
│   ├── pages/landingPage/
│   │   ├── sections/       # Секции лендинга
│   │   ├── LandingPage.tsx
│   │   └── LandingSections.tsx
│   ├── redux/
│   │   ├── hooks/useConnection.ts
│   │   ├── slices/connectionSlice.ts
│   │   └── store.ts
│   ├── types.ts            # Общие TypeScript-типы
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
| `AUDIENCE_TABS` | Вкладки «Для кого» (боли, выгоды, кейсы, recommendedOptions) |
| `WIZARD_STEPS` | Названия шагов визарда |
| `BASE_FEATURES` | Базовый функционал в конфигураторе |

Разметка секций — в `src/pages/landingPage/sections/`.

### Типы организаций

Короткие названия для select — `AUDIENCE_OPTIONS` в `connectionConfig.ts`.

Рекомендуемые опции по сегменту — `AUDIENCE_RECOMMENDED_OPTIONS` в том же файле.

Развёрнутые тексты вкладок — `AUDIENCE_TABS` в `landingData.ts`.

### Дефолты

`connectionConfig.ts`:

- `DEFAULT_CONNECTION_FORM` — пустая форма
- `DEFAULT_CONNECTION_CONFIG` — начальное кол-во (100), аудитория (`medium`), опции
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

## Интеграция с backend

Точки, куда можно подключить реальный API:

| Место | Файл | Что отправлять |
|-------|------|----------------|
| Заявка на консультацию | `ConsultationModal.tsx` → `handleSubmit` | `ConnectionForm` |
| Контактная форма | `ContactsSection.tsx` → `handleSubmit` | `ConnectionForm` + comment |
| Завершение визарда | `Wizard.tsx` → `nextStep` на шаге 6 | `config`, `form`, `payerType`, `paymentMethod`, `price` |
| Оплата | `WizardStep6.tsx` | Данные карты / выбор счёта |

Рекомендуемый подход:

1. Создать `src/api/` с функциями `submitConsultation`, `submitContact`, `createOrder`, `processPayment`.
2. Вынести base URL в переменную окружения Vite (`VITE_API_URL`).
3. Заменить `setTimeout` в формах на `fetch` / axios с обработкой ошибок.
4. Mock-текст договора в `WizardStep5` заменить на загрузку PDF или HTML с сервера.

## Импорты (path aliases)

Используйте `@/` вместо относительных путей:

```ts
import { Button } from '@/components/ui/Button'
import { useConnection } from '@/redux/hooks/useConnection'
```

Настроено в `vite.config.ts` и `tsconfig.app.json`.
