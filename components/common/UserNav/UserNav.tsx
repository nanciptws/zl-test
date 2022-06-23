import { FC } from 'react'
import useCustomer from '@framework/customer/use-customer'
import DropdownMenu from './DropdownMenu'

const UserNav: any = (content:any) => {
  const { data: customer } = useCustomer()  
  return (
    <>
    {process.env.COMMERCE_CUSTOMERAUTH_ENABLED && (
      <>
      { customer ? ( <DropdownMenu /> ) : (
        <li>
          <a href={content['data-href']} className="icon">
            <span className={content['data-title']}></span>
          </a>
        </li>
      )}
      </>
    )}</>
  )
}

export default UserNav
