const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

readFile('results.json')
.then(data => {
  const obj = JSON.parse(data)
  return writeFile('monsters.json', JSON.stringify(obj, null, 2))
})
.then(() => console.log('done'))
