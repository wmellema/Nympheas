const md5 = (value) => CryptoJS.MD5(value.toString()).toString()

class Kind {
  constructor (data, card) {
    this.id = data.id
    this.name = data.name
    this.desc = data.desc
    this.info = data.info
    this.card = card
  }
  hide () {
    if (isNode(this.card)) this.card.classList.add('hidden')
  }
  show () {
    if (isNode(this.card)) this.card.classList.remove('hidden')
  }
}

class Monster {
  constructor (kind, card) {
    this.id = md5(Date.now())
    this.name = kind.name
    this.desc = kind.desc
    this.kind = kind
    this.card = card
  }
  render () {
    this.card.innerHTML = ''
    const name = create(this.card, 'div', {class: 'monster-name'}, this.name)
    const desc = create(this.card, 'div', {class: 'monster-desc'}, this.desc)
  }
}

const ui = {}
const controller = {
  collection: new Set(),
  selection: new Set(),
  selectedKind: null,
  selectedMonster: null,
  draggedKind: null,
  draggedMonster: null,
  selectKind (kind) {
    if (this.selectedKind) {
      this.selectedKind.card.classList.remove('selected')
    }
    this.selectedKind = kind
    kind.card.classList.add('selected')
    ui.viewer.textContent = kind.info
  },
  deselectKind () {
    if (this.selectedKind) {
      this.selectedKind.card.classList.remove('selected')
    }
    this.selectedKind = null
    ui.viewer.textContent = ''
  },
  selectMonster (monster) {
    if (this.selectedMonster) {
      this.selectedMonster.card.classList.remove('selected')
    }
    this.selectedMonster = monster
    monster.card.classList.add('selected')
    ui.input.name.value = monster.name
    ui.input.desc.value = monster.desc
    ui.input.show()
  },
  deselectMonster () {
    if (this.selectedMonster) {
      this.selectedMonster.card.classList.remove('selected')
    }
    this.selectedMonster = null
    ui.input.hide()
  },
  createMonster (kind) {
    const card = create(ui.selection, 'div', {
      class: 'monster-card',
      draggable: true
    })
    const monster = new Monster(kind, card)
    monster.render()
    on(card, 'click', () => this.selectMonster(monster))
    on(card, 'dragstart', () => this.draggedMonster = monster)
    on(card, 'dragend', () => this.draggedMonster = null)
    this.selection.add(monster)
  },
  deleteMonster (monster) {
    remove(monster.card)
    this.selection.delete(monster)
  },
  populateCollection (kinds) {
    for (const data of kinds) {
      const card = create(ui.collection, 'div', {
        class: 'monster-card',
        draggable: true
      })
      const kind = new Kind(data, card)
      const name = create(card, 'div', {class: 'monster-name'}, kind.name)
      const desc = create(card, 'div', {class: 'monster-desc'}, kind.desc)
      on(card, 'click', () => controller.selectKind(kind))
      on(card, 'dragstart', () => controller.draggedKind = kind)
      on(card, 'dragend', () => controller.draggedKind = null)
      this.collection.add(kind)
    }
  },
  searchCollection (term) {
    if (term === '') {
      for (const kind of this.collection) kind.show()
    } else {
      const search = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())
      for (const kind of this.collection) {
        if (search(kind.name, term)) kind.show()
        else kind.hide()
      }
    }
  },
  serializeSelection () {
    const array = []
    for (const monster of this.selection) {
      array.push({
        id: monster.id,
        name: monster.name,
        desc: monster.desc,
        kindId: monster.kind.id
      })
    }
    return JSON.stringify(array)
  }
}

once(win, 'load', () => {

  ui.root = create(doc.body, 'div', {id: 'root'})
  ui.viewer = create(ui.root, 'div', {id: 'viewer'})
  ui.details = create(ui.root, 'div', {id: 'details'})
  ui.search = create(ui.root, 'input', {id: 'search'})
  ui.save = create(ui.root, 'button', {id: 'save'}, 'Save')
  ui.collection = create(ui.root, 'div', {id: 'collection'})
  ui.selection = create(ui.root, 'div', {id: 'selection'})

  initDetails()

  importJson('monsters.json')
  .then(data => controller.populateCollection(data))

  on(ui.collection, 'click', (event) => {
    if (event.target === ui.collection) controller.deselectKind()
  })

  on(ui.selection, 'click', (event) => {
    if (event.target === ui.selection) controller.deselectMonster()
  })

  on(ui.collection, 'dragover', (event) => {
    if (controller.draggedMonster) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }
  })

  on(ui.collection, 'drop', (event) => {
    if (controller.draggedMonster) {
      event.preventDefault()
      controller.deleteMonster(controller.draggedMonster)
    }
  })

  on(ui.selection, 'dragover', (event) => {
    if (controller.draggedKind) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    }
  })

  on(ui.selection, 'drop', (event) => {
    if (controller.draggedKind) {
      event.preventDefault()
      controller.createMonster(controller.draggedKind)
    }
  })

  on(ui.search, 'input', () => controller.searchCollection(ui.search.value))

  on(ui.save, 'click', () => console.log(controller.serializeSelection()))

})

function initDetails () {
  ui.input = {
    name: create(ui.details, 'input', {
      id: 'input-name',
      class: 'hidden'
    }),
    desc: create(ui.details, 'input', {
      id: 'input-desc',
      class: 'hidden'
    }),
    show () {
      this.name.classList.remove('hidden')
      this.desc.classList.remove('hidden')
    },
    hide () {
      this.name.classList.add('hidden')
      this.desc.classList.add('hidden')
    }
  }

  on(ui.input.name, 'input', () => {
    controller.selectedMonster.name = ui.input.name.value
    controller.selectedMonster.render()
  })

  on(ui.input.desc, 'input', () => {
    controller.selectedMonster.desc = ui.input.desc.value
    controller.selectedMonster.render()
  })
}
