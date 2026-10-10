// Published article DOM remains authoritative. Controls own only declared tab state.
export function installArticleControls(article, groups) {
  const lists = [...article.querySelectorAll('[role="tablist"]')]
  const bindings = groups.map(spec => {
    const list = lists[spec.index]
    if (!list) throw Error('Missing declared tablist')
    const buttons = [...list.querySelectorAll('[role="tab"]:not(:disabled)')]
    const panels = buttons.map(button => article.querySelector('#' + CSS.escape(button.getAttribute('aria-controls'))))
    if (panels.some(panel => !panel)) throw Error('Broken tab/panel relationship')
    return {spec,list,buttons,panels}
  })
  function select(binding,value) {
    const targets=binding.spec.storageKey?bindings.filter(b=>b.spec.storageKey===binding.spec.storageKey):[binding]
    for (const {spec,buttons,panels} of targets) {
      const chosen = panels.some(p => p.dataset.tab === value) ? value : panels[0].dataset.tab
      buttons.forEach((button,index) => {
        const active = panels[index].dataset.tab === chosen
        button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1
        button.className=button.className.replace(/border-text-primary text-text-primary|border-transparent text-text-secondary hover:text-text-primary/,active?'border-text-primary text-text-primary':'border-transparent text-text-secondary hover:text-text-primary')
        if(spec.displayClass!=='block')panels[index].classList.toggle('flex',active)
        panels[index].classList.toggle('hidden',!active)
      })
    }
  }
  for (const binding of bindings) {
    const {spec,list,buttons,panels}=binding
    let initial = spec.defaultValue
    try { const stored=spec.storageKey?localStorage.getItem(spec.storageKey):null;if(spec.values.includes(stored))initial=stored } catch {}
    select(binding,initial)
    buttons.forEach((button,index) => button.addEventListener('click',() => {
      const value=panels[index].dataset.tab
      try {if(spec.storageKey)localStorage.setItem(spec.storageKey,value)} catch {}
      select(binding,value)
    }))
    list.addEventListener('keydown',event => {
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return
      const current=buttons.indexOf(document.activeElement)
      const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:event.key==='ArrowRight'?(current+1)%buttons.length:(current<0?buttons.length-1:(current-1+buttons.length)%buttons.length)
      event.preventDefault();buttons[next].focus();buttons[next].click()
    })
  }
}
