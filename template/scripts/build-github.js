import fs from "fs";
import { execSync } from "child_process";
import process from "process";

const args = process.argv.slice(2);
let versionPath = "";
const pathIndex = args.indexOf("--path");

if (pathIndex !== -1 && args.length > pathIndex + 1) {
  versionPath = args[pathIndex + 1];
}

const baseUrl = versionPath ? `/__PROJECT_NAME__/${versionPath}/` : "/__PROJECT_NAME__/";
const outDir = versionPath ? `dist/${versionPath}` : "dist";

console.log(`Building for ${versionPath ? "version: " + versionPath : "root"}...`);
console.log(`Base URL: ${baseUrl}`);
console.log(`Output Directory: ${outDir}`);

// Construct the Vite command
// We use --emptyOutDir true to ensure the target directory is clean.
// Using npx vite to ensure we use the local dependency if not in PATH, though scripts usually have it.
const cmd = `npx vite build --sourcemap=false --base=${baseUrl} --outDir ${outDir} --emptyOutDir false`;

const benchmarkPath = "src/pages/Benchmark.tsx";
let originalBenchmarkContent = "";
let modifiedBenchmark = false;

if (versionPath && fs.existsSync(benchmarkPath)) {
  console.log(`Injecting path "${versionPath}" into ${benchmarkPath}...`);
  originalBenchmarkContent = fs.readFileSync(benchmarkPath, "utf8");
  const newContent = originalBenchmarkContent.replace("###", versionPath);
  fs.writeFileSync(benchmarkPath, newContent);
  modifiedBenchmark = true;
}

console.log(`Running: ${cmd}`);

try {
  execSync(cmd, { stdio: "inherit" });
} catch (error) {
  console.error("Build failed.");
  process.exit(1);
} finally {
  if (modifiedBenchmark) {
    console.log(`Reverting ${benchmarkPath}...`);
    fs.writeFileSync(benchmarkPath, originalBenchmarkContent);
  }
}

