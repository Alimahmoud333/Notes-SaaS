export default function ReportCard({ report }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5>Report #{report.id}</h5>

        <p>
          <strong>Note:</strong> {report.note?.title}
        </p>

        <p>
          <strong>Reason:</strong> {report.reason}
        </p>

        <span
          className={`badge ${
            report.status === "pending"
              ? "bg-warning"
              : report.status === "resolved"
                ? "bg-success"
                : "bg-danger"
          }`}>
          {report.status}
        </span>
      </div>
    </div>
  );
}
