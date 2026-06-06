import { useEffect, useState } from "react";
import API from "../../api/axios";

import ReportCard from "../../components/reports/ReportCard";

import { useToast } from "../../context/ToastContext";

export default function ReportsPage() {
  const { showToast } = useToast();

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  async function loadReports(page = 1) {
    try {
      setLoading(true);

      const res = await API.get(`/my-reports?page=${page}`);

      setReports(res.data.data);

      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (error) {
      showToast("Failed to load reports", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Reports</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="alert alert-info">No Reports Found</div>
      )}

      {!loading &&
        reports.map((report) => <ReportCard key={report.id} report={report} />)}

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from(
            {
              length: pagination.last_page,
            },
            (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  pagination.current_page === index + 1 ? "active" : ""
                }`}>
                <button
                  className="page-link"
                  onClick={() => loadReports(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}
