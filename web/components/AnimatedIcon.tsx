"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
    icon: LucideIcon;
    className?: string;
}

export default function AnimatedIcon({ icon: Icon, className = "" }: AnimatedIconProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="inline-block"
        >
            <Icon className={className} />
        </motion.div>
    );
}
