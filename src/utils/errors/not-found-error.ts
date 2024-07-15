import { errorMessages } from "@/constants/error-messages";

export class NotFoundError extends Error {
  constructor() {
    super(errorMessages.notFound);
  }
}
