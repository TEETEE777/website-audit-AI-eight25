import { useEffect, useState } from "react";
import { getAudits, deleteAudit } from "../api/auditApi";
import { Link } from "react-router-dom";

export default function AuditHistory() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadAudits = async () => {
    try {
      setLoading(true);
      const response = await getAudits();
      setAudits(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load audit history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteAudit(deleteId);

      setDeleteId(null);

      loadAudits();
    } catch (error) {
      console.error(error);
      alert("Failed to delete audit.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white border border-blue-100 shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Audit History</h1>

            <p className="text-slate-500 mt-2">
              View and manage your previous website audits
            </p>
          </div>

          <Link
            to="/"
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            font-medium
            transition
            shadow-sm
          "
          >
            Back to Audit
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500">
            Loading audits...
          </div>
        ) : audits.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No audits found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="text-left px-5 py-4">Website</th>
                  <th className="text-center px-5 py-4">Grade</th>
                  <th className="text-center px-5 py-4">Overall</th>
                  <th className="text-center px-5 py-4">Created</th>
                  <th className="text-center px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {audits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="border-b border-slate-200 hover:bg-blue-50 transition"
                  >
                    <td className="px-5 py-4 text-blue-700 font-medium break-all">
                      {audit.url}
                    </td>

                    <td className="text-center px-5 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {audit.score.grade}
                      </span>
                    </td>

                    <td className="text-center px-5 py-4 font-semibold">
                      {audit.score.overall_score}
                    </td>

                    <td className="text-center px-5 py-4 text-slate-500">
                      {new Date(audit.created_at).toLocaleString()}
                    </td>

                    <td className="text-center px-5 py-4">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/audit/${audit.id}`}
                          className="
                          bg-blue-50
                          text-blue-600
                          hover:bg-blue-100
                          px-4
                          py-2
                          rounded-lg
                          transition
                          "
                        >
                          View
                        </Link>

                        <button
                          onClick={() => setDeleteId(audit.id)}
                          className="
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          px-4
                          py-2
                          rounded-lg
                          transition
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {deleteId && (
        <div
          className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
"
        >
          <div
            className="
  bg-white
  rounded-2xl
  shadow-xl
  p-8
  w-[400px]
  "
          >
            <h2 className="text-xl font-bold text-slate-900">Delete Audit?</h2>

            <p className="text-slate-500 mt-3">
              Are you sure you want to delete this audit report? This action
              cannot be undone.
            </p>

            <div
              className="
    flex
    justify-end
    gap-3
    mt-6
    "
            >
              <button
                onClick={() => setDeleteId(null)}
                className="
        px-5
        py-2
        rounded-lg
        border
        hover:bg-slate-50
        "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="
        px-5
        py-2
        rounded-lg
        bg-red-600
        hover:bg-red-700
        text-white
        "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
