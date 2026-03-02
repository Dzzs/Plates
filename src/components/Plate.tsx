'use client';

import { motion } from 'framer-motion';
import { PlateStyle } from '@/types';

interface PlateProps {
    denom: string | number;
    unit: string;
    style: PlateStyle;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showLabel?: boolean;
}

const SIZE_MAP = {
    sm: 60,
    md: 100,
    lg: 160,
    xl: 220,
};

export function Plate({ denom, unit, style, size = 'md', showLabel = true }: PlateProps) {
    const baseSize = SIZE_MAP[size];
    const diameter = baseSize * (style.diameterScale || 1);
    const strokeWidth = 2;
    const hubRadius = diameter * 0.15;
    const rimWidth = diameter * 0.1;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative flex items-center justify-center"
            style={{ width: diameter, height: diameter }}
        >
            <svg
                viewBox={`0 0 ${diameter} ${diameter}`}
                className="w-full h-full drop-shadow-2xl"
            >
                <defs>
                    {/* Main texture gradient */}
                    <linearGradient id={`grad-${denom}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={style.fill} />
                        <stop offset="50%" stopColor={style.fill} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={style.fill} />
                    </linearGradient>

                    {/* Rim highlight */}
                    <linearGradient id="rim-light" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity={0.2} />
                        <stop offset="45%" stopColor="white" stopOpacity={0} />
                        <stop offset="55%" stopColor="black" stopOpacity={0} />
                        <stop offset="100%" stopColor="black" stopOpacity={0.3} />
                    </linearGradient>

                    {/* Hub texture */}
                    <radialGradient id="hub-grad">
                        <stop offset="0%" stopColor="#333" />
                        <stop offset="70%" stopColor="#111" />
                        <stop offset="100%" stopColor="#000" />
                    </radialGradient>
                </defs>

                {/* Main plate body */}
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={diameter / 2 - strokeWidth}
                    fill={`url(#grad-${denom})`}
                    stroke={style.stroke}
                    strokeWidth={strokeWidth}
                />

                {/* Rim highlight/shadow for depth */}
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={diameter / 2 - strokeWidth}
                    fill="url(#rim-light)"
                    style={{ mixBlendMode: 'overlay' }}
                />

                {/* Inner hub */}
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={hubRadius}
                    fill="url(#hub-grad)"
                    stroke="#444"
                    strokeWidth="1"
                />

                {/* Center hole */}
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={hubRadius * 0.4}
                    fill="#0a0a0b"
                />

                {/* Brand/Texture ring (subtle) */}
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={diameter / 2 - rimWidth}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                />
            </svg>

            {showLabel && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
                    style={{ color: style.text }}
                >
                    <span className="text-xl font-black tracking-tighter drop-shadow-md">
                        {denom}
                    </span>
                    <span className="text-[10px] font-bold uppercase opacity-80 leading-none">
                        {unit}
                    </span>
                </div>
            )}

            {/* Gloss finish overlay */}
            {style.finish === 'gloss' && (
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
            )}

            {/* Calibrated stripe */}
            {style.finish === 'calibrated' && (
                <div className="absolute inset-0 border-2 border-white/20 rounded-full pointer-events-none" />
            )}
        </motion.div>
    );
}
