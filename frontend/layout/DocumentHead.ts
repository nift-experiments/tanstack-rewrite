import type * as React from 'react'
import {defaultStringifySearch} from '@tanstack/react-router'
import {canonicalUrl,getCanonicalPath,seo,shouldIndexPath} from 'retained-ui/utils/seo'
import {getTanStackHomepageJsonLd} from 'retained-ui/utils/organization-structured-data'
import ogImage from 'retained-ui/images/og.png'
import {createThemeCss,type HighlightTheme} from '@tanstack/highlight/theme'
import {auroraXTheme} from '@tanstack/highlight/themes/aurora-x'
import {githubLightTheme} from '@tanstack/highlight/themes/github-light'
const THEME_COLORS={light:'#eeebd4',dark:'#111111'} as const
const GOOGLE_ANALYTICS_ID = 'G-JMT1Z50SPS';
const GOOGLE_ANALYTICS_PROXY_PREFIX = '/_a';
const GOOGLE_ANALYTICS_SCRIPT_SRC = `${GOOGLE_ANALYTICS_PROXY_PREFIX}/gtag.js`;
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('theme')||'auto';var v=['light','dark','auto'].includes(t)?t:'auto';var r=v==='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):v;if(document.documentElement){document.documentElement.classList.add(r);if(v==='auto')document.documentElement.classList.add('auto');document.documentElement.style.colorScheme=r}}catch(e){if(document.documentElement){var r=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(r,'auto');document.documentElement.style.colorScheme=r}}})()`;
const GOOGLE_ANALYTICS_BOOTSTRAP = `(function(){if(window.__tanstackGaBootstrapped)return;window.__tanstackGaBootstrapped=true;var id='${GOOGLE_ANALYTICS_ID}';var src='${GOOGLE_ANALYTICS_SCRIPT_SRC}';window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',id,{send_page_view:false,transport_url:window.location.origin+'${GOOGLE_ANALYTICS_PROXY_PREFIX}'});var loaded=false;var load=function(){if(loaded)return;var parent=document.head||document.documentElement;if(!parent){window.setTimeout(load,100);return}loaded=true;var script=document.createElement('script');script.async=true;script.src=src;script.setAttribute('data-ga-loader','true');parent.appendChild(script)};if(typeof window.requestIdleCallback==='function'){window.requestIdleCallback(load,{timeout:3000});return}if(document.readyState==='complete'){window.setTimeout(load,1500);return}window.addEventListener('load',function(){window.setTimeout(load,1500)},{once:true})})();`;
const tanstackNeutralDarkTheme = {
  ...auroraXTheme,
  background: '#111111',
  foreground: '#d4d4d4',
  name: 'tanstack-neutral-dark',
  tokens: {
    ...auroraXTheme.tokens,
    comment: '#a3a3a3',
    meta: '#737373',
    token: '#d4d4d4',
  },
} satisfies HighlightTheme;
const HIGHLIGHT_THEME_CSS = createThemeCss({
  light: githubLightTheme,
  dark: tanstackNeutralDarkTheme,
  darkSelector: '.dark',
});
type CanonicalHeadMatch = {
  pathname: string
  search: Record<string, unknown>
  staticData?: {
    includeSearchInCanonical?: boolean
    ownsCanonicalLink?: boolean
  }
}
function getCanonicalHeadTags(matches: ReadonlyArray<CanonicalHeadMatch>): {
  links: Array<React.JSX.IntrinsicElements['link']>
  meta: Array<React.JSX.IntrinsicElements['meta']>
} {
  const lastMatch = matches[matches.length - 1]
  const canonicalPath = lastMatch?.pathname ?? '/'
  const includeSearchInCanonical = matches.some(
    (match) => match.staticData?.includeSearchInCanonical === true,
  )
  // Routes whose canonical depends on loader data (e.g. old-version docs
  // canonicalizing to /latest) emit their own URL tags from their head().
  // The root must not also emit them — the router does not dedupe links, and
  // this head only sees pre-loader match snapshots, so it can't compute the
  // override itself.
  const ownsCanonicalLink = matches.some(
    (match) => match.staticData?.ownsCanonicalLink === true,
  )
  const canonicalSearch =
    includeSearchInCanonical && lastMatch
      ? defaultStringifySearch(lastMatch.search)
      : ''
  const preferredCanonicalPath = getCanonicalPath(canonicalPath)
  const pageUrl = canonicalUrl(
    preferredCanonicalPath ?? canonicalPath,
    canonicalSearch,
  )

  return {
    links:
      preferredCanonicalPath && !ownsCanonicalLink
        ? [
            {
              rel: 'canonical',
              href: canonicalUrl(preferredCanonicalPath, canonicalSearch),
            },
          ]
        : [],
    meta: [
      ...(!ownsCanonicalLink
        ? [
            { property: 'og:url', content: pageUrl },
            { name: 'twitter:url', content: pageUrl },
          ]
        : []),
      ...(!shouldIndexPath(canonicalPath)
        ? [{ name: 'robots', content: 'noindex, nofollow' }]
        : []),
    ],
  }
}
export const publicationRootHead=({ matches }) => {
    const canonicalHeadTags = getCanonicalHeadTags(matches)

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'theme-color',
          content: THEME_COLORS.light,
          media: '(prefers-color-scheme: light)',
        },
        {
          name: 'theme-color',
          content: THEME_COLORS.dark,
          media: '(prefers-color-scheme: dark)',
        },
        ...seo({
          title:
            'TanStack | High Quality Open-Source Software for Web Developers',
          description: `Headless, type-safe, powerful utilities for complex workflows like Data Management, Data Visualization, Charts, Tables, and UI Components.`,
          image: `https://tanstack.com${ogImage}`,
          keywords:
            'tanstack,react,reactjs,react query,react table,open source,open source software,oss,software',
        }),
        ...canonicalHeadTags.meta,
      ],
      links: [
        ...canonicalHeadTags.links,
        {
          rel: 'preload',
          href: '/fonts/Inter-latin.woff2',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        // Rebrand type system: Bricolage Grotesque (display/headings) + IBM Plex
        // Mono (code). Loaded globally so the new styles apply across the site.
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-light.svg',
          media: '(prefers-color-scheme: light)',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-dark.svg',
          media: '(prefers-color-scheme: dark)',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'manifest',
          href: matches.some(
            (match) =>
              match.pathname === '/chat' || match.pathname.startsWith('/chat/'),
          )
            ? '/chat/manifest.webmanifest'
            : '/site.webmanifest',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      scripts: import.meta.env.PROD
        ? [{ children: GOOGLE_ANALYTICS_BOOTSTRAP }]
        : [],
    }
  }
export const publicationHomeHead=() => ({
    meta: seo({
      title: 'TanStack | The open-source application stack for the web.',
      description:
        'Headless, type-safe, composable tools for building modern web applications that work naturally for developers and reliably for agents.',
    }),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(getTanStackHomepageJsonLd()),
      },
    ],
  })
export {THEME_BOOTSTRAP,HIGHLIGHT_THEME_CSS}

export const publicationBlogRootHead=()=>({meta:seo({title:'Blog | TanStack',description:'The latest news and blog posts from TanStack!'})})
