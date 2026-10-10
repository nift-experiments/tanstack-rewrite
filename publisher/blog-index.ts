import {getVisiblePosts,postToBlogCardPost,sortBlogCardPosts} from '../services/backend/src/utils/blog'
import {getExternalBlogPosts} from '../services/backend/src/utils/external-blog-posts.server'
// Exact original aggregation; publication compilation is independent of the API.
export async function getBlogIndexPosts(){return sortBlogCardPosts([...getVisiblePosts().map(postToBlogCardPost),...await getExternalBlogPosts()])}

export {configureExternalBlogTransport} from '../services/backend/src/server/publication/blog-transport.server'
