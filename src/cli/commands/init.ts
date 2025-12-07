import chalk from 'chalk';
import { initConfig } from '../config';

export async function init(cwd: string = process.cwd()): Promise<void> {
  try {
    console.log(chalk.bold('\n📝 Initializing OTA Updates configuration...\n'));
    
    await initConfig(cwd);
    
    console.log(chalk.green('✓ Created ota-updates.config.js'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('  1. Review and customize ota-updates.config.js'));
    console.log(chalk.gray('  2. Run: npx ota-publish --channel development'));
    console.log(chalk.gray('  3. Check ota-version.json for version tracking\n'));
  } catch (error: any) {
    console.error(chalk.red(`\n✖ Error: ${error.message}\n`));
    process.exit(1);
  }
}
