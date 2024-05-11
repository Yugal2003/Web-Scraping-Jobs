const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fetchedProduct = [];

const getData = async () => {
  try {
    const response = await axios.get(
      "https://www.quikr.com/jobs/job+zwqxj1519612219",
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );

    const $ = cheerio.load(response.data);
    const jobCards = $("[class]").find(
      "div.job-card.apply-block.adImpression-click-event.adImpression-event-class1"
    );

    jobCards.each((index, data) => {
      const product = {
        title: $(data).find("a.job-title").text(),
        comName: $(data)
          .find("div.attributeVal.cursor-default.light-gray")
          .text(),
        location: $(data).find("span.city").text(),
        type: $(data).find("div.attributeVal").text(),
        postedDate: $(data).find("div.jsPostedOn").text(),
        description: $(data).find("div.categories").text(),
      };

      fetchedProduct.push(product);
    });
    console.log(fetchedProduct);
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(fetchedProduct);
    xlsx.utils.book_append_sheet(workbook, worksheet, "sheet1");
    xlsx.writeFile(workbook, "jobs.xlsx");
  } catch (error) {
    console.log(error);
  }
};

getData();