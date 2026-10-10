import React from 'react'

// Copy from the current publication, rather than a frozen renderer/AST payload.
// Only the declared button state belongs to this controller.
export function installCodeCopy(host: HTMLElement, copy: (text:string)=>Promise<void>, notify: (content:React.ReactNode,options:{id:string})=>void) {
  let disposed=false
  const cleanups:Array<()=>void>=[]
  for (const button of host.querySelectorAll<HTMLButtonElement>('.codeblock button[aria-label="Copy code to clipboard"]')) {
    const original=button.innerHTML
    let timer:ReturnType<typeof setTimeout>|undefined
    const click=async()=>{
      const code=button.closest('.codeblock')?.querySelector('pre code')
      if(!code)throw new Error('Published copy control has no code source')
      await copy(code.textContent??'')
      if(disposed)return
      if(timer)clearTimeout(timer)
      button.innerHTML='<span class="text-xs">Copied!</span>'
      timer=setTimeout(()=>{button.innerHTML=original},2000)
      notify(<div className="flex flex-col"><span className="font-medium">Copied code</span><span className="text-gray-500 dark:text-gray-400 text-xs">Code block copied to clipboard</span></div>,{id:'code-copied'})
    }
    button.addEventListener('click',click)
    cleanups.push(()=>{button.removeEventListener('click',click);if(timer)clearTimeout(timer);button.innerHTML=original})
  }
  return ()=>{disposed=true;cleanups.forEach(cleanup=>cleanup())}
}
