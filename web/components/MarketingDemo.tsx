"use client";

import { useState } from "react";
import { BarChart, Search } from "lucide-react";
import GlassCard from "./GlassCard";
import AnimatedIcon from "./AnimatedIcon";
import { motion, AnimatePresence } from "framer-motion";

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
        <GlassCard delay={0.4}>
            <div className="p-6 border-b border-white/20 bg-white/10">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <AnimatedIcon icon={BarChart} className="w-6 h-6 text-indigo-600" />
                    Marketing API Demo
                </h2>
                <p className="text-sm text-slate-600 mt-1">View campaign performance and reports.</p>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Advertiser ID</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={advertiserID}
                            onChange={(e) => setAdvertiserID(e.target.value)}
                            className="flex-1 rounded-xl border-white/30 bg-white/50 shadow-inner focus:border-indigo-500 focus:ring-indigo-500/50 sm:text-sm p-3 backdrop-blur-sm transition-all"
                            placeholder="Enter Advertiser ID"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchCampaigns}
                            disabled={!advertiserID}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all flex items-center gap-2"
                        >
                            <AnimatedIcon icon={Search} className="w-5 h-5" /> Fetch Campaigns
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {campaigns.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border border-white/30 rounded-2xl overflow-hidden shadow-sm"
                        >
                            <div className="bg-white/40 px-5 py-4 border-b border-white/20 backdrop-blur-sm">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Active Campaigns</h3>
                            </div>
                            <div className="overflow-x-auto bg-white/30 backdrop-blur-sm">
                                <table className="min-w-full divide-y divide-white/20">
                                    <thead className="bg-white/40">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Objective</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/20">
                                        {campaigns.map((c) => (
                                            <tr key={c.campaign_id} className="hover:bg-white/40 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{c.campaign_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{c.campaign_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100/80 text-indigo-800 border border-indigo-200/50">
                                                        {c.objective}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-md backdrop-blur-md ${status.includes("Error")
                                    ? "bg-red-500/10 text-red-800 border border-red-200/50"
                                    : status.includes("Fetching")
                                        ? "bg-blue-500/10 text-blue-800 border border-blue-200/50"
                                        : "bg-green-500/10 text-green-800 border border-green-200/50"
                                }`}
                        >
                            {status.includes("Error") ? (
                                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            ) : status.includes("Fetching") ? (
                                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            ) : (
                                <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            )}
                            {status}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
