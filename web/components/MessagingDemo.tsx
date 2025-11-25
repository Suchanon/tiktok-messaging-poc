"use client";

import { useState } from "react";
import { Send, Image, ShoppingBag } from "lucide-react";
import GlassCard from "./GlassCard";
import AnimatedIcon from "./AnimatedIcon";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagingDemo() {
    const [businessID, setBusinessID] = useState("");
    const [openID, setOpenID] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState("");

    const sendMessage = async (type: string) => {
        setStatus("Sending...");
        try {
            const res = await fetch("http://localhost:8080/api/messages/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    business_id: businessID,
                    open_id: openID,
                    text: message,
                    type: type,
                    url: imageUrl,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            setStatus("Sent successfully!");
        } catch (err: any) {
            setStatus(`Error: ${err.message}`);
        }
    };

    return (
        <GlassCard delay={0.2}>
            <div className="p-6 border-b border-white/20 bg-white/10">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <AnimatedIcon icon={Send} className="w-6 h-6 text-blue-600" />
                    Messaging Demo
                </h2>
                <p className="text-sm text-slate-600 mt-1">Send test messages to your TikTok bot.</p>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Business ID</label>
                        <input
                            type="text"
                            value={businessID}
                            onChange={(e) => setBusinessID(e.target.value)}
                            className="block w-full rounded-xl border-white/30 bg-white/50 shadow-inner focus:border-blue-500 focus:ring-blue-500/50 sm:text-sm p-3 backdrop-blur-sm transition-all"
                            placeholder="e.g. 1234567890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Recipient OpenID</label>
                        <input
                            type="text"
                            value={openID}
                            onChange={(e) => setOpenID(e.target.value)}
                            className="block w-full rounded-xl border-white/30 bg-white/50 shadow-inner focus:border-blue-500 focus:ring-blue-500/50 sm:text-sm p-3 backdrop-blur-sm transition-all"
                            placeholder="e.g. ouid_..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/40 p-5 rounded-2xl border border-white/30 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Send Text Message</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 rounded-xl border-white/30 bg-white/60 shadow-inner focus:border-blue-500 focus:ring-blue-500/50 sm:text-sm p-3 transition-all"
                                placeholder="Type your message here..."
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => sendMessage("text")}
                                disabled={!message || !businessID || !openID}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                            >
                                Send
                            </motion.button>
                        </div>
                    </div>

                    <div className="bg-white/40 p-5 rounded-2xl border border-white/30 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Send Image Message</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="flex-1 rounded-xl border-white/30 bg-white/60 shadow-inner focus:border-blue-500 focus:ring-blue-500/50 sm:text-sm p-3 transition-all"
                                placeholder="https://example.com/image.jpg"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => sendMessage("image")}
                                disabled={!imageUrl || !businessID || !openID}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all flex items-center gap-2"
                            >
                                <AnimatedIcon icon={Image} className="w-5 h-5" /> Send Image
                            </motion.button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-md backdrop-blur-md ${status.includes("Error")
                                ? "bg-red-500/10 text-red-800 border border-red-200/50"
                                : status === "Sending..."
                                    ? "bg-blue-500/10 text-blue-800 border border-blue-200/50"
                                    : "bg-green-500/10 text-green-800 border border-green-200/50"
                                }`}
                        >
                            {status.includes("Error") ? (
                                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            ) : status === "Sending..." ? (
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
