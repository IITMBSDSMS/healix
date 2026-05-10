"use client";

import { motion } from "framer-motion";
import { Activity, AlertTriangle, Battery, Gauge, Zap } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface PredictionNode {
  deviceId: string;
  prediction: string;
  confidence: number;
  type: "maintenance" | "tamper" | "battery";
  risk: "low" | "medium" | "high";
}

export function PredictiveAnalytics({ devices }: { devices: any[] }) {
  // Simulate AI prediction logic
  const getPredictions = (deviceList: any[]): PredictionNode[] => {
    return deviceList.map(d => {
      const battery = d.telemetry?.battery_level || 100;
      const signal = d.telemetry?.signal_strength || 4;
      
      let node: PredictionNode;
      
      if (battery < 20) {
        node = {
          deviceId: d.id,
          prediction: "IMMINENT POWER FAILURE",
          confidence: 98,
          type: "battery",
          risk: "high"
        };
      } else if (signal < 2) {
        node = {
          deviceId: d.id,
          prediction: "COMMUNICATION DRIFT DETECTED",
          confidence: 72,
          type: "tamper",
          risk: "medium"
        };
      } else {
        node = {
          deviceId: d.id,
          prediction: "STABLE PERFORMANCE",
          confidence: 99,
          type: "maintenance",
          risk: "low"
        };
      }
      return node;
    }).filter(p => p.risk !== "low");
  };

  const predictions = getPredictions(devices);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Zap className="w-4 h-4" /> Predictive Inference
        </h3>
        <div className="text-[10px] font-mono text-white/40">AI MODELS v4.1 · UPDATED JUST NOW</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.length > 0 ? (
          predictions.map((p, idx) => (
            <motion.div
              key={p.deviceId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className={`p-4 border-l-4 ${
                p.risk === "high" ? "border-l-red-500" : "border-l-orange-500"
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono font-bold text-white/50">{p.deviceId}</span>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase ${
                    p.risk === "high" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {p.risk} risk
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{p.prediction}</h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Confidence: {p.confidence}%
                  </span>
                  <span>NEXT 48H WINDOW</span>
                </div>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 py-8 text-center bg-white/5 border border-dashed border-white/10 rounded-xl">
            <p className="text-sm text-white/30 font-mono italic">NO ANOMALIES DETECTED ACROSS FLEET</p>
          </div>
        )}
      </div>
    </div>
  );
}
