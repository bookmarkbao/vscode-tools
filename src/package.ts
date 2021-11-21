import fs from 'fs-extra'
// json直接映射为类型
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'
import { configCommands } from './package-config/index'

// contributes 信息取自别处
// 其余的全来package.json
export async function getPackage() {
  // 原始信息package.json
  const pkg = await fs.readJSON(r('package.back.json')) as typeof PkgType
  // 配置信息来自模版
  const pkgTpl = await fs.readJSON(r('package.tpl.json')) as typeof PkgType
  if (isDev) {
    // delete pkgJson.content_scripts
    // pkgJson.permissions?.push('webNavigation')
  }
  let contributes = pkgTpl.contributes
      contributes.commands = configCommands
  
  // 赋值回去
  pkg.contributes = contributes
  pkg.test123 = 'ok123444'
  return pkg
}
