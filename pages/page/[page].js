import { RichText } from "prismic-reactjs";
import Prismic from 'prismic-javascript'
import { Client } from "prismic-configuration"
import { I18nWidget, Layout } from '@components/common'
import $ from 'jquery'

export default function Page({page}){
    return(
        <div className="container">
            <I18nWidget data_type="drp" />
            <b>{RichText.render(page.data.title)}</b>
            <p className="card-text">{RichText.render(page.data['desc'])}</p>
        </div>
    )
}
export async function getServerSideProps(context){
    const menu = await Client().query(Prismic.Predicates.at('document.type', 'menu'))
    const footer = await Client().query(Prismic.Predicates.at('document.type', 'footer'))
    const page = await Client().getByUID('page',context.query.page, { lang: context.locale });
    return {
        props: {
            menu:menu,
            footer:footer,
            page:page
        }
    }
}
Page.Layout = Layout