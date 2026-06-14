"use client";

import React, { useState } from "react";

export interface StateData {
  id: string;
  name: string;
  d: string;
}

const statesData: StateData[] = [
  {
    "id": "an",
    "name": "Andaman and Nicobar Islands",
    "d": "an"
  },
  {
    "id": "ap",
    "name": "Andhra Pradesh",
    "d": "ap"
  },
  {
    "id": "ar",
    "name": "Arunachal Pradesh",
    "d": "ar"
  },
  {
    "id": "as",
    "name": "Assam",
    "d": "as"
  },
  {
    "id": "br",
    "name": "Bihar",
    "d": "br"
  },
  {
    "id": "ch",
    "name": "Chandigarh",
    "d": "ch"
  },
  {
    "id": "ct",
    "name": "Chhattisgarh",
    "d": "ct"
  },
  {
    "id": "dn",
    "name": "Dadra and Nagar Haveli",
    "d": "dn"
  },
  {
    "id": "dd",
    "name": "Daman and Diu",
    "d": "dd"
  },
  {
    "id": "dl",
    "name": "Delhi",
    "d": "dl"
  },
  {
    "id": "ga",
    "name": "Goa",
    "d": "ga"
  },
  {
    "id": "gj",
    "name": "Gujarat",
    "d": "gj"
  },
  {
    "id": "hr",
    "name": "Haryana",
    "d": "hr"
  },
  {
    "id": "hp",
    "name": "Himachal Pradesh",
    "d": "hp"
  },
  {
    "id": "jk",
    "name": "Jammu and Kashmir",
    "d": "jk"
  },
  {
    "id": "jh",
    "name": "Jharkhand",
    "d": "jh"
  },
  {
    "id": "ka",
    "name": "Karnataka",
    "d": "ka"
  },
  {
    "id": "kl",
    "name": "Kerala",
    "d": "kl"
  },
  {
    "id": "ld",
    "name": "Lakshadweep",
    "d": "ld"
  },
  {
    "id": "mp",
    "name": "Madhya Pradesh",
    "d": "mp"
  },
  {
    "id": "mh",
    "name": "Maharashtra",
    "d": "mh"
  },
  {
    "id": "mn",
    "name": "Manipur",
    "d": "mn"
  },
  {
    "id": "ml",
    "name": "Meghalaya",
    "d": "ml"
  },
  {
    "id": "mz",
    "name": "Mizoram",
    "d": "mz"
  },
  {
    "id": "nl",
    "name": "Nagaland",
    "d": "nl"
  },
  {
    "id": "or",
    "name": "Odisha",
    "d": "or"
  },
  {
    "id": "py",
    "name": "Puducherry",
    "d": "py"
  },
  {
    "id": "pb",
    "name": "Punjab",
    "d": "pb"
  },
  {
    "id": "rj",
    "name": "Rajasthan",
    "d": "rj"
  },
  {
    "id": "sk",
    "name": "Sikkim",
    "d": "sk"
  },
  {
    "id": "tn",
    "name": "Tamil Nadu",
    "d": "tn"
  },
  {
    "id": "tg",
    "name": "Telangana",
    "d": "tg"
  },
  {
    "id": "tr",
    "name": "Tripura",
    "d": "tr"
  },
  {
    "id": "up",
    "name": "Uttar Pradesh",
    "d": "up"
  },
  {
    "id": "ut",
    "name": "Uttarakhand",
    "d": "ut"
  },
  {
    "id": "wb",
    "name": "West Bengal",
    "d": "wb"
  }
];

interface IndiaMapProps {
  onStateHover?: (stateName: string | null) => void;
  onStateClick?: (stateName: string) => void;
  activeStates?: string[]; // list of active state IDs where we have bio-labs
}

export default function IndiaMap({ onStateHover, onStateClick, activeStates = [] }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleMouseEnter = (state: StateData) => {
    setHoveredState(state.id);
    if (onStateHover) onStateHover(state.name);
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
    if (onStateHover) onStateHover(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 612 696"
        className="w-full h-auto max-h-[600px] select-none animate-fade-in"
        style={{ filter: "drop-shadow(0px 10px 20px rgba(0, 77, 64, 0.08))" }}
      >
        <g id="states">
          {statesData.map((state) => {
            const isActive = activeStates.includes(state.id);
            const isHovered = hoveredState === state.id;
            
            // Premium colors: HSL tailored
            let fill = "#f8fafc"; // default light slate gray
            let stroke = "#cbd5e1"; // slate-300 border
            let strokeWidth = "1.2";
            
            if (isActive) {
              fill = isHovered ? "#00796b" : "#004d40"; // deep teal for active labs
              stroke = "#ffffff";
              strokeWidth = "1.8";
            } else if (isHovered) {
              fill = "#ccebe6"; // light teal glow on hover
              stroke = "#00796b";
              strokeWidth = "1.5";
            }

            return (
              <path
                key={state.id}
                id={state.id}
                d={state.d}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                className="transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                onMouseEnter={() => handleMouseEnter(state)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onStateClick && onStateClick(state.name)}
              >
                <title>{state.name}</title>
              </path>
            );
          })}
        </g>
      </svg>
      
      {/* Floating Info card */}
      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-teal-50/50 shadow-lg px-4 py-3 rounded-lg min-w-[200px] text-left transition-all duration-300">
        <p className="text-[10px] font-mono text-teal-600 tracking-wider uppercase font-bold">Interactive Biosystem</p>
        <h4 className="text-lg font-bold text-slate-800 mt-0.5 font-sans">
          {hoveredState 
            ? statesData.find(s => s.id === hoveredState)?.name 
            : "Select State"}
        </h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {hoveredState && activeStates.includes(hoveredState)
            ? "✓ Active BioLabs Facility"
            : hoveredState
            ? "No facility in this state"
            : "Hover over map to inspect locations"}
        </p>
      </div>
    </div>
  );
}
