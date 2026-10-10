import {usePreferredFramework} from './FrameworkPreference'
import { Children, isValidElement, type ReactNode } from 'react'

type FrameworkContentProps = {
  children?: ReactNode
}

function isFrameworkPanel(child: ReactNode): child is React.ReactElement<{
  'data-framework': string
  children?: ReactNode
}> {
  return (
    isValidElement<{ 'data-framework'?: string }>(child) &&
    typeof child.props['data-framework'] === 'string'
  )
}

export function FrameworkContent({ children }: FrameworkContentProps) {
  const normalizedFramework = usePreferredFramework()
  const panels = Children.toArray(children).filter(isFrameworkPanel)
  const fallbackPanel = panels[0]
  const activePanel =
    panels.find(
      (child) => child.props['data-framework'] === normalizedFramework,
    ) || fallbackPanel

  if (!activePanel || !isValidElement(activePanel)) {
    return null
  }

  return <div className="framework-content">{activePanel.props.children}</div>
}
