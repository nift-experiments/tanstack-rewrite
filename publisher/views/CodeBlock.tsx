import React from 'react'
import {defaultHighlighter} from '@tanstack/highlight'
import {renderCodeFence} from '@tanstack/highlight/markdown'
import {extractCodeBlockData} from './codeBlock.shared'
import {MermaidIsland} from './MermaidIsland'
import {CodeBlockView} from './CodeBlockView'
export function CodeBlock(props:any){const {code,lang,title}=extractCodeBlockData(props);if(lang==='mermaid')return <MermaidIsland className={props.className} code={code} isEmbedded={props.isEmbedded} showTypeCopyButton={props.showTypeCopyButton} style={props.style} title={title}/>;const rendered=renderCodeFence({code,lang,title},defaultHighlighter);return <CodeBlockView {...props} copyText={rendered.copyText} htmlMarkup={rendered.htmlMarkup} lang={rendered.lang} title={rendered.title}/>}
