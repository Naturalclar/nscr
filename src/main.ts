import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import { sync as which } from "which";
import { cwd } from "process";

const linkText = chalk.white.bold.underline;
const boldText = chalk.white.bold;

const listScripts = () => {
  // check if peco exists. Throw error if peco does not exist
  try {
    which("peco");
  } catch (error) {
    console.log(
      `${boldText("peco not found.")} \nThis tool requires ${boldText(
        "peco"
      )}, which can be found at ${linkText("https://github.com/peco/peco")}`
    );
    process.exit(1);
  }

  // Display packages in package.json
  try {
    const pkg = require(path.join(cwd(), "package.json"));
    // if package.json does not exist, throw error
    if (!pkg) {
      console.error(`${boldText("package.json not found.")}`);
      process.exit(1);
    }
    if (!pkg.scripts) {
      console.error(`${boldText("no npm scripts found.")}`);
    }

    const scripts = Object.keys(pkg.scripts).map(
      (key: string) => `${key}###${pkg.scripts[key]}`
    );

    const targetScripts = execSync(
      `yarn $(echo \"${scripts.join("\n")}\" | peco | cut -d# -f1)`
    );
    const targetScriptsString = targetScripts.toString().trim();
    console.log(targetScriptsString);
  } catch (error) {
    if (error.message.includes("Cannot find module")) {
      console.error(
        `${boldText("package.json not found.")} \nMake sure ${boldText(
          "package.json"
        )} is included in your current working directory.`
      );
      process.exit(1);
    }
    console.error(error.message);
    process.exit(1);
  }
};

export const main = () => {
  listScripts();
  process.exit(0);
};
