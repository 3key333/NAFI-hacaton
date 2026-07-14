import style from './footer.module.scss'

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={`container ${style.footer__grid}`}>
        <div>
          <p className={style.footer__title}>Продукт</p>
          <a href="#benefits">Что получите</a>
          <a href="#steps">Этапы</a>
          <a href="#wizard">Конфигуратор</a>
          <a href="#cases">Кейсы</a>
        </div>
        <div>
          <p className={style.footer__title}>Компания</p>
          <a href="https://nafi.ru" target="_blank" rel="noreferrer">О НАФИ</a>
          <a href="https://it-gramota.ru" target="_blank" rel="noreferrer">Публикации</a>
          <a href="#contacts">Контакты</a>
          <a href="#contacts">Реквизиты</a>
        </div>
        <div>
          <p className={style.footer__title}>Документы</p>
          <a href="https://it-gramota.ru/policy" target="_blank" rel="noreferrer">Политика ПДн</a>
          <a href="https://it-gramota.ru/personal-data-agreement" target="_blank" rel="noreferrer">Согласие ПДн</a>
          <a href="https://it-gramota.ru" target="_blank" rel="noreferrer">Оферта</a>
          <a href="https://nafi.ru" target="_blank" rel="noreferrer">Свидетельства</a>
        </div>
        <div>
          <p className={style.footer__title}>Контакты</p>
          <p>welcome@it-gramota.ru</p>
          <p>+7 (495) 152-08-87</p>
          <div className={style.footer__social}>
            <a href="https://t.me/nafi_ru" target="_blank" rel="noreferrer" aria-label="Telegram">TG</a>
            <a href="https://vk.com/nafi_ru" target="_blank" rel="noreferrer" aria-label="ВКонтакте">VK</a>
            <a href="https://nafi.ru" target="_blank" rel="noreferrer" aria-label="Сайт НАФИ">Web</a>
          </div>
        </div>
      </div>
      <div className={`container ${style.footer__bottom}`}>
        <p>© 2026, Цифровой Гражданин. Все права защищены.</p>
        <p>Оператор: Аналитический центр НАФИ</p>
      </div>
    </footer>
  )
}
