// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { r, port, isDev, log } from './utils'
import path from 'node:path';
import {writePackage} from 'write-pkg';

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
  const views = [
    'options',
    'options/dynamic',
    'popup',
    'background',
  ]

  for (const view of views) {
    await fs.ensureDir(r(`extension/dist/${view}`))
    let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8')
    data = data
      .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
      .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')
    await fs.writeFile(r(`extension/dist/${view}/index.html`), data, 'utf-8')
    log('PRE', `stub ${view}`)
  }
}

function writeManifest() {
  execSync('npx esno ./scripts/package.ts', { stdio: 'inherit' })
}

writeManifest()




await writePackage({foo: true});
console.log('done');

await writePackage(path.join('unicorn', 'package.json'), {foo: true});
console.log('done');

if (isDev) {
  // stubIndexHtml()
  // chokidar.watch(r('src/**/*.html'))
  //   .on('change', () => {
  //     stubIndexHtml()
  //   })
  chokidar.watch([r('src/package.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
}
