import {useDocComponentRegistration} from 'owned-doc-components/DocComponents'
import * as React from 'react'
import {useRouter} from '@tanstack/react-router'
import {createClientOnlyFn} from '@tanstack/react-start'
import {useToast} from 'retained-ui/components/ToastProvider'
import {copyTextToClipboard} from 'retained-ui/utils/browser-effects'
import {trackScarfInstallCommandCopy} from 'retained-ui/utils/analytics/scarf'
import {installNativeNavigation} from './native-navigation'
import {installCodeCopy} from './code-copy'
import {installArticleControls} from '../article-controls.js'
const installDiagrams=createClientOnlyFn((host:HTMLDivElement)=>{let disposed=false,cleanup:(()=>void)|undefined;if(host.querySelector('[data-island="mermaid"]'))import('./mermaid').then(module=>{if(!disposed)cleanup=module.activateMermaid(host)}).catch(error=>console.error('Mermaid activation error',error));return()=>{disposed=true;cleanup?.()}})
export function useArticleActivation(groups:any[]=[]){const router=useRouter(),{notify}=useToast(),registerComponents=useDocComponentRegistration();return React.useCallback((host:HTMLDivElement)=>{const stopComponents=registerComponents(host),stopNavigation=installNativeNavigation(host,router),stopTabs=installArticleControls(host,groups),stopDiagrams=installDiagrams(host),lists=[...host.querySelectorAll('[role="tablist"]')],stopCopy=installCodeCopy(host,copyTextToClipboard,notify,button=>{const group=groups.find(spec=>spec.installCopy&&lists[spec.index]?.parentElement?.contains(button));if(group)trackScarfInstallCommandCopy(button.closest<HTMLElement>('[role="tabpanel"]')!.dataset.tab!,group.installCopy.framework,group.installCopy.packages)});return()=>{stopCopy();stopDiagrams?.();stopTabs();stopNavigation();stopComponents()}},[router,notify,groups,registerComponents])}
