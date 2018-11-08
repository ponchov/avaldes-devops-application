import program from 'commander';

const pkg = require('../package.json');

// uses commander for passing in new config from secure location, runtime load
program
  .version(pkg.version)
  .option('--config <path>', 'set config path')
  .option('--debug', 'debug flag to display debug in stdout')
  .parse(process.argv);

export default program;
