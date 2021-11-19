import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { loadJestRunConfig } from './utils'

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
	private counter:number = 0
	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
		}

		if (element) { // 如果还有的话
			let deps = [new Dependency('模块覆盖率', '向军', vscode.TreeItemCollapsibleState.None, {
				command: 'vtools.tRun',
				title: '跑起来',
				arguments: ['']
			})]
			return Promise.resolve(deps)
		} else {
			let coverageModule = loadJestRunConfig()
			let coverageArr: Dependency[] = []
			console.log(coverageModule);
			for (const key in coverageModule) {
				const element = coverageModule[key];
				coverageArr.push(new Dependency(key, '向军', vscode.TreeItemCollapsibleState.None,{
					command: 'vtools.test',
					title: key,
					arguments: [{...element, key:key}]
				}))
			}
			return Promise.resolve(coverageArr)
		}

	}
	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	 private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
		 this.counter ++
		 if(this.counter <= 1){
			//  new Dependency('moduleName', 'version', vscode.TreeItemCollapsibleState.Collapsed),
			return [new Dependency('模块覆盖率', '向军', vscode.TreeItemCollapsibleState.None, {
				command: 'vtools.tRun',
				title: '跑起来',
				arguments: ['']
			})]
		 }else {
			 return []
		 }
	 }

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}
}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private readonly version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}
