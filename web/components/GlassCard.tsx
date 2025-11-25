"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-2xl overflow-hidden ${className}`}
        >
            {children}
        </motion.div>
    );
}
