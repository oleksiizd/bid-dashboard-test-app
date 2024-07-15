import { BidData } from "@/utils/emma-scraper/parse-bid-details-page";

export default function BidDataCard({
  title,
  id,
  dueCloseDate,
  solicitationSummary,
  mainCategory,
  solicitationType,
  attachments,
}: BidData) {
  return (
    <article className="bg-base-100 w-full shadow-xl p-8 rounded-xl grow">
      <h2 className="text-xl mb-4">
        Bid <strong className="text-success">{id}</strong> was successfully
        found!
      </h2>
      <div className="grid lg:grid-cols-2">
      <p className="mb-4"><span className="text-gray-500">Title:</span> {title}</p>
      <p className="mb-4">
      <span className="text-gray-500">Due / Close Date (EST):</span> {dueCloseDate}
      </p>
      <p className="mb-4"><span className="text-gray-500">Main Category:</span> {mainCategory}</p>
      <p className="mb-4"><span className="text-gray-500">Solicitation Type:</span> {solicitationType}</p>
      <p className="mb-4"><span className="text-gray-500">Solicitation Summary:</span> {solicitationSummary}</p>

      </div>
      <h3 className="text-xl mb-4 mt-8">
        Bid attachments{" "}
        <div className="badge badge-primary -translate-y-0.5">{attachments.length}</div>
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {attachments.map((attachment) => (
        <div key={attachment.link} className="card bg-primary text-primary-content p-4">
          <p className="text-lg">{attachment.title}</p>
          <p className="text-sm">Type: {attachment.type}</p>
          <a target="_blank" rel="noopener noreferrer" href={attachment.link} className="btn btn-link text-primary-content self-end">See attachment</a>
        </div>
      ))}</div>
    </article>
  );
}
