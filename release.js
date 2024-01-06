const execSync = require("child_process").execSync;
const fs = require("fs");

const changes = parseInt(execSync("git status -s | wc -l"));
if (changes > 0) {
    console.error("commit or stash your changes first");
    return;
}

const rootPackage = require("./package.json");
const commonPackage = require("./packages/common/package.json");
const mainPackage = require("./packages/main/package.json");
const rendererPackage = require("./packages/renderer/package.json");

const args = process.argv.slice(2);
const newVersion = args[0];
const oldVersion = rootPackage.version;

if (!newVersion) {
    console.error("input newVersion");
    return;
}

if (newVersion === oldVersion) {
    console.error("input different version");
    return;
}

rootPackage.version = newVersion;
commonPackage.version = newVersion;
mainPackage.version = newVersion;
rendererPackage.version = newVersion;
mainPackage.dependencies["@clamcurry/common"] = newVersion;
rendererPackage.devDependencies["@clamcurry/common"] = newVersion;

fs.writeFileSync("package.json", JSON.stringify(rootPackage, null, 4) + "\n");
fs.writeFileSync(
    "packages/common/package.json",
    JSON.stringify(commonPackage, null, 4) + "\n",
);
fs.writeFileSync(
    "packages/main/package.json",
    JSON.stringify(mainPackage, null, 4) + "\n",
);
fs.writeFileSync(
    "packages/renderer/package.json",
    JSON.stringify(rendererPackage, null, 4) + "\n",
);

execSync(`git commit -am 'Release v${newVersion}'`);
execSync(`git tag v${newVersion}`);
execSync("git push --tags");

console.log("release finish");
