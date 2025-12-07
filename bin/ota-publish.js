#!/usr/bin/env node

// ESM wrapper for CLI
import('../dist/cli/index.mjs').catch((error) => {
  console.error('Failed to load CLI:', error);
  process.exit(1);
});
