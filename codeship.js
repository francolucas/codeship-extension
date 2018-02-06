const addOption = (build) => {
  const listItem = document.createElement('li')
  listItem.className = 'build-cta-item'
  const anchor = document.createElement('a')
  anchor.className = 'build-cta-link'
  anchor.href = '#start'
  anchor.innerText = 'Start'
  anchor.addEventListener('click', () => {
    build.querySelector('.build-status').innerText = 'Running'
    const buildLink = location.pathname.indexOf('/builds/') > 0 ? location.pathname : build.querySelector('a').href
    startBuild(buildLink)
    anchor.style.display = 'none'
    return false
  })
  listItem.append(anchor)
  build.querySelector('ul').prepend(listItem)
}

const startBuild = (url) => {
  doXHR(url, 'stop').then(() => doXHR(url, 'reenqueue'))
}

const doXHR = (url, what) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const param = document.head.querySelector('[name="csrf-param"]').content
    const token = document.head.querySelector('[name="csrf-token"]').content
    xhr.open('PUT', `${url}/${what}.json`, true)
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhr.onload = () => resolve(xhr.responseText)
    xhr.send(`{"${param}": "${token}"}`)
  })
}

let initiated = false
const init = () => {
  if (initiated) return false
  const builds = document.querySelectorAll('.build-item')
  if (builds.length > 0) initiated = true
  for (const build of builds) {
    if (build.className.indexOf('queued') > 0) {
      addOption(build)
    }
  }
}

init()
document.querySelector('div[data-content=projects-show], div[data-content=organizations-show], div[data-build]').addEventListener('DOMSubtreeModified', init)
