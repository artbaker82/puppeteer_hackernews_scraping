const puppeteer = require("puppeteer");

//the first 2 arguments are arguments to the shell, so we start with index 2 to get the input
const url = process.argv[2];

if (!url) {
  throw "Please provide a URL as the first argument";
}

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: "screenshot.jpg" });
  browser.close();
}

run();
