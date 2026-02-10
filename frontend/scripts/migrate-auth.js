/**
 * Run better-auth migrations to create required tables (including jwks)
 * Run with: node scripts/migrate-auth.js
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Running better-auth migrations...');
console.log('This will create the jwks table required for JWT authentication.\n');

try {
  // Run migration with auto-confirm
  execSync('npx @better-auth/cli migrate --yes', {
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  console.log('\n✅ Migration completed successfully!');
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.log('\nYou can also run the migration manually:');
  console.log('  cd frontend');
  console.log('  npx @better-auth/cli migrate');
  process.exit(1);
}

rl.close();
