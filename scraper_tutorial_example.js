//this is the example from the tutorial

const puppeteer = require("puppeteer");

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://news.ycombinator.com/", {
        waitUntil: "networkidle0",
      });

      let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll("a.titlelink");

        items.forEach((item) => {
          results.push({
            url: item.getAttribute("href"),
            text: item.innerText,
          });
        });
        return results;
      });
      await browser.close();
      resolve(urls);
    } catch (e) {
      reject(e);
    }
  });
}

run()
  .then((items) => console.log(items))
  .catch(console.error);
