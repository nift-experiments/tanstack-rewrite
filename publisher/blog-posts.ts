import {allPosts} from 'content-collections'
import {normalizeBlogAuthors,formatAuthors,formatPublishedDate,getBlogAuthorIdentities,isBlogPostUnpublished} from '../services/backend/src/utils/blog-format'
import {allMaintainers} from '../frontend/retained/src/libraries/maintainers'
// Same published article envelope as the pinned fetchBlogPost handler. The
// authoritative Markdown remains in sources/site/blog; body projection belongs
// to publication, with no browser Markdown parser or serialized body AST.
export const blogPosts=allPosts.map((post:any)=>{const authors=normalizeBlogAuthors(post.authors);return {authorIdentities:getBlogAuthorIdentities(authors,allMaintainers),authors,content:`<small><em>by ${formatAuthors(authors)} on ${formatPublishedDate(post.published||'1970-01-01')}.</em></small>\n\n${post.content}`,description:post.excerpt,filePath:`src/blog/${post.slug}.md`,headerImage:post.headerImage,isUnpublished:isBlogPostUnpublished(post),headerVideo:post.headerVideo,headerVideoCaptions:post.headerVideoCaptions,library:post.library,published:post.published,slug:post.slug,title:post.title,updated:post.updated}})
