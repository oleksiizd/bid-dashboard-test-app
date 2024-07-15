import { ElementHandle, Page } from "puppeteer-core";

export interface BidData {
  title: string;
  id: string;
  /**
   * Due / Close Date (EST)
   */
  dueCloseDate: string;
  solicitationSummary: string;
  mainCategory: string;
  solicitationType: string;
  attachments: BidDataAttachment[];
}

export interface BidDataAttachment {
  title: string;
  type: string;
  fileName: string;
  link: string;
}

const titleSelector = "#body_x_tabc_rfp_ext_prxrfp_ext_x_lblLabel";
const idSelector = "#body_x_tabc_rfp_ext_prxrfp_ext_x_lblProcessCode";
const dueCloseDateSelector =
  "#body_x_tabc_rfp_ext_prxrfp_ext_x_txtRfpEndDateEst";
const solicitationSummarySelector =
  "#body_x_tabc_rfp_ext_prxrfp_ext_x_lblSummary";
const mainCategorySelector = "#body_x_tabc_rfp_ext_prxrfp_ext_x_txtFamLabel";
const solicitationTypeSelector =
  '[data-selector="body_x_tabc_rfp_ext_prxrfp_ext_x_selRfptypeCode"]';
const attachmentTableRowsSelector =
  "#body_x_tabc_rfp_ext_prxrfp_ext_x_prxDoc_x_grid_grd > tbody > tr";
const attachmentTitleSubSelector = "& td:nth-of-type(1)";
const attachmentTypeSubSelector = "& td:nth-of-type(2)";
const attachmentFileSubSelector = "& td:nth-of-type(3) a";

const fieldParsers = {
  fromInnerText: (element: ElementHandle<Element> | null, page: Page) => {
    return page.evaluate((el) => {
      return (el as HTMLElement | null)?.innerText?.trim() ?? "";
    }, element);
  },
  fromTextInput: (element: ElementHandle<Element> | null, page: Page) => {
    return page.evaluate((el) => {
      const inputElement = el as HTMLInputElement | null;
      return inputElement?.value?.trim() ?? "";
    }, element);
  },
  fromDateInput: (element: ElementHandle<Element> | null, page: Page) => {
    return page.evaluate((el) => {
      const inputElement = el as HTMLInputElement | null;
      const dateString = inputElement?.value?.replaceAll(/\s+/, " ");
      return dateString?.trim() ?? "";
    }, element);
  },
};

const parseField = async <T>(
  page: Page,
  selector: string,
  parser: (element: ElementHandle<Element> | null, page: Page) => Promise<T>
) => {
  await page.waitForSelector(selector);
  let element = await page.$(selector);
  return parser(element, page);
};

export const parseBidDetailsPage = async (page: Page) => {
  const bidData: BidData = {
    title: await parseField(page, titleSelector, fieldParsers.fromInnerText),
    id: await parseField(page, idSelector, fieldParsers.fromInnerText),
    dueCloseDate: await parseField(
      page,
      dueCloseDateSelector,
      fieldParsers.fromDateInput
    ),
    solicitationSummary: await parseField(
      page,
      solicitationSummarySelector,
      fieldParsers.fromInnerText
    ),
    mainCategory: await parseField(
      page,
      mainCategorySelector,
      fieldParsers.fromTextInput
    ),
    solicitationType: await parseField(
      page,
      solicitationTypeSelector,
      fieldParsers.fromInnerText
    ),
    attachments: await parseBidAttachments(page),
  };
  return bidData;
};

const parseBidAttachments = async (page: Page) =>
  page.evaluate(
    async (externalData) => {
      const tableRows = Array.from(
        document.querySelectorAll(externalData.attachmentTableRowsSelector)
      );
      return tableRows.reduce((acc, row) => {
        const attachmentTitle = row.querySelector<HTMLElement>(
          externalData.attachmentTitleSubSelector
        )?.innerText;
        const attachmentType = row.querySelector<HTMLElement>(
          externalData.attachmentTypeSubSelector
        )?.innerText;
        const attachmentFileElement = row.querySelector<HTMLLinkElement>(
          externalData.attachmentFileSubSelector
        );
        const attachmentFileName = attachmentFileElement?.innerText;
        const attachmentLink = attachmentFileElement?.href;

        if (
          attachmentTitle &&
          attachmentType &&
          attachmentFileName &&
          attachmentLink
        ) {
          // add attachment if all data is there
          acc.push({
            title: attachmentTitle,
            type: attachmentType,
            fileName: attachmentFileName,
            link: attachmentLink,
          });
        }
        return acc;
      }, [] as BidDataAttachment[]);
    },
    {
      attachmentTableRowsSelector,
      attachmentTitleSubSelector,
      attachmentTypeSubSelector,
      attachmentFileSubSelector,
    }
  );
