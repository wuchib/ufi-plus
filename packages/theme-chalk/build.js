/**
 * Placeholder build script. In a real repo you'd compile SCSS->CSS.
 * Here we simply ensure index.css exists.
 */
import fs from 'node:fs'
if (!fs.existsSync('index.css')) {
  fs.writeFileSync('index.css', '')
}
console.log('theme-chalk ready')
