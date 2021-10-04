#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package');
const commandConfig = require('../src/commandConfig');

program.version(packageJson.version);

Object.keys(commandConfig).forEach((command) => {
  const { alias, description, options = [], action } = commandConfig[command];

  const commandHandler = program
    .command(command)
    .alias(alias)
    .description(description)
    .action(action);

  options.forEach(({ command: optionCommand, description: optionDescription }) => {
    commandHandler.option(optionCommand, optionDescription);
  });
});

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
