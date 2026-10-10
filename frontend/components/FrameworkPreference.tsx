import React from 'react'
import {useRouterState} from '@tanstack/react-router'
// Request/browser owners supply preferences; no auth/database graph in publication views.
export const FrameworkPreference = React.createContext<{userFramework?:string;localFramework?:string}>({})
export function usePreferredFramework(){const framework=useRouterState({select:state=>state.matches.at(-1)?.params?.framework});const {userFramework,localFramework}=React.useContext(FrameworkPreference);return (framework||userFramework||localFramework||'react').toLowerCase()}
