import React from 'react'
import {MermaidBlock} from '../../frontend/components/MermaidBlock'
export function MermaidIsland(props:any){return <div data-island="mermaid" data-island-props={JSON.stringify(props)} style={{display:'contents'}}><MermaidBlock {...props}/></div>}
