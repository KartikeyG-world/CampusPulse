import React, { useState, useEffect, useMemo } from 'react';
import { useCampusPulse } from '../context/CampusPulseContext';
import { CampusZone } from '../types';
import { sanitizeForPublicSignage } from '../utils/validation';
import {
  Tv2,
  CheckCircle2,
  Zap,
  Droplets,
  Trash2,
  QrCode,
  Maximize2,
  Minimize2,
  Layers,
  ArrowRight,
  Camera,
  FileText,
  HelpCircle,
  Pause,
  Play,
  X
} from 'lucide-react';

export const BenQKioskView: React.FC = () => {
  const { issues, ecoMetrics, setActiveRole } = useCampusPulse();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedZoneDetail, setSelectedZoneDetail] = useState<CampusZone | null>(null);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  // Live digital clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Strict allowlist projection for public signage - strips reporter PII and internal operator notes
  const sanitizedIssues = useMemo(() => {
    return issues.map(sanitizeForPublicSignage).filter((i): i is NonNullable<typeof i> => i !== null);
  }, [issues]);

  const resolvedIssues = sanitizedIssues.filter((i) => i.status === 'RESOLVED');
  const activeIssues = sanitizedIssues.filter((i) => i.status !== 'RESOLVED');

  const campusZones: { name: CampusZone; buildingType: string }[] = [
    { name: 'Core 1 Lecture Complex', buildingType: 'Academic Complex & Lecture Theaters' },
    { name: 'Hostels (Manas / Brahmaputra)', buildingType: 'Student Residential Quarters' },
    { name: 'Central Library & Admin', buildingType: 'Knowledge & Administration Center' },
    { name: 'Food Court & Market Area', buildingType: 'Dining Plaza & Commercial Wing' },
    { name: 'Sports Complex & Grounds', buildingType: 'Athletics & Indoor Arenas' },
    { name: 'Green Belt & Riverfront Path', buildingType: 'Ecological Corridor & Walkways' },
  ];

  const getZoneHealth = (zone: CampusZone) => {
    const zoneIssues = activeIssues.filter((i) => i.zone === zone);
    const hasCritical = zoneIssues.some((i) => i.priorityScore >= 80);
    const hasActive = zoneIssues.length > 0;

    if (hasCritical) {
      return {
        status: 'ALERT',
        label: 'Priority Alert',
        color: 'border-rose-500/40 bg-rose-950/40 text-rose-300',
        dot: 'bg-rose-500',
        count: zoneIssues.length,
      };
    }
    if (hasActive) {
      return {
        status: 'MAINTENANCE',
        label: 'In Maintenance',
        color: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
        dot: 'bg-amber-400',
        count: zoneIssues.length,
      };
    }
    return {
      status: 'NO_REPORTS',
      label: 'No reports',
      color: 'border-slate-700/60 bg-slate-900/60 text-slate-400',
      dot: 'bg-slate-500',
      count: 0,
    };
  };

  return (
    <div className={`min-h-[88vh] bg-[#111827] text-slate-100 flex flex-col justify-between ${isFullscreen ? 'p-6 fixed inset-0 z-50 overflow-y-auto' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'}`}>

      {/* 1. Broadcast Header Bar */}
      <div className="rounded-lg bg-[#1F2937] border border-slate-700/60 p-4 sm:p-5 mb-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#374151] text-emerald-400">
              <Tv2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-wide">
                  CampusPulse Public Signage
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  16:9 Display Layout
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Sync: Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ambient operational status screen formatted for large-format displays across campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono text-base font-bold text-white tracking-widest">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-slate-400">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-md bg-[#374151] hover:bg-[#4B5563] text-slate-200 border border-slate-600 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Mode'}
              aria-label={isFullscreen ? 'Exit Fullscreen Mode' : 'Enter Fullscreen Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Resolution Marquee Ticker with WCAG Pause Control */}
      <div className={`rounded-lg bg-[#1F2937] border border-slate-700/60 p-3 mb-3 overflow-hidden flex items-center gap-3 ${isTickerPaused ? 'ticker-paused' : ''}`}>

        {/* Ticker label & WCAG pause control */}
        <div className="shrink-0 flex items-center gap-1.5">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111827] border border-slate-700 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolutions</span>
          </span>
          <button
            type="button"
            onClick={() => setIsTickerPaused(!isTickerPaused)}
            className="p-1 rounded bg-[#111827] hover:bg-[#374151] border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isTickerPaused ? 'Resume resolution ticker animation' : 'Pause resolution ticker animation'}
            aria-label={isTickerPaused ? 'Resume resolution ticker animation' : 'Pause resolution ticker animation'}
          >
            {isTickerPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="overflow-hidden relative flex-1 whitespace-nowrap">
          {resolvedIssues.length > 0 ? (
            <div className="animate-ticker flex gap-6 items-center text-xs text-slate-200">
              {resolvedIssues.map((res) => (
                <span key={res.id} className="inline-flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-md border border-slate-700/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <strong className="text-emerald-400 font-mono">{res.ticketNumber}:</strong>
                  <span className="text-white font-medium">{res.title}</span>
                  <span className="text-slate-400">({res.location})</span>

                  {/* Evidence State Badge */}
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                    res.evidenceState === 'EVIDENCE_ATTACHED'
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                      : res.evidenceState === 'OPERATOR_DOCUMENTED'
                      ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {res.evidenceState === 'EVIDENCE_ATTACHED' && <Camera className="w-3 h-3 text-purple-300" />}
                    {res.evidenceState === 'OPERATOR_DOCUMENTED' && <FileText className="w-3 h-3 text-emerald-300" />}
                    {res.evidenceState === 'STATUS_RECORDED' && <HelpCircle className="w-3 h-3 text-slate-400" />}
                    {res.evidenceState === 'EVIDENCE_ATTACHED' ? 'Photo attached' : res.evidenceState === 'OPERATOR_DOCUMENTED' ? 'Note recorded' : 'Status recorded'}
                  </span>
                </span>
              ))}
              {/* Seamless duplicate */}
              {resolvedIssues.map((res) => (
                <span key={`dup-${res.id}`} className="inline-flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-md border border-slate-700/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <strong className="text-emerald-400 font-mono">{res.ticketNumber}:</strong>
                  <span className="text-white font-medium">{res.title}</span>
                  <span className="text-slate-400">({res.location})</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                    res.evidenceState === 'EVIDENCE_ATTACHED'
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                      : res.evidenceState === 'OPERATOR_DOCUMENTED'
                      ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {res.evidenceState === 'EVIDENCE_ATTACHED' ? 'Photo attached' : res.evidenceState === 'OPERATOR_DOCUMENTED' ? 'Note recorded' : 'Status recorded'}
                  </span>
                </span>
              ))}
            </div>
          ) : activeIssues.length > 0 ? (
            <div className="animate-ticker flex gap-6 items-center text-xs text-slate-200">
              {activeIssues.map((act) => (
                <span key={act.id} className="inline-flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-md border border-slate-700/80">
                  <strong className="text-amber-400 font-mono">{act.ticketNumber}:</strong>
                  <span className="text-white font-medium">{act.title}</span>
                  <span className="text-slate-400">({act.location})</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/50">
                    In progress
                  </span>
                </span>
              ))}
              {activeIssues.map((act) => (
                <span key={`dup-${act.id}`} className="inline-flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-md border border-slate-700/80">
                  <strong className="text-amber-400 font-mono">{act.ticketNumber}:</strong>
                  <span className="text-white font-medium">{act.title}</span>
                  <span className="text-slate-400">({act.location})</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/50">
                    In progress
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <div className="py-1 px-2 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span>No campus reports are currently recorded in this browser's local data. New reports will appear here automatically.</span>
            </div>
          )}
        </div>
      </div>

      {/* 2.1 Concise Evidence Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2.5 rounded-lg bg-[#1F2937] border border-slate-700/60 text-xs text-slate-300 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-600/50">
            In progress
          </span>
          <span className="text-xs text-slate-400">Active maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-900/60 text-purple-200 border border-purple-500/50 flex items-center gap-1">
            <Camera className="w-2.5 h-2.5" />
            Photo attached
          </span>
          <span className="text-xs text-slate-400">Supporting photo on file</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-900/60 text-emerald-200 border border-emerald-500/50 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            Note recorded
          </span>
          <span className="text-xs text-slate-400">Work note recorded</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <HelpCircle className="w-2.5 h-2.5" />
            Status only
          </span>
          <span className="text-xs text-slate-400">Closed in queue</span>
        </div>
      </div>

      {/* 3. Main Grid: Campus Zone Health & Eco-Impact Model */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-4">

        {/* Campus Zone Heatmap & Status (8 Cols) */}
        <div className="lg:col-span-8 bg-[#1F2937] rounded-lg border border-slate-700/60 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Report Activity by Campus Zone
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              6 Campus Sectors • Local Browser Storage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {campusZones.map((zone) => {
              const health = getZoneHealth(zone.name);
              const isSelected = selectedZoneDetail === zone.name;

              return (
                <button
                  key={zone.name}
                  onClick={() => setSelectedZoneDetail(isSelected ? null : zone.name)}
                  className={`p-3.5 rounded-md border text-left transition-all flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-[#374151]'
                      : 'border-slate-700/80 bg-[#111827] hover:bg-[#374151]/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-white">{zone.name}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${health.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${health.dot}`}></span>
                      {health.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{zone.buildingType}</p>

                  <div className="text-xs text-slate-400 pt-1.5 border-t border-slate-700/80 flex items-center justify-between">
                    <span>Active tickets:</span>
                    <span className="font-semibold text-white">{health.count}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Zone Detail */}
          {selectedZoneDetail && (
            <div className="mt-3 p-3.5 rounded-md bg-[#111827] border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  Active incidents: {selectedZoneDetail}
                </h3>
                <button
                  onClick={() => setSelectedZoneDetail(null)}
                  aria-label="Close zone detail drawer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>
              </div>

              {activeIssues.filter((i) => i.zone === selectedZoneDetail).length === 0 ? (
                <div className="text-xs text-emerald-300 flex items-center gap-1.5 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  All facilities operational in this zone. No pending repairs.
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  {activeIssues
                    .filter((i) => i.zone === selectedZoneDetail)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded bg-[#1F2937] border border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-semibold">{item.ticketNumber}</span>
                          <span className="text-white font-medium">{item.title}</span>
                          <span className="text-slate-400">({item.location})</span>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1 border-t border-slate-700/80">
            <span>Reporter personal identifiers are suppressed on public signage.</span>
            <span className="text-emerald-400 font-medium">Session: Local Client State</span>
          </div>

        </div>

        {/* Eco-Impact Provenance & Mobile Scan Shortcut (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Eco Impact Provenance Card */}
          <div className="bg-[#1F2937] rounded-lg border border-slate-700/60 p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="w-4 h-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Campus Eco-Impact Model
                </h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                Disclosed heuristic
              </span>
            </div>

            <div className="space-y-2.5 text-xs">

              {/* Power */}
              <div className="p-2.5 rounded-md bg-[#111827] border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-amber-500/10 text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Modelled power offset</div>
                    <div className="text-base font-bold text-white">
                      {ecoMetrics.totalModelledKwhSaved} <span className="text-xs font-normal text-slate-400">kWh</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-amber-400 font-medium">
                    Modelled estimate
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {ecoMetrics.totalMeasuredKwhSaved !== null ? `Measured: ${ecoMetrics.totalMeasuredKwhSaved} kWh` : 'NOT MEASURED — No live meter'}
                  </div>
                </div>
              </div>

              {/* Water */}
              <div className="p-2.5 rounded-md bg-[#111827] border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-sky-500/10 text-sky-400">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Modelled water preserved</div>
                    <div className="text-base font-bold text-white">
                      {ecoMetrics.totalModelledLitersPreserved.toLocaleString()} <span className="text-xs font-normal text-slate-400">L</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-sky-400 font-medium">
                    Modelled estimate
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {ecoMetrics.totalMeasuredLitersPreserved !== null ? `Measured: ${ecoMetrics.totalMeasuredLitersPreserved} L` : 'NOT MEASURED — No live meter'}
                  </div>
                </div>
              </div>

              {/* Waste */}
              <div className="p-2.5 rounded-md bg-[#111827] border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Modelled compost diverted</div>
                    <div className="text-base font-bold text-white">
                      {ecoMetrics.totalModelledWasteDivertedKg} <span className="text-xs font-normal text-slate-400">kg</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-medium">
                    Volumetric estimate
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {ecoMetrics.totalMeasuredWasteDivertedKg !== null ? `Measured: ${ecoMetrics.totalMeasuredWasteDivertedKg} kg` : 'NOT MEASURED — No live meter'}
                  </div>
                </div>
              </div>

            </div>

            <p className="text-[11px] text-slate-400 leading-tight pt-2 border-t border-slate-700/80">
              <strong>Provenance note:</strong> Values are illustrative modelled calculations based on reported equipment downtime; they are not measurements from physical utility meters.
            </p>
          </div>

          {/* Interactive Kiosk QR Code Widget */}
          <div className="bg-[#1F2937] rounded-lg border border-slate-700/60 p-4 text-center space-y-3 shadow-lg">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Scan to report an issue
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulates a student scanning a public display QR code to file a report.
              </p>
            </div>

            {/* Visual QR Simulation */}
            <div className="inline-block p-3 bg-white rounded-md shadow">
              <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none" aria-label="Simulated QR code">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="24" height="24" fill="#111827" rx="2" />
                <rect x="14" y="14" width="16" height="16" fill="white" rx="1" />
                <rect x="18" y="18" width="8" height="8" fill="#111827" />
                <rect x="66" y="10" width="24" height="24" fill="#111827" rx="2" />
                <rect x="70" y="14" width="16" height="16" fill="white" rx="1" />
                <rect x="74" y="18" width="8" height="8" fill="#111827" />
                <rect x="10" y="66" width="24" height="24" fill="#111827" rx="2" />
                <rect x="14" y="70" width="16" height="16" fill="white" rx="1" />
                <rect x="18" y="74" width="8" height="8" fill="#111827" />
                <rect x="40" y="12" width="6" height="6" fill="#111827" />
                <rect x="52" y="12" width="6" height="6" fill="#111827" />
                <rect x="44" y="24" width="8" height="8" fill="#246348" />
                <rect x="12" y="44" width="6" height="6" fill="#111827" />
                <rect x="24" y="48" width="6" height="6" fill="#111827" />
                <rect x="40" y="40" width="20" height="20" fill="#111827" rx="2" />
                <rect x="45" y="45" width="10" height="10" fill="#246348" />
                <rect x="68" y="44" width="6" height="6" fill="#111827" />
                <rect x="80" y="52" width="6" height="6" fill="#111827" />
                <rect x="44" y="68" width="6" height="6" fill="#111827" />
                <rect x="56" y="76" width="6" height="6" fill="#111827" />
                <rect x="72" y="72" width="14" height="14" fill="#111827" />
              </svg>
            </div>

            <button
              onClick={() => setActiveRole('student')}
              className="w-full py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Simulate mobile scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Footer System Status Bar */}
      <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>16:9 Ambient Display Mode &bull; Large-Format Campus Signage</span>
        </div>
        <div>
          <span>CampusPulse &bull; From Report to Resolution</span>
        </div>
      </div>

    </div>
  );
};
