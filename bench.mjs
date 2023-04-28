import { execSync } from 'child_process';
import { scaffold, noAliasProjectPath, withAliasProjectPath } from './scaffold.mjs';
import fs from 'fs/promises';

(async () => {
  const totalRuns = 10;

  let noAliasAvgTime = 0, withAliasAvgTime = 0;

  for (let i = 0; i < totalRuns; i++) {
    const [noAliasTime, withAliasTime] = getBenchValues();

    noAliasAvgTime += +noAliasTime;
    withAliasAvgTime += +withAliasTime;
  }

  noAliasAvgTime = noAliasAvgTime / totalRuns;
  withAliasAvgTime = withAliasAvgTime / totalRuns;

  console.log(`
  Avg of ${totalRuns}
  No type alias: ${noAliasAvgTime.toFixed(2)}s
  With type alias: ${withAliasAvgTime.toFixed(2)}s
  `);
})();

function getBenchValues() {
  const noAliasStart = performance.now();
  execSync(`npx tsc --noEmit`, { cwd: noAliasProjectPath, stdio: 'inherit' })
  const noAliasEnd = performance.now();

  process.chdir(withAliasProjectPath);

  const withAliasStart = performance.now();
  execSync(`npx tsc --noEmit`, { cwd: withAliasProjectPath, stdio: 'inherit' });
  const withAliasEnd = performance.now();

  return [((noAliasEnd - noAliasStart) / 1000).toFixed(2), ((withAliasEnd - withAliasStart) / 1000).toFixed(2)]
}
