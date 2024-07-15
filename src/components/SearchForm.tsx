import getBidById from "@/actions/get-bid-by-id";
import { errorMessages } from "@/constants/error-messages";
import { isErrorMessage } from "@/utils/create-error-response";
import { BidData } from "@/utils/emma-scraper/parse-bid-details-page";
import { FormEvent } from "react";
import SubmitButton from "./SubmitButton";

export interface SearchFormProps {
  error: string | null;
  isLoading: boolean;
  onError: (error: string | null) => void;
  onSuccess: (data: BidData) => void;
  onLoading: () => void;
}

export default function SearchForm({
  error,
  isLoading,
  onError,
  onSuccess,
  onLoading,
}: SearchFormProps) {
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }
    resetError();
    onLoading();

    const formData = new FormData(event.currentTarget);
    const bidId = formData.get("bid_id")?.toString();

    try {
      const result = await getBidById(bidId);

      if (isErrorMessage(result)) {
        onError(result.error.message);
        return;
      }

      onSuccess(result);
    } catch (e) {
      console.error(e);
      onError(errorMessages.failedToFetchDataFromExternalService);
    }
  };

  const resetError = () => {
    onError(null);
  };

  return (
    <form onSubmit={onSubmit} className="card-body">
      <label>
        Enter a bid ID to view the details:
        <input
          type="text"
          name="bid_id"
          required
          onFocus={resetError}
          placeholder="BPM025415"
          className="block input input-bordered w-full"
        />
      </label>
      {error && <label className="text-error">{error}</label>}
      <div className="card-actions justify-end">
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
}
