import {canonicalUrl,seo} from 'retained-ui/utils/seo'
import {ogImageUrl} from 'retained-ui/utils/og'
import {findLibrary} from 'retained-ui/libraries'
import {appendPathToDocsHref} from 'retained-ui/utils/docs-redirects'
import {capitalize} from 'retained-ui/utils/utils'
import {notFound} from '@tanstack/react-router'
const ordinaryDocsHead=({ loaderData, params }) => {
    const { libraryId, version, _splat: docsPath } = params
    const library = findLibrary(libraryId)

    if (!library) {
      throw notFound()
    }

    const frameworkVariantLinks = (loaderData?.frameworks ?? []).map(
      (framework) => ({
        rel: 'alternate',
        type: 'text/markdown',
        href: `/${libraryId}/${version}/docs/${docsPath}.md?framework=${framework}`,
      }),
    )

    const canonicalHref = canonicalUrl(
      loaderData?.canonicalPathOverride ??
        appendPathToDocsHref({ docsPath: docsPath ?? '', libraryId, version }),
    )

    return {
      meta: [
        ...seo({
          title: loaderData?.title
            ? `${loaderData.title} | ${library.name} Docs`
            : `${library.name} Docs`,
          description: loaderData?.description,
          keywords: loaderData?.keywords,
          image: ogImageUrl(library.id, {
            title: loaderData?.title,
            description: loaderData?.description,
          }),
          noindex: library.visible === false,
        }),
        { property: 'og:url', content: canonicalHref },
        { name: 'twitter:url', content: canonicalHref },
      ],
      links: [
        { rel: 'canonical', href: canonicalHref },
        ...frameworkVariantLinks,
      ],
    }
  }
const frameworkDocsHead=(ctx) => {
    const { libraryId, version, framework, _splat: docsPath } = ctx.params
    const library = findLibrary(libraryId)

    if (!library) {
      throw notFound()
    }

    const tail = `${library.name} ${capitalize(framework)} Docs`

    const canonicalHref = canonicalUrl(
      ctx.loaderData?.canonicalPathOverride ??
        appendPathToDocsHref({
          docsPath: `framework/${framework}/${docsPath ?? ''}`,
          libraryId,
          version,
        }),
    )

    return {
      meta: [
        ...seo({
          title: ctx.loaderData?.title
            ? `${ctx.loaderData.title} | ${tail}`
            : tail,
          description: ctx.loaderData?.description,
          keywords: ctx.loaderData?.keywords,
          image: ogImageUrl(library.id, {
            title: ctx.loaderData?.title,
            description: ctx.loaderData?.description,
          }),
          noindex: library.visible === false,
        }),
        { property: 'og:url', content: canonicalHref },
        { name: 'twitter:url', content: canonicalHref },
      ],
      links: [{ rel: 'canonical', href: canonicalHref }],
    }
  }
export function publicationDocsHead(record:any,params:any){return (params.framework?frameworkDocsHead:ordinaryDocsHead)({params,loaderData:record})}

import {getLibrary} from 'retained-ui/libraries'
export function publicationLandingHead(libraryId: any) {
  const library = getLibrary(libraryId)

  return {
    meta: seo({
      title:
        libraryId === 'start'
          ? 'TanStack Start | Full-stack React and Solid Framework'
          : library.name,
      description: library.description,
      image: ogImageUrl(library.id),
      noindex: library.visible === false,
    }),
  }
}
