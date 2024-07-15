"use server";

import { errorMessages } from "@/constants/error-messages";
import createErrorResponse from "@/utils/create-error-response";
import { fetchDataByBidId } from "@/utils/emma-scraper/fetch-data-by-bid-id";
import { NotFoundError } from "@/utils/errors/not-found-error";

export default async function getBidById(id?: string) {
  if (!id) {
    return createErrorResponse(errorMessages.required);
  }

  try {
    return await fetchDataByBidId(id);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return createErrorResponse(errorMessages.notFound);
    }
    return createErrorResponse(
      errorMessages.failedToFetchDataFromExternalService
    );
  }
}
