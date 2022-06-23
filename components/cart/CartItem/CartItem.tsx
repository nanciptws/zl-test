import { ChangeEvent, FocusEventHandler, useEffect, useState } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import s from './CartItem.module.css'
import { Trash, Plus, Minus, Cross } from '@components/icons'
import { useUI } from '@components/ui/context'
import type { LineItem } from '@commerce/types/cart'
import usePrice from '@framework/product/use-price'
import useUpdateItem from '@framework/cart/use-update-item'
import useRemoveItem from '@framework/cart/use-remove-item'
import Quantity from '@components/ui/Quantity'

type ItemOption = {
  name: string
  nameId: number
  value: string
  valueId: number
}

const CartItem = ({
  item,
  variant = 'default',
  currencyCode,
  ...rest
}: {
  variant?: 'default' | 'display'
  item: LineItem
  currencyCode: string
}) => {
  const { closeSidebarIfPresent } = useUI()
  const [removing, setRemoving] = useState(false)
  const [quantity, setQuantity] = useState<number>(item.quantity)
  const removeItem = useRemoveItem()
  const updateItem = useUpdateItem({ item })

  const { price } = usePrice({
    amount: item.variant.price * item.quantity,
    baseAmount: item.variant.listPrice * item.quantity,
    currencyCode,
  })

  const handleChange = async ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(value))
    await updateItem({ quantity: Number(value) })
  }

  const increaseQuantity = async (n = 1) => {
    const val = Number(quantity) + n
    setQuantity(val)
    await updateItem({ quantity: val })
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await removeItem(item)
    } catch (error) {
      setRemoving(false)
    }
  }

  // TODO: Add a type for this
  const options = (item as any).options

  useEffect(() => {
    // Reset the quantity state if the item quantity changes
    if (item.quantity !== Number(quantity)) {
      setQuantity(item.quantity)
    }
    // TODO: currently not including quantity in deps is intended, but we should
    // do this differently as it could break easily
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.quantity])

  return (
    <li
      className={s.cart_item+" "+ (removing ? s.removing_product : "") }
      {...rest}
    >
      <div className={s.li_product}>
        <div className={s.li_product_image}>
          <Link href={`/product/${item.path}`}>
            <Image
              onClick={() => closeSidebarIfPresent()}
              className={s.productImage}
              width={150}
              height={150}
              src={item.variant.image!.url}
              alt={item.variant.image!.altText}
              unoptimized
            />
          </Link>
        </div>
        <div className={s.li_product_details}>
          <Link href={`/product/${item.path}`}>
            <span onClick={() => closeSidebarIfPresent()}>
              {item.name}
            </span>
          </Link>
          {options && options.length > 0 && (
            <div>
              {options.map((option: ItemOption, i: number) => (
                <div key={`${item.id}-${option.name}`}>
                  {option.name}
                  <span>{option.value}</span>
                </div>
              ))}
            </div>
          )}
          {variant === 'display' && (
            <div>{quantity}x</div>
          )}
        </div>
        <div className={s.li_product_price}>
          <span>{price}</span>
        </div>
      </div>
      {variant === 'default' && (
        <Quantity
          value={quantity}
          handleRemove={handleRemove}
          handleChange={handleChange}
          increase={() => increaseQuantity(1)}
          decrease={() => increaseQuantity(-1)}
        />
      )}
    </li>
  )
}

export default CartItem
