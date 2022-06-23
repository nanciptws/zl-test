import Link from 'next/link'
import { useRouter } from 'next/router';
import { site_url } from 'prismic-configuration';

const CustomLink = ( params:any ) => {
  const cus_Href:any = params['href'];  
  const className:any = params['className'];  
  const extraLink = params['extraLink'];
  const title = params['title'];
  let web_url = "#";
  let href_target = "_self";
  let href_rel = "";
  const locale = useRouter().locale;

  if(cus_Href){
    if(cus_Href.link_type == "Document"){
      if(extraLink){
        web_url = "/"+locale+"/"+extraLink+""+cus_Href.uid;
      }else{
        if(cus_Href.type == "product"){
          web_url = "/"+locale+"/product/"+""+cus_Href.uid;
        }
        else{
          web_url = "/"+locale+"/"+""+cus_Href.uid;
        }
      }
    } else if(cus_Href.link_type == "Web"){
      
      web_url = cus_Href.url;
      if(cus_Href.target){
        href_target = '_blank';
        href_rel = "noopener noreferrer follow";  
      }
      
    }
    else if(cus_Href.link_type == "Any"){
      web_url = "#";
    }
    else{

      if(extraLink){
        web_url = "/"+locale+"/"+extraLink+""+cus_Href;
      }else{
        web_url = "/"+locale+cus_Href
      }

    }
  }

  return (
    <Link href={web_url}>
      <a href={web_url} className={className} title={title} target={href_target} rel={href_rel}>{params.children}</a>
    </Link>
  )
}
export default CustomLink
