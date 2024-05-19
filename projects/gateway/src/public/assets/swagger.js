window.addEventListener('load', () => {
  setTimeout(renderMenu)
})

function renderMenu() {
  const titles = document.querySelectorAll('h3.opblock-tag')
  const fragment = document.createDocumentFragment()
  const ul = document.createElement('ul')
  ul.classList.add('content-menu')
  titles.forEach((titleNode) => {
    const titleText = titleNode.getAttribute('data-tag')
    const aLink = titleNode.querySelector('a')
    const href = aLink.href
    const a = document.createElement('a')
    a.innerHTML = titleText
    a.href = href
    a.onclick = (e) => {
      e.preventDefault()
      const tar = document.querySelector(`h3[data-tag="${titleText}"]`)
      tar.scrollIntoView()
    }
    fragment.appendChild(a)
  })
  fragment.so
  ul.appendChild(fragment)
  const con = document.querySelector('.swagger-ui.swagger-container')
  con && con.appendChild(ul)

  menuTrigger(ul)
}

function menuTrigger(menuDom) {
  menuDom.classList.remove('active')
  const triggerArea = 20
  window.addEventListener('mousemove', (e) => {
    const { clientX } = e
    const showing = menuDom.classList.contains('active')
    if (showing) {
      if (clientX > menuDom.offsetWidth)
        menuDom.classList.remove('active')
    } else {
      if (clientX < triggerArea)
        menuDom.classList.add('active')
    }
  })
}
