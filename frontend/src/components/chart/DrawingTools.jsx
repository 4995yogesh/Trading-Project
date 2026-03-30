import React, { useState } from 'react';
import {
  Crosshair, TrendingUp, Minus, ArrowDown, GitBranch, Triangle,
  Square, Type, Ruler, ZoomIn, Magnet, Pencil, Circle, Hash,
  ArrowUpRight, Waves, PenTool, MousePointer, Move, Eraser, Trash2
} from 'lucide-react';

const tools = [
  { id: 'cursor', icon: MousePointer, label: 'Cursor', group: 'pointer' },
  { id: 'crosshair', icon: Crosshair, label: 'Crosshair', group: 'pointer' },
  { id: 'separator-1', type: 'separator' },
  { id: 'trendline', icon: TrendingUp, label: 'Trend Line', group: 'line' },
  { id: 'ray', icon: ArrowUpRight, label: 'Ray', group: 'line' },
  { id: 'horizontal', icon: Minus, label: 'Horizontal Line', group: 'line' },
  { id: 'vertical', icon: ArrowDown, label: 'Vertical Line', group: 'line' },
  { id: 'separator-2', type: 'separator' },
  { id: 'channel', icon: GitBranch, label: 'Parallel Channel', group: 'channel' },
  { id: 'fibonacci', icon: Waves, label: 'Fibonacci Retracement', group: 'fib' },
  { id: 'separator-3', type: 'separator' },
  { id: 'rectangle', icon: Square, label: 'Rectangle', group: 'shape' },
  { id: 'triangle', icon: Triangle, label: 'Triangle', group: 'shape' },
  { id: 'circle', icon: Circle, label: 'Circle', group: 'shape' },
  { id: 'separator-4', type: 'separator' },
  { id: 'path', icon: PenTool, label: 'Path', group: 'draw' },
  { id: 'brush', icon: Pencil, label: 'Brush', group: 'draw' },
  { id: 'text', icon: Type, label: 'Text', group: 'annotation' },
  { id: 'price-label', icon: Hash, label: 'Price Label', group: 'annotation' },
  { id: 'separator-5', type: 'separator' },
  { id: 'measure', icon: Ruler, label: 'Measure', group: 'measure' },
  { id: 'zoom', icon: ZoomIn, label: 'Zoom In', group: 'zoom' },
  { id: 'separator-6', type: 'separator' },
  { id: 'magnet', icon: Magnet, label: 'Magnet Mode', group: 'toggle' },
  { id: 'move', icon: Move, label: 'Stay in Drawing Mode', group: 'toggle' },
  { id: 'separator-7', type: 'separator' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', group: 'delete' },
  { id: 'delete-all', icon: Trash2, label: 'Remove All Drawings', group: 'delete' },
];

const DrawingTools = ({ activeTool, onToolSelect }) => {
  const [hoveredTool, setHoveredTool] = useState(null);

  return (
    <div className="w-[46px] bg-[#131722] border-r border-[#2A2E39] flex flex-col items-center py-2 gap-0.5 overflow-y-auto scrollbar-hide">
      {tools.map((tool) => {
        if (tool.type === 'separator') {
          return <div key={tool.id} className="w-6 h-px bg-[#2A2E39] my-1" />;
        }

        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        const isHovered = hoveredTool === tool.id;

        return (
          <div key={tool.id} className="relative">
            <button
              onClick={() => onToolSelect(tool.id)}
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
              className={`w-[34px] h-[34px] flex items-center justify-center rounded transition-colors ${
                isActive
                  ? 'bg-[#2962FF20] text-[#2962FF]'
                  : 'text-[#787B86] hover:text-[#D1D4DC] hover:bg-[#1E222D]'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
            </button>
            {/* Tooltip */}
            {isHovered && (
              <div className="absolute left-[46px] top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 bg-[#363A45] text-white text-[11px] rounded shadow-lg whitespace-nowrap pointer-events-none">
                {tool.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#363A45]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DrawingTools;
