const STAT_NAMES = ['ac', 'hp', 'str', 'dex', 'con', 'int', 'wis', 'cha']

const md5 = (value) => CryptoJS.MD5(value.toString()).toString()

const capitalize = (str) => str[0].toUpperCase() + str.slice(1)

const d = (sides, throws) => {
  const {floor, random} = Math
  let result = 0
  for (let i = 0; i < Number(throws); i++) {
    result += floor(random() * sides) + 1
  }
  return result
}

const parseHP = (value) => {
  const [,dice, die, base] = /(\d*)d(\d*)([^\)]\d*)?/.exec(value) || []
  const min = (x) => x < 1 ? 1 : x
  return (dice) ? () => min((d(die, dice) + Number(base || 0))) : () => value
}

class Kind {
  constructor (name, data) {
    this.name = name
    this.size = data.Size || ''
    this.type = data.Type || ''
    this.hpRoll = parseHP(data.HP || '')
    this.alignment = (data.Alignment || '').toLowerCase()
    this.data = data
    this.createCard()
  }
  hide () {
    this.card.classList.add('hidden')
  }
  show () {
    this.card.classList.remove('hidden')
  }
  createCard () {
    const card = this.card = create(ui.collection, 'div', {
      class: 'monster-card draggable',
      draggable: true
    })
    const descStr = `${this.size} ${this.type}, ${this.alignment}`
    create(card, 'div', {class: 'name'}, this.name)
    create(card, 'div', {class: 'desc'}, descStr)
    on(card, 'click', () => controller.selectKind(this))
    on(card, 'dragstart', () => controller.draggedKind = this)
    on(card, 'dragend', () => controller.draggedKind = null)
    create(card, 'img', {src: this.data.img_url})
  }
}

class Monster {
  constructor (kind, card) {
    this.id = md5(Date.now())
    this.kind = kind
    this.ac = kind.data.AC
    this.hp = kind.hpRoll()
    for (const stat of STAT_NAMES) {
      if (stat === 'ac' || stat === 'hp') continue
      this[stat] = kind.data[capitalize(stat)]
    }
    this.createCard()
  }
  createCard () {
    const card = this.card = create(ui.encounter, 'div', {
      class: 'monster-card draggable',
      draggable: true
    })
    on(card, 'click', () => controller.selectMonster(this))
    on(card, 'dragstart', () => controller.draggedMonster = this)
    on(card, 'dragend', () => controller.draggedMonster = null)
    this.name = create(this.card, 'div', {class: 'name'})
    this.desc = create(this.card, 'div', {class: 'desc'})
    this.stats = create(this.card, 'table', {class: 'stats'})
    create(card, 'img', {src: this.kind.data.img_url})
    this.renderCard()
  }
  renderCard () {
    const descStr = `AC: ${this.ac}, HP: ${this.hp}`
    this.name.textContent = this.kind.name
    this.desc.textContent = descStr
    this.stats.innerHTML = ''
    this.stats.tbody = create(this.stats, 'tbody')
    this.stats.headers = create(this.stats.tbody, 'tr')
    this.stats.values = create(this.stats.tbody, 'tr')

    const ammend = (v) => {
      const mod = Math.floor(v / 2 - 5)
      return v + ` (${mod < 0 ? '' : '+'}${mod})`
    }

    for (const stat of STAT_NAMES) {
      if (stat === 'ac' || stat === 'hp') continue
      create(this.stats.headers, 'th', {}, stat.toUpperCase())
      create(this.stats.values, 'td', {}, ammend(this[stat]))
    }

  }
}

const ui = {}
const controller = {
  collection: new Set(),
  encounter: new Set(),
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
    this.renderViewer()
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
    for (const stat of STAT_NAMES) {
      ui.input[stat].value = monster[stat]
    }
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
    const monster = new Monster(kind)
    this.encounter.add(monster)
  },
  deleteMonster (monster) {
    remove(monster.card)
    this.encounter.delete(monster)
  },
  populateCollection (kinds) { // createKinds
    for (const k in kinds) {
      const kind = new Kind(k, kinds[k])
      this.collection.add(kind)
    }
  },
  searchCollection (term) {
    if (term === '') {
      for (const kind of this.collection) kind.show()
    } else {
      const search = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())
      for (const kind of this.collection) {
        if (search(kind.name, term)
         || search(kind.size, term)
         || search(kind.type, term)
         || search(kind.alignment, term)) kind.show()
        else kind.hide()
      }
    }
  },
  serializeEncounter () {
    const array = []
    for (const monster of this.encounter) {
      array.push({
        id: monster.id,
        kind: monster.kind.name,
        ac: monster.ac,
        hp: monster.hp,
        str: monster.str,
        dex: monster.dex,
        con: monster.con,
        int: monster.int,
        wis: monster.wis,
        cha: monster.cha
      })
    }
    return JSON.stringify(array)
  },
  renderViewer () {
    ui.viewer.innerHTML = ''
    let e, info
    const {name, size, type, alignment, data} = this.selectedKind
    const descStr = `${size} ${type}, ${alignment}`
    create(ui.viewer, 'div', {class: 'name'}, name)
    create(ui.viewer, 'div', {class: 'desc'}, descStr)
    create(ui.viewer, 'div', {class: 'separator'})
    info = create(ui.viewer, 'div', {class: 'info'})
    e = create(info, 'div')
    create(e, 'span', {class: 'bold'}, 'Armor Class ')
    create(e, 'span', {}, data.AC)
    e = create(info, 'div')
    create(e, 'span', {class: 'bold'}, 'Hit Points ')
    create(e, 'span', {}, data.HP)
    e = create(info, 'div')
    create(e, 'span', {class: 'bold'}, 'Speed ')
    create(e, 'span', {}, data.Speed)
    create(ui.viewer, 'div', {class: 'separator'})
    const stats = create(ui.viewer, 'table', {class: 'stats'})
    stats.tbody = create(stats, 'tbody')
    stats.headers = create(stats.tbody, 'tr')
    stats.values = create(stats.tbody, 'tr')

    const ammend = (v) => {
      const mod = Math.floor(v / 2 - 5)
      return v + ` (${mod < 0 ? '' : '+'}${mod})`
    }

    for (const stat of STAT_NAMES) {
      if (stat === 'hp' || stat === 'ac') continue
      create(stats.headers, 'th', {}, stat.toUpperCase())
      create(stats.values, 'td', {}, ammend(data[capitalize(stat)]))
    }

    create(ui.viewer, 'div', {class: 'separator'})
    info = create(ui.viewer, 'div', {class: 'info'})
    if (data['Saving Throws'] && data['Saving Throws'] > 0) {
      e = create(info, 'div')
      create(e, 'span', {class: 'bold'}, 'Saving Throws ')
      create(e, 'span', {}, data['Saving Throws'])
    }
    if (data.Skills && data.Skills.length > 0) {
      e = create(info, 'div')
      create(e, 'span', {class: 'bold'}, 'Skills ')
      create(e, 'span', {}, data.Skills.join(', '))
    }
    if (data.Resistance && data.Resistance.length > 0) {
      e = create(info, 'div')
      create(e, 'span', {class: 'bold'}, 'Resistance ')
      create(e, 'span', {}, data.Resistance.join(', '))
    }
    if (data.Immunity && data.Immunity.length > 0) {
      e = create(info, 'div')
      create(e, 'span', {class: 'bold'}, 'Immunity ')
      create(e, 'span', {}, data.Immunity.join(', '))
    }
    if (data.Senses && data.Senses.length > 0) {
      e = create(info, 'div')
      create(e, 'span', {class: 'bold'}, 'Senses ')
      create(e, 'span', {}, data.Senses)
    }
    if (data.Languages && data.Languages.length > 0) {
      e = create(info, 'div')
      create(e, 'span', {class: 'bold'}, 'Languages ')
      create(e, 'span', {}, data.Languages)
    }
    e = create(info, 'div')
    create(e, 'span', {class: 'bold'}, 'Challenge ')
    create(e, 'span', {}, `${data['Challenge Rating']} (${data.XP} XP)`)
    create(ui.viewer, 'div', {class: 'separator'})
    const traits = create(ui.viewer, 'div', {class: 'traits'})
    for (const t in data.Traits) {
      e = create(traits, 'div')
      create(e, 'span', {class: 'bold italic'}, t)
      create(e, 'span', {}, data.Traits[t])
    }
    create(ui.viewer, 'div', {class: 'caption'}, 'Actions')
    for (const a in data.Actions) {
      e = create(ui.viewer, 'div')
      create(e, 'span', {class: 'bold italic'}, a)
      create(e, 'span', {}, data.Actions[a])
    }
    create(ui.viewer, 'div', {class: 'description'}, data.description)

  }
}

once(win, 'load', () => {

  ui.root = create(doc.body, 'div', {id: 'root'})
  const row1 = create(ui.root, 'div', {class: 'row'})
  const row2 = create(ui.root, 'div', {class: 'row'})
  const row3 = create(ui.root, 'div', {class: 'row'})
  ui.viewer = create(row1, 'div', {id: 'viewer', class: 'monster-card'})
  ui.details = create(row1, 'div', {id: 'details'})
  ui.search = create(row2, 'input', {id: 'search'})
  ui.save = create(row2, 'button', {id: 'save'}, 'Save')
  ui.collection = create(row3, 'div', {id: 'collection'})
  ui.encounter = create(row3, 'div', {id: 'encounter'})

  initDetails()

  importJson('monsters.json')
  .then(data => controller.populateCollection(data))

  on(ui.collection, 'click', (event) => {
    if (event.target === ui.collection) controller.deselectKind()
  })

  on(ui.encounter, 'click', (event) => {
    if (event.target === ui.encounter) controller.deselectMonster()
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

  on(ui.encounter, 'dragover', (event) => {
    if (controller.draggedKind) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    }
  })

  on(ui.encounter, 'drop', (event) => {
    if (controller.draggedKind) {
      event.preventDefault()
      controller.createMonster(controller.draggedKind)
    }
  })

  on(ui.search, 'input', () => controller.searchCollection(ui.search.value))

  on(ui.save, 'click', () => console.log(controller.serializeEncounter()))

})

function initDetails () {
  ui.input = {
    stats: create(ui.details, 'div', {class: 'stats hidden'}),
    show () {
      this.stats.classList.remove('hidden')
    },
    hide () {
      this.stats.classList.add('hidden')
    }
  }
  const tbody = create(create(ui.input.stats, 'table'), 'tbody')

  let tr
  for (const stat of STAT_NAMES) {
    tr = create(tbody, 'tr')
    create(tr, 'th', {}, stat.toUpperCase())
    ui.input[stat] = create(create(tr, 'td'), 'input', {
      type: stat === 'ac' ? 'text' : 'number'
    })
    on(ui.input[stat], 'input', () => {
      controller.selectedMonster[stat] = ui.input[stat].value
      controller.selectedMonster.renderCard()
    })
  }

}
