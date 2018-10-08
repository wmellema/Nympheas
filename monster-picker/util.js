const doc = document
const win = window

const qs = doc.querySelector
const qsa = doc.querySelectorAll

function isNode (value) {
  return value instanceof Node
}

function create (parent, tagName, attributes, textContent) {
  const e = doc.createElement(tagName)
  if (isNode(parent)) parent.appendChild(e)
  for (const name in attributes) e.setAttribute(name, attributes[name])
  e.textContent = textContent
  return e
}

function remove (node) {
  if (isNode(node) && node.parentNode) {
    node.parentNode.removeChild(node)
  }
}

function importJson (url) {
  return fetch(url).then(r => r.json())
}

function on (target, eventName, callback) {
  target.addEventListener(eventName, callback)
}

function off (target, eventName, callback) {
  target.removeEventListener(eventName, callback)
}

function once (target, eventName, callback) {
  on(target, eventName, function handler (event) {
    off(target, eventName, handler)
    return callback.call(this, event)
  })
}
