/*
 * @Descripttion: 
 * @Author: xiangjun
 * @Date: 2021-11-20 17:10:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-21 00:09:25
 */
import { window, ExtensionContext, Uri, commands, Command, TreeDataProvider, Event, TreeItem, TreeItemCollapsibleState, ProviderResult } from "vscode";
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { loadJestRunConfig } from '../utils'
import { Config } from "../config";

// 'test_orderIndex.spec.js': {
//     testPath: 'orderList/index.spec.js',
//     collectCoverageFrom: [
//         'src/views/Content/orderManager/orderList/index.vue'
//     ]
// }
interface CoverageItem{
    testPath: string,
    collectCoverageFrom: string[]
}

class JestDataProvider implements TreeDataProvider<JestDataItem> {
    onDidChangeTreeData?: Event<JestDataItem | null | undefined> | undefined;
    data: JestDataItem[];

    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.data = []
        this.loadData()
        // this.data = coverageArr
        // this.data = [
        //     new JestDataItem('line1', [new JestDataItem('line1-sub1'), new JestDataItem('line1-sub2')]),
        //     new JestDataItem('line2', [new JestDataItem('line2-sub1'), new JestDataItem('line2-sub2')]),
        //     new JestDataItem('line3', [new JestDataItem('line3-sub1'), new JestDataItem('line3-sub2')])
        // ];
    }

    loadData(){
        // console.log('刷新啦～～～');
        // this.data = []
        // const pathDir = path.join(Config.root, "tests/unit/__utils__/index.js");
        // delete require.cache[require.resolve(pathDir)]
        // const pkg = require(pathDir)
        // console.log(222, pkg);
        let coverageModule = loadJestRunConfig()
        let coverageArr: JestDataItem[] = []
        for (const key in coverageModule) {
            const element: CoverageItem = coverageModule[key];
            coverageArr.push(new JestDataItem(key, element, [new JestItemDetail(`路径：${element.testPath}`), ...element.collectCoverageFrom.map(val=>new JestItemDetail(`覆盖率：${val}`))] , {
                command: 'vtools.test',
                title: key,
                arguments: [{ ...element, key: key }]
            }))
        }
        this.data = coverageArr
        // console.log(111, this.data);
    }

    refresh() {
        this.loadData()
		this._onDidChangeTreeData.fire();
	}

    getTreeItem(element: JestDataItem | JestItemDetail): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: JestDataItem | JestItemDetail | undefined): ProviderResult<JestDataItem[] | JestItemDetail[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}

class JestItemDetail extends TreeItem{
    constructor(label: string){
        super()
        this.children = undefined
        this.label = label
    }

    iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};
}

class JestDataItem extends TreeItem {
    public children: JestDataItem[] | undefined;
    public testPath?: String
    public collectCoverageForm?: string[]
    constructor(label: string, coverageItem: CoverageItem, children?: JestItemDetail[] | undefined, command: Command | undefined) {
        super()
        // super(label, children === undefined ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Expanded);
        this.label = label
        this.contextValue = "snippet"
        this.collapsibleState = TreeItemCollapsibleState.Collapsed
        this.children = children
        this.testPath = coverageItem.testPath
        this.collectCoverageForm = coverageItem.collectCoverageFrom
        this.command = command
        // this.tooltip = this.testPath + '\n'+ this.collectCoverageForm
    }
}


export class JestExplorer {
    constructor(context: ExtensionContext) {
        const treeDataProvider = new JestDataProvider();
        context.subscriptions.push(window.createTreeView('jestCoverageView', { treeDataProvider }));
        // vscode.commands.registerCommand('fileExplorer.openFile', (resource) => this.openResource(resource));
        commands.registerCommand('jestExplorer.refresh',()=>{
            console.log('jestExplorer.refresh111');
            treeDataProvider.refresh()
       })
    }

    private openResource(resource: Uri): void {
        window.showTextDocument(resource);
    }
}