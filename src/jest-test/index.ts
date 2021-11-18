import * as path from "path";
import { getTerminal, yarnOrNpm } from "../utils";
import { window, debug, workspace, DebugConfiguration } from "vscode";
import { TERMINAL_NAME } from "../constants";
import { loadJestConfig, getFilenameByCurrentDirectory } from "../utils";

export const DEFAULT_TEST_FILE_PATTERNS = [
  "**/*.{test,spec}.{js,jsx,ts,tsx}",
  "**/__tests__/*.{js,jsx,ts,tsx}",
];
export type TestableNode = {
  name: string;
  file: string;
  type: "it" | "describe" | "root";
  children: Array<TestableNode>;
};
export type ArgumentQuotesMode = "none" | "auto" | "single" | "double";

export const quoteArgument = (
  argumentToQuote: string,
  quotesToUse?: ArgumentQuotesMode
): string => {
  // Decide which quotes to use
  if (quotesToUse === undefined) {
    quotesToUse = "auto";
  }
  if (quotesToUse === "auto") {
    // Note: maybe we should not quote argument if it does not contain spaces?
    quotesToUse = process.platform === "win32" ? "double" : "single";
  }

  switch (quotesToUse) {
    case "double":
      return `"${argumentToQuote.replace(/"/g, '\\"')}"`;
    case "single":
      return `'${argumentToQuote.replace(/'/g, "\\'")}'`;
    default:
      return argumentToQuote;
  }
};

export const quoteTestName = (
  testName: string,
  quotesToUse?: ArgumentQuotesMode
) => {
  // We pass test name exactly as it typed in the source code, but jest expects a regex pattern to match.
  // We must escape characters having a special meaning in regex, otherwise jest will not match the test.
  // For example, jest -t 'My test (snapshot)' will simply not match corresponding test (because of parens).
  // The correct command would be jest -t 'My test \(snapshot\)'
  const escapedTestName = testName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return quoteArgument(escapedTestName, quotesToUse);
};

export const DEFAULT_JEST_PATH = path.join("node_modules", ".bin", "jest");
export const DEFAULT_JEST_DEBUG_PATH_WINDOWS = path.join(
  "node_modules",
  "jest",
  "bin",
  "jest.js"
);

const convertEnvVariablesToObj = (env: string) => {
  const obj = (env.split(" ") as string[])
    .filter((v: string) => !!v)
    .reduce((acc, v) => {
      const [key, val] = v.split("=");
      acc[key] = val;
      return acc;
    }, {} as { [key: string]: string });

  return obj;
};
export const runTest = (
  filePath: string,
  testName?: string,
  updateSnapshots = false
) => {
  const jestPath = "test:unit";
  const jestConfigPath = "";
const environmentVarialbes: string = "yarn";
  // const environmentVarialbes: string = yarnOrNpm();
  // const argNpm =
    // environmentVarialbes === "yarn" ? "--collectCoverage=false" : "-- --collectCoverage=false";
  // 'collectCoverage': false,
  // 'collectCoverageFrom': ['src/**/*.{js,vue}', '!**/node_modules/**']
  const jestConfig = loadJestConfig()
  const collectCoverage = jestConfig?.collectCoverage || false
  const collectCoverageFrom = jestConfig?.collectCoverageFrom || ['']

  const runOptions: string[] = [ `--collectCoverage=${collectCoverage}`];
  console.log('collectCoverageFrom',collectCoverageFrom);
  // 判断是否为目录，如果是则直接扫描
  if(filePath.endsWith('.spec.js')){
    const curDirFilename = getFilenameByCurrentDirectory(filePath)
    runOptions.push(`filename=${curDirFilename}`)
  }else{
    runOptions.push(filePath)
  }
  runOptions.push('--colors')
 
  let command = `${environmentVarialbes} ${jestPath} ${quoteTestName(
    filePath
  )}`;
  if (testName) {
    command += ` -t ${quoteTestName(testName)}`;
  }
  if (jestConfigPath) {
    command += ` -c ${jestConfigPath}`;
  }
  if (updateSnapshots) {
    command += " -u";
  }
  if (runOptions) {
    runOptions.forEach((option) => {
      command += ` ${option}`;
    });
  }
  let terminal = getTerminal(TERMINAL_NAME);
  if (!terminal) {
    terminal = window.createTerminal(TERMINAL_NAME);
  }
  terminal.show();
  terminal.sendText(command.trim());
};

export const debugTest = (filePath: string, testName?: string) => {
  const editor = window.activeTextEditor;
  const jestPath = DEFAULT_JEST_DEBUG_PATH_WINDOWS;
  const jestConfigPath = "";
  const jestCLIOptions: string[] = [];
  const environmentVarialbes: string = "yarn run test:unit";
  const args = [filePath];
  if (testName) {
    args.push("-t", quoteTestName(testName, "none"));
  }
  if (jestConfigPath) {
    args.push("-c", jestConfigPath as string);
  }
  if (jestCLIOptions) {
    jestCLIOptions.forEach((option) => {
      args.push(option);
    });
  }
  args.push("--runInBand");
  const debugConfig: DebugConfiguration = {
    console: "integratedTerminal",
    internalConsoleOptions: "neverOpen",
    name: "JestRunIt",
    program: "${workspaceFolder}/" + jestPath,
    request: "launch",
    type: "node",
    args,
    env: convertEnvVariablesToObj(environmentVarialbes),
  };
  debug.startDebugging(
    workspace.getWorkspaceFolder(editor!.document.uri),
    debugConfig
  );
};
