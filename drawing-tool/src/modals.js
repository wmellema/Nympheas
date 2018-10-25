function create (parent, tagName, attributes, textContent) {
  const e = document.createElement(tagName)
  if (parent instanceof Node) parent.appendChild(e)
  for (const name in attributes) e.setAttribute(name, attributes[name])
  e.textContent = textContent
  return e
}

function remove (node) {
  if (node instanceof Node) node.parentNode.removeChild(node)
}

export function openModal (descriptor = {}) {
  switch (descriptor.type) {
    case 'input': return openInputModal(descriptor)
    case 'output': return openOutputModal(descriptor)
    default: return openAlertModal(descriptor)
  }
}

function openAlertModal (descriptor) {
  return new Promise((resolve, reject) => {
    const modal = create(document.body, 'div', {class: 'modal'})
    const box =  create(modal, 'div', {class: 'box'})
    create(box, 'h3', {class: 'title'}, descriptor.title || '')
    create(box, 'div', {class: 'message'}, descriptor.message || '')
    const bg = create(box, 'div', {class: 'button-group'})
    create(bg, 'button', {}, descriptor.ok || 'OK')
      .addEventListener('click', () => {
        resolve({result: 'ok'})
        remove(modal)
      })
  })
}

function openOutputModal (descriptor) {
  return new Promise((resolve, reject) => {
    const modal = create(document.body, 'div', {class: 'modal'})
    const box =  create(modal, 'div', {class: 'box'})
    create(box, 'h3', {class: 'title'}, descriptor.title || '')
    create(box, 'div', {class: 'message'}, descriptor.message || '')
    create(box, 'textarea', {class: 'output', disabled: true}, descriptor.output || '')
    const bg = create(box, 'div', {class: 'button-group'})
    create(bg, 'button', {}, descriptor.ok || 'OK')
      .addEventListener('click', () => {
        resolve({result: 'ok'})
        remove(modal)
      })
  })
}

function openInputModal (descriptor) {
  return new Promise((resolve, reject) => {
    const modal = create(document.body, 'div', {class: 'modal'})
    const box =  create(modal, 'div', {class: 'box'})
    create(box, 'h3', {class: 'title'}, descriptor.title || '')
    create(box, 'div', {class: 'message'}, descriptor.message || '')
    const input = create(box, 'textarea', {class: 'input'})
    const bg = create(box, 'div', {class: 'button-group'})
    create(bg, 'button', {}, descriptor.ok || 'OK')
      .addEventListener('click', () => {
        resolve({
          result: 'ok',
          data: input.value
        })
        remove(modal)
      })
    create(bg, 'button', {}, descriptor.cancel || 'Cancel')
      .addEventListener('click', () => {
        resolve({result: 'cancel'})
        remove(modal)
      })
  })
}
