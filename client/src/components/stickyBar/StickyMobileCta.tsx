import { useConnection } from '@/redux/hooks/useConnection'
import { calculatePrice, formatPrice } from '@/helpers/priceCalculator'
import { Button } from '@/components/ui/Button'
import style from './stickyMobileCta.module.scss'

export const StickyMobileCta = () => {
  const { config, openWizard } = useConnection()
  const price = calculatePrice(config)

  return (
    <div className={style.sticky}>
      <div className={style.sticky__price}>
        <span>от</span>
        <strong>{formatPrice(price.total)}</strong>
      </div>
      <Button onClick={openWizard}>Подключить</Button>
    </div>
  )
}
