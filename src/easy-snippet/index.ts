/*
 * @Descripttion: 
 * @Author: xiangjun02
 * @Date: 2022-03-06 23:34:15
 * @LastEditors: xiangjun02
 * @LastEditTime: 2022-03-06 23:45:33
 */
import { ExtensionContext, commands, window, workspace } from "vscode";
import SnippetNodeProvider from "./SnippetNodeProvider";
import easyUtils from "./utils";
const activate = (ext: ExtensionContext)=>{
    let provider = new SnippetNodeProvider();
    let explorer = window.createTreeView("snippetExplorer", {
      treeDataProvider: provider,
    });
    provider.tree = explorer;
    ext.subscriptions.push(
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

export default {
    install: activate,
    uninstall : easyUtils.clearCaches
}