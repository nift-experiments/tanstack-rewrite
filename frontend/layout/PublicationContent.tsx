import * as React from 'react'
import {
  CaretDownIcon,
  CopyIcon,
  PencilSimpleLineIcon,
} from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import { ButtonGroup } from '~/components/ButtonGroup'
import { DocTitle } from '~/components/DocTitle'
import { PublishedFeedback } from './PublishedFeedback'
import { Button } from '~/ui'
import {PublishedRegion} from 'owned-publication/PublishedRegion'

const LazyCopyPageDropdown = React.lazy(() =>
  import('~/components/CopyPageDropdown').then((m) => ({
    default: m.CopyPageDropdown,
  })),
)

type PublicationContentProps = {
  title: string
  repo: string
  branch: string
  filePath: string
  html: string
  activate?: (host: HTMLDivElement)=>void|(()=>void)
  preserveTabPanels?: boolean
  /** Additional elements to render in the title bar (e.g., width toggle button) */
  titleBarActions?: React.ReactNode
  /** Additional class names for the prose container */
  proseClassName?: string
  /** Ref for the markdown container (used for heading intersection observer in docs) */
  containerRef?: React.RefObject<HTMLDivElement | null>
  // Feedback props (optional, for docs)
  libraryId?: string
  libraryVersion?: string
  pagePath?: string
  /** Current framework for filtering markdown content */
  currentFramework?: string
  /** Render the first image in the document as high-priority/eager (e.g. blog post hero images) */
  eagerFirstImage?: boolean
}

function CopyPageDropdownFallback() {
  return (
    <ButtonGroup>
      <Button
        variant="ghost"
        size="xs"
        rounded="none"
        className="border-0"
        disabled
      >
        <CopyIcon className="w-3 h-3" />
        Copy page
      </Button>
      <Button
        variant="ghost"
        size="xs"
        rounded="none"
        className="border-0 px-1.5"
        disabled
        aria-label="More copy actions"
      >
        <CaretDownIcon className="w-3 h-3" />
      </Button>
    </ButtonGroup>
  )
}

export function PublicationContent({
  title,
  repo,
  branch,
  filePath,
  html,
  activate,
  preserveTabPanels,
  titleBarActions,
  proseClassName,
  containerRef,
  libraryId,
  libraryVersion,
  pagePath,
  currentFramework,
  eagerFirstImage,
}: PublicationContentProps) {
  const [canLoadCopyControls, setCanLoadCopyControls] = React.useState(false)

  React.useEffect(() => {
    setCanLoadCopyControls(true)
  }, [])

  const renderedMarkdown = <PublishedRegion html={html} activate={activate} displayContents/>

  const contentNode =
    libraryId && libraryVersion && pagePath ? (
      <PublishedFeedback
        pagePath={pagePath}
        libraryId={libraryId}
        libraryVersion={libraryVersion}
        html={html}
        activate={activate}
      />
    ) : (
      renderedMarkdown
    )

  return (
    <>
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <DocTitle>{title}</DocTitle>
          <div
            className="flex items-center gap-2 shrink-0"
            onFocusCapture={() => {
              setCanLoadCopyControls(true)
            }}
            onPointerEnter={() => {
              setCanLoadCopyControls(true)
            }}
            onTouchStart={() => {
              setCanLoadCopyControls(true)
            }}
          >
            {canLoadCopyControls ? (
              <React.Suspense fallback={<CopyPageDropdownFallback />}>
                <LazyCopyPageDropdown
                  repo={repo}
                  branch={branch}
                  filePath={filePath}
                  currentFramework={currentFramework}
                />
              </React.Suspense>
            ) : (
              <CopyPageDropdownFallback />
            )}
            {titleBarActions}
          </div>
        </div>
      ) : null}
      <div className="h-4" />
      <div className="h-px bg-gray-500 opacity-20" />
      <div className="h-4" />
      {libraryId && libraryVersion && pagePath ? (
      <div
        ref={containerRef}
        className={twMerge(
          'prose prose-gray dark:prose-invert max-w-none',
          '[font-size:16px]',
          'styled-markdown-content',
          proseClassName,
        )}
      >
        {contentNode}
      </div>
      ) : <PublishedRegion html={html} activate={activate} hostRef={containerRef} className={twMerge('prose prose-gray dark:prose-invert max-w-none','[font-size:16px]','styled-markdown-content',proseClassName)}/>}
      <div className="h-12" />
      <div className="w-full h-px bg-gray-500 opacity-30" />
      <div className="flex py-4">
        <Button
          variant="ghost"
          size="xs"
          as="a"
          href={`https://github.com/${repo}/edit/${branch}/${filePath}`}
        >
          <PencilSimpleLineIcon className="w-3.5 h-3.5" />
          Edit on GitHub
        </Button>
      </div>
    </>
  )
}
