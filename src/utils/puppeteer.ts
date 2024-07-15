import puppeteer from "puppeteer-core";

export const getBrowser = async () => {
  return puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  });
};
