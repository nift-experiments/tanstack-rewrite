import * as React from 'react'
import {useMatches,useRouterState} from '@tanstack/react-router'
import {QueryClientProvider,type QueryClient} from '@tanstack/react-query'
import {SearchProvider} from 'retained-ui/contexts/SearchContext'
import {ToastProvider} from 'retained-ui/components/ToastProvider'
import {LoginModalProvider} from 'retained-ui/contexts/LoginModalContext'
import {LibrariesOverlayProvider} from 'retained-ui/contexts/LibrariesOverlayContext'
import {Spinner} from 'retained-ui/components/Spinner'
import {ThemeProvider} from 'retained-ui/components/ThemeProvider'
import {Navbar} from 'retained-ui/components/Navbar'
import {Footer} from 'retained-ui/components/Footer'
import {ProductScarf} from 'retained-ui/components/ProductScarf'
import {BuilderRouteFrame,BuilderRouteSkeleton} from 'retained-ui/chat/components/projects/Loading'
import {trackPageView} from 'retained-ui/utils/analytics'
import {trackScarfClipboardEvent,trackScarfDownloadClick,trackScarfExternalLinkClick,trackScarfExternalLinkHoverIntent,trackScarfPageView} from 'retained-ui/utils/analytics/scarf'
import {twMerge} from 'tailwind-merge'
export function RootChrome({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  const isNavigating = useRouterState({
    select: (s) => s.status === 'pending',
  })
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  })

  const [showNavigationSpinner, setShowNavigationSpinner] = React.useState(false)

  React.useEffect(() => {
    if (!isNavigating) {
      setShowNavigationSpinner(false)
      return
    }

    const timeout = window.setTimeout(() => {
      setShowNavigationSpinner(true)
    }, 1000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isNavigating])


  const hideNavbar = useMatches({
    select: (s) => s.some((d) => d.staticData?.showNavbar === false),
  })
  const hideFooter =
    pathname === '/builder' ||
    pathname.startsWith('/builder/') ||
    pathname === '/chat' ||
    pathname.startsWith('/chat/')

  const routeContent = (
    <BuilderRouteFrame pathname={pathname}>
      <React.Suspense fallback={<BuilderRouteSkeleton pathname={pathname} />}>
        {children}
      </React.Suspense>
    </BuilderRouteFrame>
  )

  return (
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <SearchProvider
                enabled={pathname !== '/chat' && !pathname.startsWith('/chat/')}
              >
                <LoginModalProvider>
                  <ToastProvider>
                    <PageViewTracker />
                    <ProductScarf />
                    <LibrariesOverlayProvider>
                      {hideNavbar ? (
                        routeContent
                      ) : (
                        <Navbar>
                          {routeContent}
                          {hideFooter ? null : <Footer />}
                        </Navbar>
                      )}
                    </LibrariesOverlayProvider>
                    <div
                      aria-hidden="true"
                      className={twMerge(
                        'pointer-events-none fixed top-0 left-0 z-99999999 h-[320px] w-full select-none',
                      )}
                    >
                      <div
                        className={twMerge(
                          'absolute top-0 w-full h-80 rounded-[100%] bg-amber-500/30 blur-3xl transition-all duration-500 dark:bg-sky-400/25',
                          showNavigationSpinner
                            ? '-translate-y-1/2 opacity-100'
                            : '-translate-y-full opacity-0',
                        )}
                      />
                      <div
                        className={twMerge(
                          'absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/75 p-2 shadow-lg backdrop-blur-lg transition-all duration-300 dark:bg-slate-900/40',
                          showNavigationSpinner
                            ? 'translate-y-0 opacity-100'
                            : '-translate-y-6 opacity-0',
                        )}
                      >
                        {isNavigating && showNavigationSpinner ? (
                          <Spinner className="text-4xl" />
                        ) : null}
                      </div>
                    </div>
                  </ToastProvider>
                </LoginModalProvider>
              </SearchProvider>
            </ThemeProvider>
          </QueryClientProvider>
  )
}
/**
 * The single source of `page_view` events: one on initial load and one per
 * SPA navigation. gtag config runs with `send_page_view: false`, and GA4's
 * enhanced-measurement "page changes based on browser history events" must
 * stay disabled on the web stream, or navigations are counted twice.
 */
function PageViewTracker() {
  const pagePath = useRouterState({
    select: (s) => {
      if (!s.resolvedLocation) {
        return null
      }

      const pathname = s.resolvedLocation.pathname || '/'
      const search = s.resolvedLocation.searchStr || ''

      return `${pathname}${search}`
    },
  })
  const lastTrackedPath = React.useRef<string | null>(null)

  React.useEffect(() => {
    const stopTrackingHoverIntent = trackScarfExternalLinkHoverIntent()
    document.addEventListener('click', trackScarfExternalLinkClick, true)
    document.addEventListener('click', trackScarfDownloadClick, true)
    document.addEventListener('copy', trackScarfClipboardEvent, true)
    document.addEventListener('paste', trackScarfClipboardEvent, true)
    return () => {
      stopTrackingHoverIntent()
      document.removeEventListener('click', trackScarfExternalLinkClick, true)
      document.removeEventListener('click', trackScarfDownloadClick, true)
      document.removeEventListener('copy', trackScarfClipboardEvent, true)
      document.removeEventListener('paste', trackScarfClipboardEvent, true)
    }
  }, [])

  React.useEffect(() => {
    // Skip until the router has resolved a location, and never send the same
    // path twice in a row (guards against the location resolving twice).
    if (pagePath === null || lastTrackedPath.current === pagePath) {
      return
    }

    lastTrackedPath.current = pagePath
    trackPageView(pagePath)
    trackScarfPageView(window.location.pathname)
  }, [pagePath])

  return null
}
