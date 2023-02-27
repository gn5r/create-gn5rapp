import { resolve, join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

import minimist from "minimist";
import { initPrompts, renderTemplate, installDependencies } from "./utils";

import type { Context } from "./utils/prompts";

async function run() {
  const argv = minimist(process.argv.slice(2));

  const defaultProjectName = argv._[0] ? argv._[0] : undefined;

  const context: Context = {
    cwd: process.cwd(),
    projectName: defaultProjectName,
  };

  const { cwd, projectName, author, version, usePackageManager } =
    await initPrompts(context);

  const projectRoot = join(cwd, projectName);
  mkdirSync(projectRoot);
  writeFileSync(
    resolve(projectRoot, "package.json"),
    JSON.stringify(
      {
        name: projectName,
        version: version,
        author: author,
      },
      null,
      2
    )
  );

  const templatePath = resolve(__dirname, "../template");
  renderTemplate(resolve(templatePath, "default"), projectRoot);

  if (usePackageManager) {
    console.log(`Installing dependencies with ${usePackageManager}...\n`);
    installDependencies(projectRoot, usePackageManager);
  }
}

run()
  .then(() => {
    console.log("Created Project");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
