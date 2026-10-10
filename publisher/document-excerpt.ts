import {parseFragment} from 'parse5'
import type {BlockNode,InlineNode} from '@tanstack/markdown'
export function documentExcerpt(document: {children:Array<BlockNode>}, maxLength = 200) {
  const cleanText = excerptBlocks(document.children)
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanText.length > maxLength) {
    const end = cleanText.lastIndexOf(' ', maxLength)
    return cleanText.slice(0, end > 0 ? end : maxLength) + '...'
  }

  return cleanText
}
function excerptBlocks(blocks: Array<BlockNode>): string {
  return blocks
    .map((block): string => {
      switch (block.type) {
        case 'paragraph':
          return excerptInline(block.children)
        case 'blockquote':
        case 'callout':
        case 'component':
          return excerptBlocks(block.children)
        case 'list':
          return block.items
            .map((item) => excerptBlocks(item.children))
            .join(' ')
        default:
          return ''
      }
    })
    .join(' ')
}
function excerptInline(nodes: Array<InlineNode>): string {
  return nodes
    .map((node): string => {
      switch (node.type) {
        case 'text':
          return parseFragment(node.value.replaceAll('<', '&lt;'))
            .childNodes.map((child) => ('value' in child ? child.value : ''))
            .join('')
        case 'inlineCode':
          return node.value
        case 'link':
        case 'strong':
        case 'emphasis':
        case 'strike':
          return excerptInline(node.children)
        case 'break':
          return ' '
        default:
          return ''
      }
    })
    .join('')
}
