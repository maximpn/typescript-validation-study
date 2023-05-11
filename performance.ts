import { testCases } from './validation-data';
import { TestCases, Validators, solutions } from '.';
import * as _ from 'lodash';
const { performance } = require('perf_hooks');

const PERFORMANCE_CYCLES = 10000;
const testCasesResults = runPerformanceTest(
  testCases,
  solutions,
  PERFORMANCE_CYCLES
);

console.table(testCasesResults);

function runPerformanceTest(
  testCases: TestCases,
  solutions: [string, Validators][],
  repeatCycles: number
): Record<string, Record<string, string>> {
  const testCasesResults: Record<string, Record<string, string>> = {};

  for (const testCase of testCases) {
    const testCaseResults: Record<string, string> = {};
    const testCaseName = `${testCase.schema}: ${testCase.id} [${String(
      testCase.result
    ).toUpperCase()}]`;

    console.log(`Running ${testCaseName}...`);

    for (const [solutionName, solutionModule] of solutions) {
      console.log(`\t${solutionName}`);
      const validator = solutionModule[testCase.schema];

      if (!validator) {
        continue;
      }

      const validatorWrapper = testCase.result
        ? () => validator(_.cloneDeep(testCase.data))
        : () => {
            try {
              validator(_.cloneDeep(testCase.data));
            } catch {}
          };

      const execTime = measureNTimesExecTime(validatorWrapper, repeatCycles);

      testCaseResults[solutionName] = execTime.toFixed(2);
    }

    testCasesResults[testCaseName] = testCaseResults;
  }

  return testCasesResults;
}

function measureNTimesExecTime(fn: () => void, n: number): number {
  const start = performance.now();

  for (let i = 0; i < n; ++i) {
    fn();
  }

  const end = performance.now();

  return end - start;
}
