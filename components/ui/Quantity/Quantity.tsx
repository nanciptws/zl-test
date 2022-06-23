import React, { FC } from 'react'
import s from './Quantity.module.css'
import { Cross, Plus, Minus } from '@components/icons'
import cn from 'classnames'
export interface QuantityProps {
  value: number
  increase: () => any
  decrease: () => any
  handleRemove: React.MouseEventHandler<HTMLButtonElement>
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  max?: number
}

const Quantity: FC<QuantityProps> = ({
  value,
  increase,
  decrease,
  handleChange,
  handleRemove,
  max = 6,
}) => {
  return (
    <div className={s.item_actions}>
      <button className={s.action_button +" "+s.action_button_cross} onClick={handleRemove}>
        <Cross width={20} height={20} />
      </button>
      <label className={s.action_qty}>
        <input
          className={s.input}
          onChange={(e) =>
            Number(e.target.value) < max + 1 ? handleChange(e) : () => {}
          }
          value={value}
          type="number"
          max={max}
          min="0"
          readOnly
        />
      </label>
      <button
        type="button"
        onClick={decrease}
        style={{ marginLeft: '-1px' }}
        disabled={value <= 1}
        className={s.action_button}
      >
        <Minus width={18} height={18} />
      </button>
      <button
        type="button"
        onClick={increase}
        style={{ marginLeft: '-1px' }}
        disabled={value < 1 || value >= max}
        className={s.action_button}
      >
        <Plus width={18} height={18} />
      </button>
    </div>
  )
}

export default Quantity
