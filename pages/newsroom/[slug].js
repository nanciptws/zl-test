import { RichText } from "prismic-reactjs";
import { linkResolver, prismic_fetch_query } from "prismic-configuration"
import { Layout } from '@components/common'
import cn from "classnames";
import s from './blog.module.css'
import Link from "@components/ui/Link";
import Head from 'next/head'
import $ from 'jquery'
import CustomLink from "@components/common/CustomLink";

export default function Page({blog_post}){
    return(
        <div className={s.single_post}>
            <Head>
                <title>{blog_post.data.meta_title}</title>
                <meta 
                    name='title' 
                    content={blog_post.data.meta_title}
                    key="title"
                  />
                  <meta 
                    name='description' 
                    content={blog_post.data.meta_description}
                    key="description"
                  />
                  <meta 
                    property='og:title' 
                    content={blog_post.data.meta_title}
                    key="og:title"
                  />
                  <meta 
                    property='og:description' 
                    content={blog_post.data.meta_description}
                    key="og:description"
                  />
            </Head>
		<div className={cn(s.top_banner, s.align_center, s.full_bg, s.gray_bg)} style={{ backgroundImage: `url(${blog_post.data.banner_image.url})` }}>
			<div className="container">
				<div className={cn(s.text_light, "h1", s.noMargin)}> { blog_post.data.banner_title } </div>
				<p className={cn(s.lead, s.text_light, "text_light")}>{ blog_post.data.banner_desc }</p>
			</div>
		</div>
		<div className={s.single_post_inner}>
			<div className="container">
				<div className={s.eight}>
					<h1>{blog_post.data.title}</h1>
                	<h2>{blog_post.data.sort_description}</h2>
                	{blog_post.data.body.map((text,i)=>(
                        <div key={i}>
                            {text.slice_type == "text" ? <div> <RichText render={text.primary.text} serializeHyperlink={linkResolver} /></div>: "" }
                            {text.slice_type == "quote" ? <div className={s.quote}> <RichText render={text.primary.quote} serializeHyperlink={linkResolver} /></div>: "" }
                            {text.slice_type == "image" ? <div> <img width="auto" loading="lazy" alt={blog_post.data.title} src={text.primary.image.url} /> </div>: "" }
                        </div>
                    ))}
                	
                	<p className="back_link">
                      <CustomLink href="/newsroom/" title="ZOLEO Newsroom">Back to the Newsroom &gt;</CustomLink>
                  </p>
				</div>
			</div>
		</div>
	</div>
    )
}

export async function getServerSideProps(context){

  console.log('context')
  console.log(context)

  const return_data = await prismic_fetch_query(context.locale, 'blog_post', context.params.slug);
	return {
		props: {
			menu:return_data[0],
			footer:return_data[1],
			blog_post:return_data[2]
		}
	}
}

Page.Layout = Layout