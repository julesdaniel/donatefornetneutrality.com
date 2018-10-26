const fs = require('fs')
const path = require('path')
const orderBy = require('lodash/orderBy')

async function main() {
  const dir = path.resolve(__dirname, '..', 'static', 'logos')
  const logos = []

  for (let subdir of fs.readdirSync(dir)) {
    const subdirPath = path.resolve(dir, subdir)

    if (fs.lstatSync(subdirPath).isDirectory()) {
      const files = orderBy(fs.readdirSync(subdirPath), f => f.toLowerCase())
      for (let file of files) {
        if (file.match(/\.(png|jpg|jpeg|gif)$/i)) {
          logos.push({
            image: `/logos/${subdir}/${file}`,
            name: file.replace(/\.(png|jpg|jpeg|gif)$/i, '')
          })
        }
      }
    }
  }

  const dataFile = path.resolve(__dirname, '..', 'data', 'logos.json')
  fs.writeFileSync(dataFile, JSON.stringify(logos, null, 2))
}

main().catch(console.error)
