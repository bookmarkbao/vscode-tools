/*
 * @Descripttion: 
 * @Author: xiangjun02
 * @Date: 2022-03-06 16:55:50
 * @LastEditors: xiangjun02
 * @LastEditTime: 2022-03-06 20:03:58
 */
import fs from 'fs-extra'
// json直接映射为类型
import type PkgType from '../package.json'
import { r, isDev } from '../scripts/utils'

// contributes 信息取自别处
// 其余的全来package.json
export async function getPackage() {
  // 原始信息package.json
  const pkg = await fs.readJSON(r('package-config/package.back.json')) as typeof PkgType
  // 配置信息来自模版
  // const pkgTpl = await fs.readJSON(r('package-config/package.tpl.json')) as typeof PkgType
  const { activationEvents = {}, contributes = {}, extensionKind = [] } = await fs.readJSON(r('package-config/package.easy-snippet.json')) as typeof PkgType
  if (isDev) {
    // delete pkgJson.content_scripts
    // pkgJson.permissions?.push('webNavigation')
  }

  // 赋值回去
  return {...pkg, activationEvents, contributes, extensionKind}
}
