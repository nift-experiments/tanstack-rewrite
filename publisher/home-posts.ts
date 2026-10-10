import {getVisiblePosts,sortBlogCardPosts,postToBlogCardPost} from '../services/backend/src/utils/blog'
export const recentPosts=sortBlogCardPosts(getVisiblePosts().map(postToBlogCardPost)).slice(0,3).map(({slug,title,published,excerpt,headerImage,authors,externalUrl,source})=>({slug,title,published,excerpt,headerImage,authors,externalUrl,source}))
