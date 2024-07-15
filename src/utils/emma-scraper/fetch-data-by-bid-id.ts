import type { Page } from "puppeteer-core";
import { getBrowser } from "../puppeteer";
import { parseBidDetailsPage } from "./parse-bid-details-page";
import { errorMessages } from "@/constants/error-messages";
import { NotFoundError } from "../errors/not-found-error";

const emmaPublicSolicitationsPageUrl =
  "https://emma.maryland.gov/page.aspx/en/rfp/request_browse_public";

const keywordInputSelector = 'input[name="body:x:txtBpmCodeCalculated_3"]';
const submitButtonSelector =
  'button[name="body:x:prxFilterBar:x:cmdSearchBtn"]';

const resultsTableRowsSelector = "#body_x_grid_grd > tbody > tr";
const bidIdCellSubSelector = "& td:nth-of-type(2)";
const titleLinkSubSelector = "& td:nth-of-type(3) > a";

export const fetchDataByBidId = async (id: string) => {
  // load page using puppeteer
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();

    await loadSearchResults(id, page);

    await loadBidDetailedPage(id, page);

    const result = await parseBidDetailsPage(page);

    return result;
  } catch (e) {
    console.error({ e });
    throw e;
  } finally {
    await browser.disconnect();
  }
};

const loadSearchResults = async (bidId: string, page: Page) => {
  await page.goto(emmaPublicSolicitationsPageUrl);

  // enter bid id
  await page.waitForSelector(keywordInputSelector);
  await page.$eval(
    keywordInputSelector,
    (el, externalData) => (el.value = externalData.bidId),
    { bidId }
  );

  // listen for page load after form submit
  let navigationPromise = page.waitForNavigation();
  // submit search form
  await page.click(submitButtonSelector);
  // wait for results to load
  await navigationPromise;
};

const loadBidDetailedPage = async (bidId: string, page: Page) => {
  // get one resulting row if multiple returned by search results

  const detailsPageUrl = await page.evaluate(
    async (externalData) => {
      const tableRows = Array.from(
        document.querySelectorAll(externalData.resultsTableRowsSelector)
      );
      const resultingRow = tableRows.find(
        (row) =>
          row.querySelector<HTMLElement>(externalData.bidIdCellSubSelector)
            ?.innerText === externalData.bidId
      );

      return resultingRow?.querySelector<HTMLLinkElement>(
        externalData.titleLinkSubSelector
      )?.href;
    },
    {
      bidId,
      resultsTableRowsSelector,
      bidIdCellSubSelector,
      titleLinkSubSelector,
    }
  );
  if (!detailsPageUrl) {
    throw new NotFoundError();
  }
  await page.goto(detailsPageUrl);
};
