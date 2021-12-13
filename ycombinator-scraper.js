//this is my implementation before the reading the tutorial
const puppeteer = require("puppeteer");

const numberOfResults = process.argv[2];

if (!numberOfResults) {
  throw "Please enter how many results you would like to see";
}

//return list of aricles from hacker news page
function run(numberOfResults) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://news.ycombinator.com/", {
        waitUntil: "networkidle0",
      });

      //get nodeList of articles
      let results = [];

      //pagination

      do {
        const elements = await page.$$("tr.athing");

        for (let element of elements) {
          const title = await element.$eval("td:nth-child(3) > a", (node) => node.innerText.trim());
          const url = await element.$eval("td:nth-child(3) > a", (node) => node.href);

          const score = await element.evaluate((node) =>
            //some elements do not have score, so we need to check and see if the score span element exists
            node.nextSibling.querySelector("span.score")
              ? node.nextSibling.querySelector("span.score").innerText
              : "no score"
          );

          // console.log(score);
          results.push({
            title,
            url,
            score,
          });
        }

        const nextBtn = await page.$("td.title > a.morelink");

        Promise.all([
          await nextBtn.click(),
          await page.waitForNavigation({ waitUntill: "networkidle0" }),
        ]);
      } while (results.length < numberOfResults);

      await browser.close();
      resolve(results.slice(0, numberOfResults));
    } catch (error) {
      reject(error);
    }
  });
}

run(numberOfResults)
  .then((results) => console.log(results, results.length))
  .catch(console.error);
