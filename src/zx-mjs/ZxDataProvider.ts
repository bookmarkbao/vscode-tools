/*
 * @Descripttion: 
 * @Author: xiangjun
 * @Date: 2021-11-20 17:10:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-24 23:33:44
 */
import { window, ExtensionContext, Uri, commands, Command, TreeDataProvider, Event, TreeItem, TreeItemCollapsibleState, ProviderResult } from "vscode";
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../config'

class ZxDataProvider implements TreeDataProvider<ZxDataItem> {
    onDidChangeTreeData?: Event<ZxDataItem | null | undefined> | undefined;
    data: ZxDataItem[];

    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // { command: 'fileExplorer.openFile', title: "Open File", arguments: [element.uri], }
        this.data = [
            new ZxDataItem('task-01',
                {
                    fileName: '__todo__/task01.mjs',
                    filePath: path.join(Config.root, '__todo__/task01.mjs')
                },{
                command: 'zxExplorer.openFile',
                title: 'task01.mjs',
                arguments: [Uri.file(path.join(Config.root, '__todo__/task01.mjs'))]
            }),
            new ZxDataItem('task-02',
                {
                    fileName: '__todo__/task02.mjs',
                    filePath: path.join(Config.root, '__todo__/task02.mjs')
                },{
                command: 'zxExplorer.openFile',
                title: 'task02.mjs',
                arguments: [Uri.file(path.join(Config.root, '__todo__/task02.mjs'))]
            }),
            new ZxDataItem('task-03',
                {
                    fileName: '__todo__/task03.mjs',
                    filePath: path.join(Config.root, '__todo__/task03.mjs')
                },{
                command: 'zxExplorer.openFile',
                title: 'task03.mjs',
                arguments: [Uri.file(path.join(Config.root, '__todo__/task03.mjs'))]
            }),
            new ZxDataItem('task-04',
                {
                    fileName: '__todo__/task04.mjs',
                    filePath: path.join(Config.root, '__todo__/task04.mjs')
                },{
                command: 'zxExplorer.openFile',
                title: 'task04.mjs',
                arguments: [Uri.file(path.join(Config.root, '__todo__/task04.mjs'))]
            }),
            new ZxDataItem('task-05',
                {
                    fileName: '__todo__/task05.mjs',
                    filePath: path.join(Config.root, '__todo__/task05.mjs')
                },{
                command: 'zxExplorer.openFile',
                title: 'task05.mjs',
                arguments: [Uri.file(path.join(Config.root, '__todo__/task05.mjs'))]
            })
        ];
    }

    refresh() {
		this._onDidChangeTreeData.fire();
	}

    getTreeItem(element: ZxDataItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    // getTreeItem(element: ZxDataItem): TreeItem | Thenable<TreeItem> {
	// 	const treeItem = new vscode.TreeItem(element.uri, element.type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
	// 	if (element.type === vscode.FileType.File) {
	// 		treeItem.command = { command: 'fileExplorer.openFile', title: "Open File", arguments: [element.uri], };
	// 		treeItem.contextValue = 'file';
	// 	}
	// 	return treeItem;
	// }

    getChildren(element?: ZxDataItem | undefined): ProviderResult<ZxDataItem[]> {
        if (element === undefined) {
            return this.data
        }
        return element.children;
    }
}

class ZxDataItem extends TreeItem {
    public children: ZxDataItem[] | undefined;
    public filePath: string | undefined

    constructor(label: string, options: any, command: Command | undefined, children?: ZxDataItem[] | undefined) {
        super()
        this.label = label
        this.filePath = options.filePath
        this.fileName = options.fileName
        this.contextValue = "zxCommand"
        this.collapsibleState = TreeItemCollapsibleState.None
        this.children = children
        this.command = command
    }
}

// 读取当前的terminal
export const getTerminal = (terminalName: string) => {
    return window.terminals.find((t) => t.name === terminalName);
};

export class ZxExplorer {
    constructor(context: ExtensionContext) {
        commands.registerCommand('zxExplorer.openFile', (resource) => this.openResource(resource));
        commands.registerCommand('zxExplorer.zxRun',(info: ZxDataItem)=>{
            console.log('run',info)
            console.log('run',info instanceof ZxDataItem )
            // const pathFile = path.join(Config.root, info.key);
            if (info instanceof ZxDataItem && fs.existsSync(info.filePath)) {
                const command = `zx ${info.filePath}`
                let terminal = getTerminal(info.filePath.match(/\w*.mjs/)[0]);
                if (!terminal) {
                  terminal = window.createTerminal(info.filePath.match(/\w*.mjs/)[0]);
                }
                terminal.show();
                terminal.sendText(command.trim());
             } else if(fs.existsSync(info._fsPath)){
                const command = `zx ${info._fsPath}`
                let terminal = getTerminal(info._fsPath.match(/\w*.mjs/)[0]);
                if (!terminal) {
                  terminal = window.createTerminal(info._fsPath.match(/\w*.mjs/)[0]);
                }
                terminal.show();
                terminal.sendText(command.trim());
             } else {
                window.showErrorMessage(`${info.fileName}配置文件不存在，请检查！`, 300);
            }
       })
       const treeDataProvider = new ZxDataProvider();
       context.subscriptions.push(window.createTreeView('taskCommandView', { treeDataProvider }));
    }
    private openResource(resource: Uri): void {
        if(fs.existsSync(resource.path)) {
            window.showTextDocument(resource);
        }else{
            let fileName = resource.path.match(/\w*\/\w*.mjs/)[0]
            window.showErrorMessage(`${fileName}配置文件不存在，请检查！`, 300);
        }
    }
}