/*
 * @Descripttion: 
 * @Author: xiangjun02
 * @Date: 2022-03-06 16:55:50
 * @LastEditors: xiangjun02
 * @LastEditTime: 2022-03-06 19:23:58
 */
import * as path from 'path';
export const DEFAULT_TEST_FILE_PATTERNS = [
  '**/*.{test,spec}.{js,jsx,ts,tsx}',
  '**/__tests__/*.{js,jsx,ts,tsx}',
];

export const DEFAULT_JEST_PATH = path.join('node_modules','.bin', 'jest');
export const DEFAULT_JEST_DEBUG_PATH_WINDOWS = path.join('node_modules', 'jest', 'bin', 'jest.js');

export const TERMINAL_NAME = 'JestRunIt';