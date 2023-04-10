/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const checkProjectName = () => {
  if (packageJson.name === "ChatEase") {
    throw new Error("Please change the project name in package.json");
  }
};

try {
  checkProjectName();
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
