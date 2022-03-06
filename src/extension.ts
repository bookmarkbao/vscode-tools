/*
 * @Descripttion:
 * @Author: xiangjun
 * @Date: 2021-11-18 09:26:07
 * @LastEditors: xiangjun02
 * @LastEditTime: 2022-03-06 21:28:27
 */
import { ExtensionContext, commands, window, workspace } from "vscode";
import { ctx } from "./Context";
import { basename } from "path";
// import { executeCommand } from "./terminal";
// import { TERMINAL_NAME } from "./constants";
// import { loadPackageJSON, loadJestConfig} from './utils'

// easySnippet
import SnippetNodeProvider from "./easy-snippet/SnippetNodeProvider";
import easyUtils from "./easy-snippet/utils";
// console.log(easySnippet);

// 读取当前的terminal
export const getTerminal = (terminalName: string) => {
  return window.terminals.find((t) => t.name === terminalName);
};

export async function activate(ext: ExtensionContext) {
  ctx.ext = ext;

  // 左侧命令
  // const rootPath = (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0))
  //   ? workspace.workspaceFolders[0].uri.fsPath : undefined;
  // console.log(rootPath)

  // commands.registerCommand("vtools.test", (testInfo: any) => {
  //   // executeCommand("tree");
  //   //  runTestByCommand(testInfo)
  // });

  let provider = new SnippetNodeProvider();
  let explorer = window.createTreeView("snippetExplorer", {
    treeDataProvider: provider,
  });
  provider.tree = explorer;
  ext.subscriptions.push(
    // vscode.window.registerTreeDataProvider('snippetExplorer', provider),
    commands.registerCommand(
      "snippetExplorer.refresh",
      provider.refresh.bind(provider)
    ),
    commands.registerCommand(
      "snippetExplorer.addGroup",
      provider.addGroup.bind(provider)
    ),
    commands.registerCommand(
      "snippetExplorer.addSnippet",
      provider.addSnippet.bind(provider)
    ),
    commands.registerCommand(
      "snippetExplorer.editGroup",
      provider.editGroup.bind(provider)
    ),
    commands.registerCommand(
      "snippetExplorer.deleteGroup",
      provider.deleteGroup.bind(provider)
    ),
    commands.registerCommand(
      "snippetExplorer.deleteSnippet",
      provider.deleteSnippet.bind(provider)
    ),
    commands.registerCommand(
      "snippetExplorer.editSnippet",
      provider.editSnippet.bind(provider)
    ),
    commands.registerCommand(
      "snippetExplorer.search",
      provider.search.bind(provider)
    ),
    commands.registerCommand("snippetExplorer.open", function () {
      explorer.reveal(provider.getChildren('')[0]);
    }),
    commands.registerCommand("easySnippet.run", async function () {
      let text = easyUtils.getSelectedText();
      if (!text)
        return window.showWarningMessage(
          "can't convert to snippet by select nothing"
        );
      let label = window?.activeTextEditor?.document?.languageId;
      provider.addSnippet({ label }, null);
    }),
    workspace.onDidSaveTextDocument(function (e) {
      if (
        e.fileName.endsWith(".json") &&
        e.fileName.startsWith(easyUtils.vsCodeSnippetsPath)
      )
        return provider.refresh();
      if (!e.fileName.endsWith(".snippet")) return;
      let name = basename(e.fileName, ".snippet");
      let ss = name.split(".");
      if (ss.length != 2) return;
      let key = Buffer.from(ss[0].replace(/-/g, "/"), "base64").toString();
      let languageId = ss[1];
      provider.saveSnippet(languageId, key, e.getText());
      provider.refresh();
    })
  );
}

export async function deactivate() {
  await easyUtils.clearCaches();
}
