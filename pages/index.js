import { linkResolver, prismic_fetch_query } from '../prismic-configuration'
import { Layout } from '@components/common'
import { RichText } from 'prismic-reactjs'
import React, { useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import s from './css/home.module.css'
import Link from '@components/ui/Link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import $ from 'jquery'
import CustomLink from '@components/common/CustomLink'
import Script from 'next/script'


export default function Home({ page_content, password_protection }) {
  return (<h1>Home</h1>)
}
