import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function AdminReportsPage() {
  const { showToast } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReports() {
    try {
      const res = await API.get("/admin/reports");
      setReports(res.data.data);
    } catch (error) {
      showToast("Failed to load reports", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function getStatusBadge(status) {
    switch (status) {
      case "pending":
        return <span className="badge bg-warning">Pending</span>;
      case "resolved":
        return <span className="badge bg-success">Resolved</span>;
      case "dismissed":
        return <span className="badge bg-secondary">Dismissed</span>;
      default:
        return <span className="badge bg-dark">{status}</span>;
    }
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-primary mb-4">📑 Reports</h2>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="alert alert-info text-center">No reports found</div>
      )}

      <div className="row">
        {!loading &&
          reports.map((report) => (
            <div key={report.id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-light fw-bold">
                  Report #{report.id}
                </div>
                <div className="card-body">
                  {/* Reporter */}
                  <p>
                    <strong>Reporter:</strong>{" "}
                    {report.user ? report.user.name : "Unknown"}
                  </p>

                  {/* Note Info */}
                  <p>
                    <strong>Note:</strong>{" "}
                    {report.note ? report.note.title : "Unknown"}
                  </p>

                  {/* Note Owner */}
                  <p>
                    <strong>Note Owner:</strong>{" "}
                    {report.note && report.note.user
                      ? report.note.user.name
                      : "Unknown"}
                  </p>

                  {/* Reason */}
                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>

                  {/* Status */}
                  {getStatusBadge(report.status)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
