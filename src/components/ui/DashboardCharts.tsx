"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "./GlassCard";

const data = [
  { time: "00:00", health: 98, security: 99 },
  { time: "04:00", health: 97, security: 98 },
  { time: "08:00", health: 99, security: 99 },
  { time: "12:00", health: 98, security: 97 },
  { time: "16:00", health: 99, security: 99 },
  { time: "20:00", health: 97, security: 98 },
  { time: "24:00", health: 98, security: 99 },
];

export function DashboardCharts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Fleet & Health Stability
        </h3>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Global Telemetry · 24h Window</span>
      </div>

      <GlassCard className="h-[300px] p-6 pt-10" glowOnHover={false}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSecurity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#ffffff20" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#ffffff20" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={[90, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "10px" }}
              itemStyle={{ color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="health"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHealth)"
            />
            <Area
              type="monotone"
              dataKey="security"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSecurity)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}
