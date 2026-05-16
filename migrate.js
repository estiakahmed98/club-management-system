#!/usr/bin/env node

// Load environment variables
const path = require('path');
const env = require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('[v0] Environment variables loaded:', Object.keys(env.parsed || {}));

const { spawn } = require('child_process');

const prismaEnv = {
  ...process.env,
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
};

console.log('[v0] POSTGRES_PRISMA_URL:', prismaEnv.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET');

const child = spawn('npx', ['prisma', 'migrate', 'dev', '--name', 'init'], {
  stdio: 'inherit',
  env: prismaEnv,
  cwd: __dirname,
});

child.on('exit', (code) => {
  process.exit(code);
});
