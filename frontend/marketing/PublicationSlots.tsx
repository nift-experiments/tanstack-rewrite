import * as React from 'react'
import {createPortal} from 'react-dom'
export const LandingPublicationMode=React.createContext<{activate:boolean;hosts:Map<string,HTMLElement>}>({activate:false,hosts:new Map()})
export function PublicationSlot({name,children}:{name:string;children:React.ReactNode}){const mode=React.useContext(LandingPublicationMode);if(mode.activate){const host=mode.hosts.get(name);return host?createPortal(children,host,name):null}return <div style={{display:'contents'}} data-landing-island={name}>{children}</div>}
// This traverses authored JSX values, not a serialized document/body AST.
// Components own declared child regions; ordinary markup remains native HTML.
export function publicationChildren(children:React.ReactNode,activate=false,prefix='child'):React.ReactNode{return React.Children.map(children,(child,index)=>{if(!React.isValidElement(child))return activate?null:child;const name=prefix+'-'+index,props=child.props as any;if(typeof child.type!=='string'&&child.type!==React.Fragment)return <PublicationSlot name={name}>{child}</PublicationSlot>;const nested=publicationChildren(props.children,activate,name);return activate?<>{nested}</>:React.cloneElement(child as React.ReactElement<any>,{children:nested})})}
