import { useState } from "react";
import { auditWebsite } from "../api/auditApi";
import { Link } from "react-router-dom";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setError("");

    try {
      setLoading(true);

      const response = await auditWebsite(url);

      setAudit(response.data);
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Failed to analyze the website. Please try again.",
      );

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center p-10">
      <div
        className="
        w-full
        max-w-6xl
        bg-white
        rounded-2xl
        shadow-lg
        border
        border-blue-100
        p-8
      "
      >
        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Website Audit AI
            </h1>

            <p className="text-slate-500 mt-2">
              Analyze SEO, accessibility and UX using AI
            </p>
          </div>

          <Link
            to="/history"
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-xl
              font-medium
              shadow-sm
              transition
            "
          >
            View History
          </Link>
        </div>

        {/* SEARCH CARD */}

        <div
          className="
          bg-blue-50
          border
          border-blue-100
          rounded-2xl
          p-6
        "
        >
          <div className="flex gap-4">
            <input
              className="
              flex-1
              border
              rounded-xl
              px-4
              py-3
              bg-white
              focus:ring-2
              focus:ring-blue-400
              outline-none
              "
              placeholder="https://example.com"
              value={url}
              disabled={loading}
              onChange={(e) => {
                setUrl(e.target.value);

                if (error) setError("");
              }}
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-8
              rounded-xl
              disabled:opacity-50
              "
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm text-slate-500">SEO Analysis</p>

              <p className="font-semibold">Meta & structure</p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm text-slate-500">AI Insights</p>

              <p className="font-semibold">Smart recommendations</p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm text-slate-500">History</p>

              <p className="font-semibold">Saved reports</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <div
                className="
                h-5
                w-5
                rounded-full
                border-2
                border-blue-600
                border-t-transparent
                animate-spin
                "
              />

              <div>
                <p className="font-medium text-blue-900">
                  Analyzing website...
                </p>

                <p className="text-sm text-blue-700">
                  Scraping content and generating AI insights.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            className="
            mt-6
            p-4
            rounded-xl
            bg-red-50
            border
            border-red-200
            text-red-700
            "
          >
            {error}
          </div>
        )}

        {/* SCORE CARDS */}

        {audit && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800">
              Audit Result
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "SEO",
                  value: audit.score.seo_score,
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                  bar: "bg-blue-500",
                },
                {
                  title: "Accessibility",
                  value: audit.score.accessibility_score,
                  bg: "bg-sky-50",
                  border: "border-sky-200",
                  bar: "bg-sky-500",
                },
                {
                  title: "UX",
                  value: audit.score.ux_score,
                  bg: "bg-indigo-50",
                  border: "border-indigo-200",
                  bar: "bg-indigo-500",
                },
                {
                  title: "Overall",
                  value: audit.score.overall_score,
                  bg: "bg-blue-50",
                  border: "border-blue-300",
                  bar: "bg-blue-600",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`
          rounded-2xl
          p-6
          border
          shadow-sm
          ${item.bg}
          ${item.border}
          `}
                >
                  <p className="text-gray-600">{item.title}</p>

                  <div className="text-4xl font-bold mt-2">{item.value}</div>

                  <div className="w-full bg-slate-200 h-2 rounded-full mt-4">
                    <div
                      className={`${item.bar} h-2 rounded-full`}
                      style={{
                        width: `${item.value}%`,
                      }}
                    />
                  </div>

                  {item.title === "Overall" && (
                    <p className="mt-4 font-semibold">
                      Grade {audit.score.grade}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YOUR EXISTING AI INSIGHTS + RECOMMENDATIONS */}

        {audit?.ai_analysis && (
          <>
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-6 text-blue-900">
                AI Insights
              </h2>

              <div className="space-y-4">
                {Object.entries(audit.ai_analysis.insights).map(
                  ([key, value]: any) => (
                    <div
                      key={key}
                      className="
                        border
                        rounded-xl
                        p-5
                        shadow-sm
                        "
                    >
                      <h3 className="font-semibold capitalize mb-2">
                        {key.replace("_", " ")}
                      </h3>

                      <p className="text-gray-700">{value}</p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-10">
                <h2 className="
                    text-2xl
                    font-bold
                    mb-6
                    text-slate-900
                ">
                    Recommendations
                </h2>
              <div className="space-y-4">
                {audit.ai_analysis.recommendations.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="
                        border
                        rounded-xl
                        p-5
                        shadow-sm
                        "
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold">{item.recommendation}</h3>

                        <span
                            className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            whitespace-nowrap

                            ${
                                item.priority === "High"
                                ? 
                                "bg-red-100 text-red-700 border border-red-200"

                                :
                                item.priority === "Medium"
                                ?
                                "bg-yellow-100 text-yellow-700 border border-yellow-200"

                                :
                                "bg-green-100 text-green-700 border border-green-200"
                            }

                            `}
                        >

                            {item.priority}

                        </span>

                      </div>

                      <p className="mt-3 text-gray-700">{item.reasoning}</p>

                      <p className="mt-3 text-sm text-gray-500">
                        Affected Metric: {item.affected_metric}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
