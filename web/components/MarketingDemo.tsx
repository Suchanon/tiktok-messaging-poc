"use client";

import { useState } from "react";
import { BarChart, Search } from "lucide-react";

export default function MarketingDemo() {
    const [advertiserID, setAdvertiserID] = useState("");
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [report, setReport] = useState<any[]>([]);
    const [status, setStatus] = useState("");

    const fetchCampaigns = async () => {
        setStatus("Fetching campaigns...");
        try {
            const res = await fetch(`http://localhost:8080/api/marketing/campaigns?advertiser_id=${advertiserID}`);
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setCampaigns(data.data?.list || []);
            setStatus("Campaigns loaded.");
        } catch (err: any) {
            setStatus(`Error: ${err.message}`);
        }
    };

    const fetchReport = async () => {
        setStatus("Fetching report...");
        try {
            // Hardcoded dates for demo
            const startDate = "2023-01-01";
            const endDate = "2023-12-31";
            const res = await fetch(`http://localhost:8080/api/marketing/report?advertiser_id=${advertiserID}&report_type=basic&dimension=campaign_id&start_date=${startDate}&end_date=${endDate}`);
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setReport(data.data?.list || []);
            setStatus("Report loaded.");
        } catch (err: any) {
            setStatus(`Error: ${err.message}`);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-indigo-600" /> Marketing API Demo
                </h2>
                <p className="text-sm text-slate-500 mt-1">View campaign performance and reports.</p>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Advertiser ID</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={advertiserID}
                            onChange={(e) => setAdvertiserID(e.target.value)}
                            className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                            placeholder="Enter Advertiser ID"
                        />
                        <button
                            onClick={fetchCampaigns}
                            disabled={!advertiserID}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" /> Fetch Campaigns
                        </button>
                    </div>
                </div>

                {campaigns.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-700">Active Campaigns</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Objective</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {campaigns.map((c) => (
                                        <tr key={c.campaign_id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{c.campaign_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{c.campaign_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {c.objective}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {status && (
                    <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${status.includes("Error")
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : status.includes("Fetching")
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-green-50 text-green-700 border border-green-100"
                        }`}>
                        {status.includes("Error") ? (
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                        ) : status.includes("Fetching") ? (
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}

