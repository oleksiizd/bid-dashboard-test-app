"use client";
import BidDataCard from "@/components/BidDataCard";
import SearchForm from "@/components/SearchForm";
import { BidData } from "@/utils/emma-scraper/parse-bid-details-page";
import { useCallback, useState } from "react";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<BidData | null>(null);

  const handleStartLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const handleErrorChange = useCallback((error: string | null) => {
    setError(error);
    setLoading(false);
  }, []);

  const handleResultChange = useCallback((data: BidData | null) => {
    setResult(data);
    setLoading(false);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 lg:gap-16 p-4">
      <article className="card card-compact bg-base-100 w-full shadow-xl p-4 max-w-xl">
        <h1 className="text-2xl font-bold p-4">Bid Dashboard</h1>
        <SearchForm
          error={error}
          isLoading={isLoading}
          onError={handleErrorChange}
          onLoading={handleStartLoading}
          onSuccess={handleResultChange}
        />
      </article>
      {result && <BidDataCard {...result} />}
    </main>
  );
}
