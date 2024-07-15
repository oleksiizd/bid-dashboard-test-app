import clsx from "clsx";
import { useEffect, useState } from "react";

export interface SubmitButtonProps {
  isLoading: boolean;
}

const buttonTextVariants = {
  default: "Start Searching",
  loadingStage1: "Connecting to the bidding database...",
  loadingStage2: "Looking for your bid...",
  loadingStage3: "Parsing available data...",
  loadingLong: "Almost there...",
};

export default function SubmitButton({ isLoading }: SubmitButtonProps) {
  const [buttonText, setButtonText] = useState(
    isLoading ? buttonTextVariants.loadingStage1 : buttonTextVariants.default
  );

  useEffect(() => {
    if (!isLoading) {
      setButtonText(buttonTextVariants.default);
      return;
    }

    setButtonText(buttonTextVariants.loadingStage1);
    const timeoutStage2Id = setTimeout(
      setButtonText,
      3000,
      buttonTextVariants.loadingStage2
    );
    const timeoutStage3Id = setTimeout(
      setButtonText,
      6000,
      buttonTextVariants.loadingStage3
    );
    const timeoutLongId = setTimeout(
      setButtonText,
      9000,
      buttonTextVariants.loadingLong
    );

    return () => {
      clearTimeout(timeoutStage2Id);
      clearTimeout(timeoutStage3Id);
      clearTimeout(timeoutLongId);
    };
  }, [isLoading]);

  return (
    <button type="submit" className={clsx('btn btn-primary', isLoading && 'btn-outline pointer-events-none')}>
      {isLoading && <span className="loading loading-spinner"></span>}
      {buttonText}
    </button>
  );
}
