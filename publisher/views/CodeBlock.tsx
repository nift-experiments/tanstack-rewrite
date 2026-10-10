import React from 'react'
import {defaultHighlighter} from '@tanstack/highlight'
import {renderCodeFence} from '@tanstack/highlight/markdown'
import {extractCodeBlockData} from './codeBlock.shared'
import {CodeBlockView} from './CodeBlockView'
export function CodeBlock(props:any){const {code,lang,title}=extractCodeBlockData(props);if(lang==='mermaid')throw Error('Mermaid requires its explicit rendering/interactive owner');const rendered=renderCodeFence({code,lang,title},defaultHighlighter);return <CodeBlockView {...props} copyText={rendered.copyText} htmlMarkup={rendered.htmlMarkup} lang={rendered.lang} title={rendered.title}/>}
