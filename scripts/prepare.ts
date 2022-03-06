/*
 * @Descripttion: 
 * @Author: xiangjun02
 * @Date: 2022-03-06 16:55:50
 * @LastEditors: xiangjun02
 * @LastEditTime: 2022-03-06 17:07:47
 */
// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import chokidar from 'chokidar'
import { r, isDev , log} from './utils'

function writePackageInfo() {
  execSync('npx esno ./scripts/package.ts', { stdio: 'inherit' })
}
writePackageInfo()

if (isDev) {
  chokidar.watch([r('src/package.ts'), r('package-config/package.tpl.json'),r('package-config/package.back.json')])
    .on('change', () => {
      writePackageInfo()
      log('文件有变化',['package-config/package.tpl.json','package-config/package.back.json','src/package.ts'])
    })
}
