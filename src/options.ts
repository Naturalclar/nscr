import program from "commander";

const { version } = require("../package.json");

program
  .version(version, "-v, --version", "output the current version")
  .description("display version info of given npm package");

export type Options = {
  all?: boolean;
  args: string[];
};

export const parse = (args: string[]): Options =>
  program.parse(args) as Options;
