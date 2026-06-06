import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 d-none d-md-block bg-light min-vh-100 p-0">
            <Sidebar />
          </div>

          <div className="col-md-10 p-4">{children}</div>
        </div>
      </div>
    </>
  );
}
