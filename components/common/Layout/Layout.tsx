import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CommerceProvider } from '@framework'
import { useUI } from '@components/ui/context'
import type { Page } from '@commerce/types/page'
import { Navbar, Footer } from '@components/common'
import ShippingView from '@components/checkout/ShippingView'
import CartSidebarView from '@components/cart/CartSidebarView'
import { Sidebar, Modal, LoadingDots } from '@components/ui'
import PaymentMethodView from '@components/checkout/PaymentMethodView'
import CheckoutSidebarView from '@components/checkout/CheckoutSidebarView'
import LoginView from '@components/auth/LoginView'


const Loading = () => (
  <div className="w-80 h-80 flex items-center text-center justify-center p-3">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}


interface Props {
  pageProps: {
    pages?: Page[],
    menu: any,
    footer: any,
    without_head: any
  }
}


const SidebarView: FC<{ sidebarView: string; closeSidebar(): any }> = ({
  sidebarView,
  closeSidebar,
}) => {
  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === 'CART_VIEW' && <CartSidebarView />}
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
      {sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
    </Sidebar>
  )
}

const SidebarUI: FC = () => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView sidebarView={sidebarView} closeSidebar={closeSidebar} />
  ) : null
}

const Layout: FC<Props> = ({
  children,
  pageProps: { ...pageProps },
}) => {
  const { locale = 'en-gb' } = useRouter()

  let remove_header_footer = false;

  if(pageProps.without_head){
    const is_data = pageProps.without_head.data.remove_header_footer
    if(is_data !== null && typeof(is_data) !== 'undefined' && is_data == true){
      remove_header_footer = true;
    }
  }

  return (
    <CommerceProvider locale={locale}>
      <div>
        {remove_header_footer === false ? <Navbar menu={pageProps.menu}  />:""}
        <main className="fit">{children}</main>
        {remove_header_footer === false ? <Footer footer={pageProps.footer} /> :""}
        <SidebarUI />
      </div>
    </CommerceProvider>
  )
}

export default Layout
