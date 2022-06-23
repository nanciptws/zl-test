import cn from 'classnames'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import s from './ProductView.module.css'
import { FC } from 'react'
import type { Product } from '@commerce/types/product'
import usePrice from '@framework/product/use-price'
import { WishlistButton } from '@components/wishlist'
import { ProductSlider, ProductCard } from '@components/product'
import ProductTag from '../ProductTag'
import ProductSidebar from '../ProductSidebar'
import { RichText } from 'prismic-reactjs'
import { Button, useUI, Container, Text } from '@components/ui'
import Head from 'next/head'


import { useAddItem } from '@framework/cart'
import { useEffect, useState } from 'react'

import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
interface ProductViewProps {
  product: Product
  productContent: any
  relatedProducts: Product[]
}

const ProductView: FC<ProductViewProps> = ({ product, productContent, relatedProducts }) => {
  const { price } = usePrice({
    amount: product.price.value,
    baseAmount: product.price.retailPrice,
    currencyCode: product.price.currencyCode!,
  })

  const addItem = useAddItem()
  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem({
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0].id),
      })
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={s.productView}>
        <Head>
            <title>{productContent.data.meta_title}</title>
            <meta 
                name='title' 
                content={productContent.data.meta_title}
                key="title"
              />
              <meta 
                name='description' 
                content={productContent.data.meta_description}
                key="description"
              />
              <meta 
                property='og:title' 
                content={productContent.data.meta_title}
                key="og:title"
              />
              <meta 
                property='og:description' 
                content={productContent.data.meta_description}
                key="og:description"
              />
          </Head>
        <div className={s.prod_view_mn}>
          <div className="container">
            <h1 className={s.productView_title}>{productContent.data.title}</h1>
            <div className={s.productView_images}>
              <div className={s.productView_image}>
              <ProductSlider key={product.id}>
                {product.images.map((image, i) => (
                  <div key={image.url}>
                    
                      <Image
                        src={image.url!}
                        alt={image.alt || 'Product Image'}
                        width={600}
                        height={600}
                        priority={i === 0}
                        quality="85"
                      />
                    
                  </div>
                ))}
                </ProductSlider>
              </div>
            </div>
            <div className={s.productView_details}>
              <div className={s.productView_product}>
                <div className={s.price_section}>
                  <ProductTag
                    className={s.p_price}
                    name={product.name}
                    price={`${price} ${product.price?.currencyCode}`}
                  />
                </div>
                <div className={s.buy_btn_section}>
                  <div className={s.Quantity_item_actions}>
                        <label className={s.Quantity_action_qty}>
                          <input type="number" />
                        </label>
                        <button type="button" className={s.Quantity_action_button}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </button>
                        <button type="button" className={s.Quantity_action_button}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </button>
                    </div>
                {process.env.COMMERCE_CART_ENABLED && (
                    <Button
                      aria-label={productContent.data.add_to_cart_button}
                      type="button"
                      className={"btn green_btn "+s.add_cart}
                      onClick={addToCart}
                      loading={loading}
                      disabled={variant?.availableForSale === false}
                    >
                      {variant?.availableForSale === false
                        ? 'Not Available'
                        : productContent.data.add_to_cart_button }
                    </Button>
                  )}
                </div>
                <div className={s.productView_description}>
                  <div className={s.contents}>
                    {RichText.render(productContent.data.product_desc)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.productView_Additionals} style={{ backgroundImage : `url(${productContent.data.section_back_image.url})` }}>
          <div className="container">
            {productContent.data.body.map((body: any, bi: number) => (
              <span key={bi} className={s.pro_desc}>
                {body.slice_type == 'product_description_title' ? (
                  <h2 className={s.text_center}>{body.primary.head_title}</h2>
                ) : ('')}

                {body.slice_type == 'product_description_content' ? (
                  <>
                    {body.items.map((pdata: any, biii: number) => (
                      <div key={biii} className={s.specs_mn}>
                        <div className={s.specs_list}>
                          <div className={s.specs_left}>
                            <span>{pdata.content_title}</span>
                            { JSON.stringify(pdata.product_images) !== "{}" ? <img src={pdata.product_images.url + '&w=300&q=80'} alt={pdata.product_images.alt} loading="lazy" width="auto" /> : "" }

                            <div className={s.specs_right + ' ' + s.contents + ' ' +s.specs_left_content}>
                              {RichText.render(pdata.content_left_desc)}  
                            </div>

                            
                          </div>
                          <div className={s.specs_right + ' ' + s.contents}>
                            {RichText.render(pdata.content_desc)}
                          </div>
                        </div>
                        <hr className={s.specs_hr} />
                      </div>
                    ))}
                  </>
                ) : (
                  ''
                )}
              </span>
            ))}

            <div></div>
          </div>
        </div>
        <div className={s.related_products +" related_products"}>
          <div className="container">
            <div className={s.title}>
            <h2>Related Products</h2></div>
            <div className={s.relatedProductsGrid + ' slider_related '+ s.slider_related}>
              {relatedProducts.map((p) => (
                <div
                  key={p.path}
                  className={s.list_prod +" list_prod"}
                >
                  <ProductCard
                    noNameTag
                    product={p}
                    key={p.path}
                    variant="simple"
                    className="prod_item"
                    imgProps={{
                      width: 300,
                      height: 300,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <NextSeo
        title={productContent.data.title}
        description={RichText.asText(productContent.data.product_desc)}
        openGraph={{
          type: 'website',
          title: productContent.data.title,
          description: RichText.asText(productContent.data.product_desc),
          images: [
            {
              url: product.images[0]?.url!,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
      />
    </>
  )
}

export default ProductView