"use client";

import { useState } from "react";
import { Send, Image, ShoppingBag } from "lucide-react";

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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-600" /> Messaging Demo
                </h2>
                <p className="text-sm text-slate-500 mt-1">Send test messages to your TikTok bot.</p>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Business ID</label>
                        <input
                            type="text"
                            value={businessID}
                            onChange={(e) => setBusinessID(e.target.value)}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border transition-colors"
                            placeholder="e.g. 1234567890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Recipient OpenID</label>
                        <input
                            type="text"
                            value={openID}
                            onChange={(e) => setOpenID(e.target.value)}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border transition-colors"
                            placeholder="e.g. ouid_..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Send Text Message</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                placeholder="Type your message here..."
                            />
                            <button
                                onClick={() => sendMessage("text")}
                                disabled={!message || !businessID || !openID}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Send Image Message</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                placeholder="https://example.com/image.jpg"
                            />
                            <button
                                onClick={() => sendMessage("image")}
                                disabled={!imageUrl || !businessID || !openID}
                                className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Image className="w-4 h-4" /> Send Image
                            </button>
                        </div>
                    </div>
                </div>

                {status && (
                    <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${status.includes("Error")
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : status === "Sending..."
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : "bg-green-50 text-green-700 border border-green-100"
                        }`}>
                        {status.includes("Error") ? (
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                        ) : status === "Sending..." ? (
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
