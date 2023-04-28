import fs from 'fs/promises';
import path from 'path';

async function exists(path) {
  try {
    await fs.stat(path);

    return true;
  } catch {
    return false;
  }
}

export const noAliasProjectPath = path.resolve('./no-alias-project');
export const withAliasProjectPath = path.resolve('./with-alias-project');

export const projectFilesCount = 500;
export const variablesCount = 100;

export async function scaffold() {
  if (await exists(noAliasProjectPath)) {
    await fs.rm(noAliasProjectPath, { recursive: true });
  }
  if (await exists(withAliasProjectPath)) {
    await fs.rm(withAliasProjectPath, { recursive: true });
  }

  await fs.mkdir(noAliasProjectPath);
  await fs.mkdir(withAliasProjectPath);

  await fs.writeFile(path.resolve(noAliasProjectPath, 'tsconfig.json'), `
  {
    "compilerOptions": {
      "baseUrl": "."
    }
  }
  `)
  for (let i = 0; i < projectFilesCount; i++) {
    const dummyProjectFilename = path.resolve(noAliasProjectPath, `file_${i}.ts`);
  
    for (let j = 0; j < variablesCount; j++) {
      await fs.appendFile(dummyProjectFilename, `let file_${i}_variable_${j}: string | number = 'hello world!';\n`);
    }
  }

  await fs.writeFile(path.resolve(withAliasProjectPath, 'tsconfig.json'), `
  {
    "compilerOptions": {
      "baseUrl": "."
    }
  }
  `);

  await fs.writeFile(path.resolve(withAliasProjectPath, 'common.ts'), `export type StringOrNumber = string | number;`);

  for (let i = 0; i < projectFilesCount; i++) {
    const dummyProjectFilename = path.resolve(withAliasProjectPath, `file_${i}.ts`);
    await fs.appendFile(dummyProjectFilename, `import {StringOrNumber} from './common';\n`);

    for (let j = 0; j < variablesCount; j++) {
      await fs.appendFile(dummyProjectFilename, `let file_${i}_variable_${j}: StringOrNumber = 'hello world!';\n`);
      
    }
  }
}

