import fs from 'node:fs'
import path from 'node:path'
import {parse as parseYaml} from 'yaml'
import {z} from 'zod'
import {libraryIds} from '../frontend/retained/src/libraries/ids'
import {normalizeRedirectFrom} from '../frontend/retained/src/utils/redirects'
const libraryIdSet=new Set<string>(libraryIds)
const schema=z.object({title:z.string(),published:z.iso.date(),updated:z.iso.date().optional(),draft:z.boolean().optional(),rss:z.boolean().optional(),excerpt:z.string(),authors:z.string().array(),library:z.string().refine(value=>{const ids=value.split(',').map(id=>id.trim()).filter(Boolean);return ids.length>0&&ids.every(id=>libraryIdSet.has(id))}).optional(),headerImage:z.string().optional(),headerVideo:z.string().optional(),headerVideoCaptions:z.string().optional(),content:z.string(),redirect_from:z.string().array().optional()}).refine(post=>!post.updated||post.updated>=post.published)
export function projectPosts(directory:string){
 return fs.readdirSync(directory).filter(name=>name.endsWith('.md')).sort().map(file=>{
  const raw=fs.readFileSync(path.join(directory,file),'utf8'),front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if(!front)throw Error('Missing blog frontmatter: '+file)
  const {content,...post}=schema.parse({...parseYaml(front[1]),content:raw.slice(front[0].length).trim()})
  const headerImage=post.headerImage??content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2]
  const redirectFrom=normalizeRedirectFrom(post.redirect_from)
  const slug=file.slice(0,-3)
  return {...post,_meta:{filePath:file,fileName:file,directory:'.',extension:'md',path:slug},slug,headerImage,redirect_from:redirectFrom,redirectFrom,content}
 })
}
