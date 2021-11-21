// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import * as path from "path"
import chokidar from 'chokidar'
import { r, port, isDev, log } from './utils'
import {writePackage} from 'write-pkg';
import { configCommands } from './config.contributes.commands'


async function readPkgJson(relativeFile: string): Object {
  const jsonStr = await fs.readFile(r(`${relativeFile}`), 'utf-8')
  return JSON.parse(jsonStr);
}

function writeManifest() {
  execSync('npx esno ./scripts/package.ts', { stdio: 'inherit' })
}

writeManifest()




const writeTest = async ()=>{
  // await writePackage({foo: true});
  // console.log('done');
  const pkg = await readPkgJson('package.json')
  pkg.testName = 'test name daxiang'
  pkg.testName = 'test name daxiang 99999'
  pkg.contributes.commands = configCommands
  await writePackage(path.join('pkg', 'jest'), pkg);
  console.log('done');
}

writeTest()

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
