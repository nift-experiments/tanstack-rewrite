import {DocComponentHost} from './DocComponentHost'
import {findFirstImageSrc} from '../../frontend/retained/src/utils/markdown/findFirstImageSrc'
import React from 'react'
import {renderMarkdownReact} from '@tanstack/markdown/react'
import {InlineCode} from './InlineCode'
import {MarkdownImg} from './MarkdownImg'
import {MarkdownLink} from './MarkdownLink'
import {CodeBlock} from './CodeBlock'
import {CommentTabs,TabPanel,FrameworkPanel,PendingComponentPolicy} from './CommentTabs'
const headings=Object.fromEntries(['h1','h2','h3','h4','h5','h6'].map(level=>[level,({className,id,children,...props}:any)=>React.createElement(level,{id,className:`${className??''} block scroll-my-20 lg:scroll-my-4`,...props},children)]))
function Link(props:any){return props.className?.includes('anchor-heading')?<a {...props}/>:<MarkdownLink {...props}/>}
function Code({className,...props}:any){return className?.includes('language-')?<code className={className} {...props}/>:<InlineCode className={className} {...props}/>}
function Table({className,...props}:any){return <div className="w-full max-w-full overflow-x-auto"><table className={['min-w-full',className].filter(Boolean).join(' ')} {...props}/></div>}
function LiveComponent(props:any){return <DocComponentHost kind="live-example" properties={props}>{props.children}</DocComponentHost>}
export function Document({document,eagerFirstImage=false}:any){const firstImageSrc=eagerFirstImage?findFirstImageSrc(document):undefined;function Img(props:any){return <MarkdownImg {...props} priority={firstImageSrc!==undefined&&props.src===firstImageSrc}/>}return renderMarkdownReact(document,{allowHtml:true,headingAnchors:{ariaHidden:true,className:'anchor-heading anchor-heading-link',content:'#',tabIndex:-1},components:{...headings,a:Link,code:Code,pre:CodeBlock,img:Img,table:Table,figure:({children}:any)=><>{children}</>,figcaption:()=>null,'md-live-example':LiveComponent,'md-comment-component':CommentTabs,'md-tab-panel':TabPanel,'md-framework-panel':FrameworkPanel}})}
