#!/usr/bin/env node

const { execSync } = require("child_process");

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("请传入要添加的组件名，例如: node scripts/addComponent.ts @magicui/icon-cloud");
  process.exit(1);
}

const componentName = args[0];
const command = `pnpm dlx shadcn@latest add ${componentName} -c packages/ui`;

console.log(`执行命令: ${command}`);

try {
  execSync(command, { stdio: "inherit" });
} catch (e: any) {
  console.error("命令执行失败:", e.message || e);
  process.exit(1);
}