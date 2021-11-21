// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import chokidar from 'chokidar'
import { r, isDev , log} from './utils'

function writePackageInfo() {
  execSync('npx esno ./scripts/package.ts', { stdio: 'inherit' })
}
writePackageInfo()

if (isDev) {
  chokidar.watch([r('src/package.ts'), r('package.tpl.json'),r('package.back.json')])
    .on('change', () => {
      writePackageInfo()
      log('文件有变化',['package.tpl.json','package.back.json','src/package.ts'])
    })
}
