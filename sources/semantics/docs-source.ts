import {parse as parseYaml} from 'yaml'
type FrontMatterValue=any;type FrontMatterFile={content:string;data:Record<string,any>};
function replaceContent(text: string, frontmatter: FrontMatterFile) {
  let result = text
  const replace = frontmatter.data.replace
  if (replace) {
    Object.entries(replace).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value)
    })
  }

  return result
}

function replaceSections(text: string, frontmatter: FrontMatterFile) {
  let result = text
  // RegExp defining token pair to discover sections in the document
  // [//]: # (<Section Token>)
  const sectionMarkerRegex = /\[\/\/\]: # '([a-zA-Z\d]*)'/g
  const sectionRegex =
    /\[\/\/\]: # '([a-zA-Z\d]*)'[\S\s]*?\[\/\/\]: # '([a-zA-Z\d]*)'/g

  // Find all sections in origin file
  const substitutes = new Map<string, RegExpMatchArray>()
  for (const match of frontmatter.content.matchAll(sectionRegex)) {
    if (match[1] !== match[2]) {
      console.error(
        `Origin section '${match[1]}' does not have matching closing token (found '${match[2]}'). Please make sure that each section has corresponding closing token and that sections are not nested.`,
      )
    }

    substitutes.set(match[1], match)
  }

  // Find all sections in target file
  const sections = new Map<string, RegExpMatchArray>()
  for (const match of result.matchAll(sectionRegex)) {
    if (match[1] !== match[2]) {
      console.error(
        `Target section '${match[1]}' does not have matching closing token (found '${match[2]}'). Please make sure that each section has corresponding closing token and that sections are not nested.`,
      )
    }

    sections.set(match[1], match)
  }

  Array.from(substitutes.entries())
    .reverse()
    .forEach(([key, value]) => {
      const sectionMatch = sections.get(key)
      if (sectionMatch) {
        result =
          result.slice(0, sectionMatch.index!) +
          value[0] +
          result.slice(
            sectionMatch.index! + sectionMatch[0].length,
            result.length,
          )
      }
    })

  // Remove all section markers from the result
  result = result.replaceAll(sectionMarkerRegex, '')

  return result
}

function replaceProjectImageBranch(
  text: string,
  repoPair: string,
  ref: string,
) {
  const handleReplaceImageSrc = (src: string): string => {
    const srcLowered = src.toLowerCase()
    const isHttps = srcLowered.startsWith('https://')

    const testOrigin = isHttps
      ? 'https://raw.githubusercontent.com/'
      : 'http://raw.githubusercontent.com/'

    let validSrcOrigin: string | undefined

    if (srcLowered.startsWith(testOrigin)) {
      validSrcOrigin = testOrigin
    }

    // If the image src does not start with a known origin, return the src as is
    if (!validSrcOrigin) {
      return src
    }

    // If the image src does not contain the repo pair after the origin, return the src as is
    const repoIndex = srcLowered.indexOf(repoPair.toLowerCase())
    if (
      repoIndex === -1 ||
      src.indexOf(validSrcOrigin) + validSrcOrigin.length !== repoIndex
    ) {
      return src
    }

    // If the branch ref is the same as the target ref, return the src as is
    const refIndex = srcLowered.indexOf(ref.toLowerCase())
    if (refIndex !== -1 && refIndex === repoIndex + repoPair.length + 1) {
      return src
    }

    // We should only replace the branch ref if it is present and only immediately after the repo pair
    // It should NOT be replaced if it is further down the path.

    // Example: If the ref is "main" and the src is "https://github.com/TanStack/router/beta/docs/assets/beta.png"
    // then the replaced src should be "https://github.com/TanStack/router/main/docs/assets/beta.png"

    const branchIndex = repoIndex + repoPair.length + 1
    const nextSlashIndex = src.indexOf('/', branchIndex)
    const oldRef = src.slice(branchIndex, nextSlashIndex)
    const newSrc = src.replace(oldRef, ref)
    return newSrc
  }

  // find all instances of markdown inline images
  const markdownInlineImageRegex = /!(\[([^\]]+)]\(([^)]+)\))/g
  const inlineMarkdownImageMatches = text.matchAll(markdownInlineImageRegex)
  for (const match of inlineMarkdownImageMatches) {
    const [fullMatch, _, __, src] = match
    const newSrc = handleReplaceImageSrc(src)

    // No need to replace the src if it is the same as the original
    if (newSrc === src) {
      continue
    }

    const replacement = fullMatch.replace(src, newSrc)
    text = text.replace(fullMatch, replacement)
  }

  // find all instances of markdown html images
  const markdownImageHtmlTagRegex = /<img[^>]+>/g
  const htmlImageTagMatches = text.matchAll(markdownImageHtmlTagRegex)
  for (const match of htmlImageTagMatches) {
    const [fullMatch] = match

    // Match the src attribute on the img tag
    // The src could be wrapped with single or double quotes
    const src =
      fullMatch.match(/src='([^']+)'/)?.[1] ||
      fullMatch.match(/src="([^"]+)"/)?.[1]

    if (!src) {
      continue
    }

    const newSrc = handleReplaceImageSrc(src)

    // No need to replace the src if it is the same as the original
    if (newSrc === src) {
      continue
    }

    const replacement = fullMatch.replace(src, newSrc)
    text = text.replace(fullMatch, replacement)
  }

  return text
}

function parseFrontMatter(content: string) {
  const normalizedContent = content.replace(/^\uFEFF/, '')

  if (!normalizedContent.startsWith('---')) {
    return { content, data: {} }
  }

  const lines = normalizedContent.split(/\r?\n/)
  const closingLineIndex = lines.findIndex(
    (line, index) => index > 0 && line.trim() === '---',
  )

  if (closingLineIndex === -1) {
    return { content, data: {} }
  }

  const frontMatterSource = lines.slice(1, closingLineIndex).join('\n')
  const body = lines.slice(closingLineIndex + 1).join('\n')

  let parsed: unknown
  try {
    parsed = parseYaml(frontMatterSource)
  } catch (e) {
    console.warn('Failed to parse frontmatter YAML:', e)
    return { content: body, data: {} }
  }

  return {
    content: body,
    data: isRecord(parsed) ? normalizeFrontMatterData(parsed) : {},
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeFrontMatterData(data: Record<string, unknown>) {
  const normalized: Record<string, FrontMatterValue | undefined> = {}

  for (const [key, value] of Object.entries(data)) {
    normalized[key] = toFrontMatterValue(value)
  }

  return normalized
}

function toFrontMatterValue(value: unknown): FrontMatterValue | undefined {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return value
  }

  if (Array.isArray(value)) {
    const normalized: Array<FrontMatterValue> = []
    for (const item of value) {
      const normalizedItem = toFrontMatterValue(item)
      if (normalizedItem !== undefined) {
        normalized.push(normalizedItem)
      }
    }
    return normalized
  }

  if (isRecord(value)) {
    const normalized: Record<string, FrontMatterValue> = {}
    for (const [key, item] of Object.entries(value)) {
      const normalizedItem = toFrontMatterValue(item)
      if (normalizedItem !== undefined) {
        normalized[key] = normalizedItem
      }
    }
    return normalized
  }

  return undefined
}
export {replaceContent,replaceSections,replaceProjectImageBranch,parseFrontMatter};
