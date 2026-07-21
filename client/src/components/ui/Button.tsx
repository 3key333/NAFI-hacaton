import style from './button.module.scss'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  type?: 'button' | 'submit'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${style.btn} ${style[`btn--${variant}`]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
