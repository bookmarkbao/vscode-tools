import * as path from "path";
import { getTerminal, yarnOrNpm } from "../utils";
import { window, debug, workspace, DebugConfiguration } from "vscode";

export const mergeSIT = ()=>{
    // console.log('代码切换到SIT');
    // console.log('当前分支：feature -> SIT');
    let command =  `zx zx.test.mjs`
    let terminal = getTerminal('shell-terminal');
    if (!terminal) {
      terminal = window.createTerminal('shell-terminal');
    }
    terminal.show();
    terminal.sendText('代码切换到SIT')
    terminal.sendText('当前分支：feature -> SIT')
    terminal.sendText(command.trim());


}

export const mergeUAT = ()=>{

}

export const mergePRE = ()=>{
    
}