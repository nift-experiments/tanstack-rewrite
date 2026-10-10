import {MarketingViewContent} from 'owned-marketing/MarketingPublication'
import { createFileRoute } from '@tanstack/react-router'
import { partners } from '~/utils/partners'
import { PartnersGrid } from '~/components/PartnersGrid'

const cacheHeaders = {
  'Cache-Control': 'public, max-age=300',
  'Cloudflare-CDN-Cache-Control':
    'public, max-age=3600, stale-while-revalidate=300',
}

export const publicationHead=()=>({})
export const publicationStaticData={
    baseParent: true,
    showNavbar: false,
  }
export const publicationHeaders=() => {
    // Cache the entire HTML response for 5 minutes
    return cacheHeaders
  }

function PartnersEmbed() {
  const activePartners = partners.filter(
    (partner) => partner.status === 'active',
  )

  return (
    <MarketingViewContent><>
      <div
        className={`min-h-screen w-screen flex items-start justify-center overflow-hidden`}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
  html, body {
    background: transparent !important;
  }
`,
          }}
        />
        <div className="px-4 w-full">
          <PartnersGrid
            analyticsPlacement="embed_grid"
            partnersList={activePartners}
          />
        </div>
      </div>
    </></MarketingViewContent>
  )
}

export default PartnersEmbed
