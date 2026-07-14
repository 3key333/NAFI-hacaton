import style from './sectionTitle.module.scss'

interface SectionTitleProps {
  title: string
  subtitle?: string
  center?: boolean
}

export const SectionTitle = ({ title, subtitle, center = true }: SectionTitleProps) => {
  return (
    <div className={`${style.title} ${center ? style['title--center'] : ''}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}
