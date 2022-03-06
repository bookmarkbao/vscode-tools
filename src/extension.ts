/*
 * @Descripttion:
 * @Author: xiangjun
 * @Date: 2021-11-18 09:26:07
 * @LastEditors: xiangjun02
 * @LastEditTime: 2022-03-06 23:43:00
 */
import { ExtensionContext, window } from "vscode";
// easySnippet
import SnippetTool from './easy-snippet/index'
// 读取当前的terminal
export const getTerminal = (terminalName: string) => {
  return window.terminals.find((t) => t.name === terminalName);
};

export async function activate(ext: ExtensionContext) {
  SnippetTool.install(ext)
}

export async function deactivate() {
  SnippetTool.uninstall()
}
