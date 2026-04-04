import React from 'react';
import { X } from 'lucide-react';

const SettingsPanel = ({ settings, onSettingsChange, onClose }) => {
  const update = (key, value) => onSettingsChange({ ...settings, [key]: value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-[420px] bg-[#1E222D] rounded-lg shadow-2xl border border-[#363A45] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2E39]">
          <span className="text-[14px] font-semibold text-white">Chart Settings</span>
          <button onClick={onClose} className="p-1 text-[#787B86] hover:text-white hover:bg-[#2A2E3960] rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-5 max-h-[500px] overflow-y-auto">
          {/* Background */}
          <div>
            <label className="text-[11px] text-[#787B86] uppercase tracking-wider font-medium">Background</label>
            <div className="flex gap-2 mt-2">
              {['#131722', '#1E222D', '#0C0E15', '#1A1A2E', '#0D1117'].map(c => (
                <button key={c} onClick={() => update('background', c)}
                  className={`w-8 h-8 rounded-md border-2 transition-colors ${
                    settings.background === c ? 'border-[#2962FF]' : 'border-[#2A2E39] hover:border-[#4A4E59]'
                  }`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Candle colors */}
          <div>
            <label className="text-[11px] text-[#787B86] uppercase tracking-wider font-medium">Candle Colors</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span className="text-[10px] text-[#787B86]">Up</span>
                <div className="flex gap-1.5 mt-1">
                  {['#26A69A', '#4CAF50', '#00E676', '#00BCD4', '#2196F3'].map(c => (
                    <button key={c} onClick={() => update('upColor', c)}
                      className={`w-6 h-6 rounded border-2 transition-colors ${
                        settings.upColor === c ? 'border-white' : 'border-transparent hover:border-[#4A4E59]'
                      }`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#787B86]">Down</span>
                <div className="flex gap-1.5 mt-1">
                  {['#EF5350', '#F44336', '#FF5252', '#FF7043', '#E91E63'].map(c => (
                    <button key={c} onClick={() => update('downColor', c)}
                      className={`w-6 h-6 rounded border-2 transition-colors ${
                        settings.downColor === c ? 'border-white' : 'border-transparent hover:border-[#4A4E59]'
                      }`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[11px] text-[#787B86] uppercase tracking-wider font-medium">Grid Lines</label>
              <p className="text-[10px] text-[#787B86] mt-0.5">Show horizontal and vertical grid</p>
            </div>
            <button onClick={() => update('showGrid', !settings.showGrid)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                settings.showGrid !== false ? 'bg-[#2962FF]' : 'bg-[#363A45]'
              }`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                settings.showGrid !== false ? 'translate-x-[22px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>

          {/* Crosshair mode */}
          <div>
            <label className="text-[11px] text-[#787B86] uppercase tracking-wider font-medium">Crosshair Mode</label>
            <div className="flex gap-2 mt-2">
              {[{ id: 'normal', label: 'Normal' }, { id: 'magnet', label: 'Magnet' }].map(m => (
                <button key={m.id} onClick={() => update('crosshairMode', m.id)}
                  className={`px-3 py-1.5 text-[12px] rounded-md transition-colors ${
                    (settings.crosshairMode || 'normal') === m.id
                      ? 'bg-[#2962FF] text-white' : 'bg-[#2A2E39] text-[#787B86] hover:text-[#D1D4DC]'
                  }`}>{m.label}</button>
              ))}
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="text-[11px] text-[#787B86] uppercase tracking-wider font-medium">Timezone</label>
            <select value={settings.timezone || 'exchange'}
              onChange={e => update('timezone', e.target.value)}
              className="mt-2 w-full bg-[#131722] border border-[#2A2E39] rounded-md px-3 py-2 text-[12px] text-[#D1D4DC] outline-none focus:border-[#2962FF]">
              <option value="exchange">Exchange</option>
              <option value="utc">UTC</option>
              <option value="local">Local</option>
              <option value="est">US Eastern (EST)</option>
              <option value="pst">US Pacific (PST)</option>
              <option value="gmt">London (GMT)</option>
              <option value="jst">Tokyo (JST)</option>
            </select>
          </div>

          {/* Session breaks */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[11px] text-[#787B86] uppercase tracking-wider font-medium">Session Breaks</label>
              <p className="text-[10px] text-[#787B86] mt-0.5">Show vertical lines at session boundaries</p>
            </div>
            <button onClick={() => update('sessionBreaks', !settings.sessionBreaks)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                settings.sessionBreaks ? 'bg-[#2962FF]' : 'bg-[#363A45]'
              }`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                settings.sessionBreaks ? 'translate-x-[22px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>

          {/* Watermark */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[11px] text-[#787B86] uppercase tracking-wider font-medium">Symbol Watermark</label>
              <p className="text-[10px] text-[#787B86] mt-0.5">Show symbol name on chart background</p>
            </div>
            <button onClick={() => update('watermark', !settings.watermark)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                settings.watermark ? 'bg-[#2962FF]' : 'bg-[#363A45]'
              }`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                settings.watermark ? 'translate-x-[22px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#2A2E39]">
          <button onClick={() => onSettingsChange({
            background: '#131722', showGrid: true, crosshairMode: 'normal',
            upColor: '#26A69A', downColor: '#EF5350', timezone: 'exchange',
            sessionBreaks: false, watermark: false,
          })} className="text-[12px] text-[#787B86] hover:text-[#D1D4DC] transition-colors">
            Reset to defaults
          </button>
          <button onClick={onClose} className="px-4 py-1.5 bg-[#2962FF] hover:bg-[#1E53E5] text-white text-[12px] font-medium rounded-md transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
