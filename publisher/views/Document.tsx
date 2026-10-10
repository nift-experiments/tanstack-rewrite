import React from 'react'
import {renderMarkdownReact} from '@tanstack/markdown/react'
import {InlineCode} from './InlineCode'
import {MarkdownImg} from './MarkdownImg'
import {MarkdownLink} from './MarkdownLink'
import {CodeBlock} from './CodeBlock'
import {CommentTabs,TabPanel} from './CommentTabs'
const headings=Object.fromEntries(['h1','h2','h3','h4','h5','h6'].map(level=>[level,({className,id,children,...props}:any)=>React.createElement(level,{id,className:`${className??''} block scroll-my-20 lg:scroll-my-4`,...props},children)]))
function Link(props:any){return props.className?.includes('anchor-heading')?<a {...props}/>:<MarkdownLink {...props}/>}
function Code({className,...props}:any){return className?.includes('language-')?<code className={className} {...props}/>:<InlineCode className={className} {...props}/>}
function Table({className,...props}:any){return <div className="w-full max-w-full overflow-x-auto"><table className={['min-w-full',className].filter(Boolean).join(' ')} {...props}/></div>}
function PendingComponent(props:any){throw Error('Explicit component owner pending: '+props['data-component'])}
export function Document({document}:any){return renderMarkdownReact(document,{allowHtml:true,headingAnchors:{ariaHidden:true,className:'anchor-heading anchor-heading-link',content:'#',tabIndex:-1},components:{...headings,a:Link,code:Code,pre:CodeBlock,img:MarkdownImg,table:Table,figure:({children}:any)=><>{children}</>,figcaption:()=>null,'md-comment-component':CommentTabs,'md-tab-panel':TabPanel}})}
