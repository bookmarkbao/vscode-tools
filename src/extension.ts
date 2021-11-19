/*
 * @Descripttion: 
 * @Author: xiangjun
 * @Date: 2021-11-18 09:26:07
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-19 16:28:05
 */
import { ExtensionContext, commands, window, workspace } from "vscode";
import { ctx } from "./Context";
import { executeCommand } from "./terminal";
import { TERMINAL_NAME } from "./constants";
import { runTest, runTestByCommand } from "./jest-test/index";
// import { loadPackageJSON, loadJestConfig} from './utils'
import { DepNodeProvider } from './nodeDependencies';

// 读取当前的terminal
export const getTerminal = (terminalName: string) => {
  return window.terminals.find((t) => t.name === terminalName);
};

export async function activate(ext: ExtensionContext) {
  ctx.ext = ext;
  // 左侧命令
  const rootPath = (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0))
  ? workspace.workspaceFolders[0].uri.fsPath : undefined;
  	// Samples of `window.registerTreeDataProvider`
	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);



  commands.registerCommand("vtools.test", (testInfo:any) => {
    // executeCommand("tree");
     runTestByCommand(testInfo)
  });
  

  // sRun
  commands.registerCommand("vtools.runTest", (uri) => {
    let filePath = uri?._fsPath.replace(workspace.rootPath || "", "") || "";
    // 根据路径去匹配文件，看文件中是否已经有配置
    if(filePath){
      runTest(filePath);
    }else{
      window.showErrorMessage('❗️ 路径不正确，请检查')
    }
  });

  // 跑起来
  commands.registerCommand("vtools.tRun", () => {
    // {
    //   scheme: "file",
    //   authority: "",
    //   path: "/i:/ws-plugins/vue-unit-test-with-jest/vue-unit-test-with-jest/tests/unit/AxiosTest.spec.js",
    //   query: "",
    //   fragment: "",
    //   _formatted: "file:///i%3A/ws-plugins/vue-unit-test-with-jest/vue-unit-test-with-jest/tests/unit/AxiosTest.spec.js",
    //   _fsPath: "i:\\ws-plugins\\vue-unit-test-with-jest\\vue-unit-test-with-jest\\tests\\unit\\AxiosTest.spec.js",
    // }
    const command = "yarn test:unit";
    let terminal = getTerminal(TERMINAL_NAME);
    if (!terminal) {
      terminal = window.createTerminal(TERMINAL_NAME);
    }
    terminal.show();
    terminal.sendText(command.trim());
    executeCommand("ls");
  });
}

// export async function deactivate() {
//   closeTerminal();
// }
