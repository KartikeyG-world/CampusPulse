import React, { useState } from 'react';
import { useCampusPulse } from '../context/CampusPulseContext';
import {
  Building2,
  Send,
  SlidersHorizontal,
  Tv2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  FileText,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { setActiveRole } = useCampusPulse();
  const [activeTabPreview, setActiveTabPreview] = useState<'flow' | 'ticket' | 'ledger'>('flow');

  return (
    <div className="min-h-screen bg-[#F6F6F1] text-[#202720] flex flex-col font-sans selection:bg-[#EAF2ED] selection:text-[#246348]">

      {/* 1. Public Landing Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE2D9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Wordmark & Descriptor */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348] shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-[#202720]">
                  CampusPulse
                </span>
                <p className="text-xs text-[#626B63] hidden md:block">
                  Campus operations, made clearer
                </p>
              </div>
            </div>

            {/* Anchor Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#626B63]">
              <a href="#how-it-works" className="hover:text-[#202720] transition-colors">
                How it works
              </a>
              <a href="#workspaces" className="hover:text-[#202720] transition-colors">
                Connected workspaces
              </a>
              <a href="#trust-ledger" className="hover:text-[#202720] transition-colors">
                Trust & Impact Ledger
              </a>
            </nav>

            {/* Quick Action CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveRole('student')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#246348] text-white hover:bg-[#1b4c37] transition-all shadow-xs"
                aria-label="Launch prototype workspaces"
              >
                <span>Explore prototype</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">

        {/* 2. Hero Section */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#DCE2D9] bg-gradient-to-b from-white via-white to-[#F6F6F1]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            {/* Product Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#DCE2D9] text-[#246348] text-xs font-medium mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#246348]"></span>
              <span>Campus Facility & Resource Operations Prototype</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#202720] max-w-4xl mx-auto leading-[1.15]">
              Every campus issue deserves a <span className="text-[#246348] underline decoration-[#DCE2D9] underline-offset-8">clear path to resolution.</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-[#626B63] max-w-2xl mx-auto leading-relaxed">
              A transparent, closed-loop reporting and triage system connecting student observations, facility response, and campus-wide public awareness with verifiable evidence.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveRole('student')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#246348] text-white text-sm font-semibold hover:bg-[#1b4c37] transition-all shadow-sm group"
              >
                <span>Submit an issue report</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#workspaces"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white text-[#202720] border border-[#DCE2D9] text-sm font-medium hover:bg-[#FAF9F5] transition-colors shadow-xs"
              >
                <span>Explore the 3 workspaces</span>
                <ChevronRight className="w-4 h-4 text-[#8E988F]" />
              </a>
            </div>

            {/* Proportionate Prototype Disclosure */}
            <p className="mt-8 text-xs text-[#8E988F]">
              Independent evaluation prototype &bull; Self-contained browser-local storage &bull; No live campus sub-meters connected
            </p>

          </div>
        </section>

        {/* 3. The Closed-Loop Resolution Workflow */}
        <section id="how-it-works" className="py-12 md:py-16 bg-[#F6F6F1] border-b border-[#DCE2D9]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202720]">
                The Closed-Loop Resolution Workflow
              </h2>
              <p className="text-xs sm:text-sm text-[#626B63] mt-2">
                A structured 5-stage lifecycle ensuring campus issues are reported, prioritized, resolved, and communicated transparently.
              </p>

              {/* View Switcher Tabs */}
              <div className="inline-flex p-1 mt-4 rounded-lg bg-[#EFEFEA] border border-[#DCE2D9]">
                <button
                  onClick={() => setActiveTabPreview('flow')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    activeTabPreview === 'flow'
                      ? 'bg-white text-[#202720] shadow-xs border border-[#DCE2D9]'
                      : 'text-[#626B63] hover:text-[#202720]'
                  }`}
                >
                  Lifecycle flow
                </button>
                <button
                  onClick={() => setActiveTabPreview('ticket')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    activeTabPreview === 'ticket'
                      ? 'bg-white text-[#202720] shadow-xs border border-[#DCE2D9]'
                      : 'text-[#626B63] hover:text-[#202720]'
                  }`}
                >
                  Sample ticket format
                </button>
                <button
                  onClick={() => setActiveTabPreview('ledger')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    activeTabPreview === 'ledger'
                      ? 'bg-white text-[#202720] shadow-xs border border-[#DCE2D9]'
                      : 'text-[#626B63] hover:text-[#202720]'
                  }`}
                >
                  Trust & Impact Ledger
                </button>
              </div>
            </div>

            {/* Tab 1: 5-Stage Flow Illustration */}
            {activeTabPreview === 'flow' && (
              <div className="bg-white rounded-xl border border-[#DCE2D9] p-6 sm:p-8 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">

                  {/* Step 1: Report */}
                  <div className="flex flex-col p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#626B63] uppercase tracking-wider">Step 1</span>
                      <span className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center">1</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#202720]">Report</h3>
                    <p className="text-xs text-[#626B63] mt-1">Student or staff notices a facility defect or energy waste and submits structured report.</p>
                    <div className="mt-3 pt-3 border-t border-[#DCE2D9]/80 text-[11px] text-[#246348] font-medium flex items-center gap-1">
                      <Send className="w-3 h-3" />
                      <span>Frictionless intake</span>
                    </div>
                  </div>

                  {/* Step 2: Prioritize */}
                  <div className="flex flex-col p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#626B63] uppercase tracking-wider">Step 2</span>
                      <span className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center">2</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#202720]">Prioritize</h3>
                    <p className="text-xs text-[#626B63] mt-1">Deterministic heuristic engine evaluates urgency, category, and report age.</p>
                    <div className="mt-3 pt-3 border-t border-[#DCE2D9]/80 text-[11px] text-[#246348] font-medium flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>Score 1–100 Formula</span>
                    </div>
                  </div>

                  {/* Step 3: Act */}
                  <div className="flex flex-col p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#626B63] uppercase tracking-wider">Step 3</span>
                      <span className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center">3</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#202720]">Act</h3>
                    <p className="text-xs text-[#626B63] mt-1">Operations team dispatches task with transparent priority ranking and maintenance wing routing.</p>
                    <div className="mt-3 pt-3 border-t border-[#DCE2D9]/80 text-[11px] text-[#246348] font-medium flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Dispatch & Triage</span>
                    </div>
                  </div>

                  {/* Step 4: Resolve */}
                  <div className="flex flex-col p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#626B63] uppercase tracking-wider">Step 4</span>
                      <span className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center">4</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#202720]">Resolve</h3>
                    <p className="text-xs text-[#626B63] mt-1">Operator closes ticket with resolution note and optional supporting photo on record.</p>
                    <div className="mt-3 pt-3 border-t border-[#DCE2D9]/80 text-[11px] text-[#246348] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Evidence attached</span>
                    </div>
                  </div>

                  {/* Step 5: Communicate */}
                  <div className="flex flex-col p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#626B63] uppercase tracking-wider">Step 5</span>
                      <span className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center">5</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#202720]">Communicate</h3>
                    <p className="text-xs text-[#626B63] mt-1">Ambient broadcast on public signage screens and campus ledger with zero personal data displayed.</p>
                    <div className="mt-3 pt-3 border-t border-[#DCE2D9]/80 text-[11px] text-[#246348] font-medium flex items-center gap-1">
                      <Tv2 className="w-3 h-3" />
                      <span>Public signage</span>
                    </div>
                  </div>

                </div>

                <div className="mt-6 p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#626B63]">
                    Cross-tab synchronization operates via standard browser <code className="text-[#202720] bg-white px-1.5 py-0.5 rounded border border-[#DCE2D9]">localStorage</code> events.
                  </span>
                  <button
                    onClick={() => setActiveRole('student')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#246348] hover:text-[#1b4c37] transition-colors"
                  >
                    <span>Try creating a report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Sample Ticket Format */}
            {activeTabPreview === 'ticket' && (
              <div className="bg-white rounded-xl border border-[#DCE2D9] p-6 shadow-xs max-w-3xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCE2D9]">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-[#EFEFEA] text-[#202720] border border-[#DCE2D9]">
                      #CP-1019
                    </span>
                    <h3 className="text-base font-bold text-[#202720]">
                      Solar Water Heater Thermostat Reset (Sample Ticket)
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EAF2ED] text-[#246348] border border-[#DCE2D9] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolved
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
                  <div className="p-3 bg-[#FAF9F5] rounded-md border border-[#DCE2D9]">
                    <span className="text-[#626B63] block mb-1">Priority telemetry</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#946800]">53/100 MEDIUM</span>
                      <span className="text-[10px] text-[#626B63]">(Heuristic)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-md border border-[#DCE2D9]">
                    <span className="text-[#626B63] block mb-1">Evidence record</span>
                    <div className="flex items-center gap-1.5 text-[#246348] font-medium">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Photo attached</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-md border border-[#DCE2D9]">
                    <span className="text-[#626B63] block mb-1">Environmental basis</span>
                    <div className="flex items-center gap-1.5 text-[#202720] font-medium">
                      <Zap className="w-3.5 h-3.5 text-[#246348]" />
                      <span>15 kWh saved (Modelled)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF9F5] rounded-md border border-[#DCE2D9] text-xs text-[#202720]">
                  <span className="font-semibold text-[#246348] block mb-1">Resolution Diagnostic Log:</span>
                  <p className="text-[#626B63]">
                    "Thermostat reset performed on primary array controller; natural circulation confirmed operational. Backup resistive heating element disabled."
                  </p>
                  <div className="mt-2 text-[11px] text-[#8E988F] flex items-center justify-between">
                    <span>Sample resolution log entry</span>
                    <span>Supporting photo on file</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Trust & Impact Ledger Standards */}
            {activeTabPreview === 'ledger' && (
              <div className="bg-white rounded-xl border border-[#DCE2D9] p-6 shadow-xs max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-4 text-[#246348]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-base font-bold text-[#202720]">Audit-Grade Provenance Standards</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF9F5] rounded-md border border-[#DCE2D9] flex items-start gap-3">
                    <div className="p-1 rounded bg-[#EAF2ED] text-[#246348] mt-0.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#202720] block">Tier 1: Evidence Attached (Highest Integrity)</span>
                      <p className="text-[#626B63] mt-0.5">
                        Includes both an operator diagnostic explanation (≥10 characters) and a photo attachment on record documenting physical rectification.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-md border border-[#DCE2D9] flex items-start gap-3">
                    <div className="p-1 rounded bg-[#FBF4E6] text-[#946800] mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#202720] block">Tier 2: Operator Documented (Action Recorded)</span>
                      <p className="text-[#626B63] mt-0.5">
                        Contains detailed operator commentary explaining the corrective steps without photographic media.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-md border border-[#DCE2D9] flex items-start gap-3">
                    <div className="p-1 rounded bg-[#EFEFEA] text-[#626B63] mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#202720] block">Tier 3: Status Recorded (Baseline Toggle)</span>
                      <p className="text-[#626B63] mt-0.5">
                        A status toggle without supplementary documentation. Transparently indicated so students know documentation is pending.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* 4. The Three Connected Workspaces Section */}
        <section id="workspaces" className="py-16 md:py-20 bg-white border-b border-[#DCE2D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202720]">
                Three Dedicated Workspaces
              </h2>
              <p className="text-xs sm:text-sm text-[#626B63] mt-2">
                CampusPulse serves three distinct audiences with purpose-built interfaces that stay synchronized in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Experience A: Student Reporting */}
              <div className="flex flex-col bg-[#FAF9F5] rounded-xl border border-[#DCE2D9] p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348] flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-[#246348] border border-[#DCE2D9]">
                    Reporter View
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#202720]">Student & Campus Intake</h3>
                <p className="text-xs text-[#626B63] mt-1">
                  Structured reporting designed to capture maintenance needs and resource waste across campus.
                </p>

                <div className="my-6 space-y-2.5 text-xs text-[#202720] flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>5-step single-column structured capture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>Instant priority heuristic preview (1–100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>Direct tracking of locally submitted reports</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveRole('student')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white border border-[#DCE2D9] text-[#202720] text-xs font-semibold hover:bg-[#EAF2ED] hover:text-[#246348] hover:border-[#246348] transition-all shadow-2xs"
                >
                  <span>Launch Student Intake</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Experience B: Operations Command Hub */}
              <div className="flex flex-col bg-[#FAF9F5] rounded-xl border border-[#246348]/30 p-6 relative hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348] flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-[#246348] border border-[#DCE2D9]">
                    Operations Hub
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#202720]">Operations Command Hub</h3>
                <p className="text-xs text-[#626B63] mt-1">
                  Triage queue for facility managers, dispatchers, and campus maintenance teams.
                </p>

                <div className="my-6 space-y-2.5 text-xs text-[#202720] flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>Priority-sorted triage queue with category filters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>Evidence-aware resolution dialog with photo upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>Trust & Impact Ledger with full audit trails</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveRole('operations')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#246348] text-white text-xs font-semibold hover:bg-[#1b4c37] transition-all shadow-xs"
                >
                  <span>Open Operations Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Experience C: Campus Public Signage */}
              <div className="flex flex-col bg-[#FAF9F5] rounded-xl border border-[#DCE2D9] p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348] flex items-center justify-center">
                    <Tv2 className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-[#246348] border border-[#DCE2D9]">
                    Public Signage
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#202720]">Public Campus Signage</h3>
                <p className="text-xs text-[#626B63] mt-1">
                  Designed for 16:9 ambient large-format screens in high-footfall campus areas.
                </p>

                <div className="my-6 space-y-2.5 text-xs text-[#202720] flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>16:9 ambient layout with high contrast readability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>Live resolution ticker with WCAG pause controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0" />
                    <span>Strict privacy preservation: zero student personal data</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveRole('benq-kiosk')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white border border-[#DCE2D9] text-[#202720] text-xs font-semibold hover:bg-[#EAF2ED] hover:text-[#246348] hover:border-[#246348] transition-all shadow-2xs"
                >
                  <span>View Signage Mode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 5. Trust & Impact Ledger Deep Dive */}
        <section id="trust-ledger" className="py-16 md:py-20 bg-[#F6F6F1] border-b border-[#DCE2D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202720]">
                The CampusPulse Trust & Impact Ledger
              </h2>
              <p className="text-xs sm:text-sm text-[#626B63] mt-2">
                Why proof matters: In traditional campus systems, issues disappear into a black box. CampusPulse requires documentation and honest environmental accounting.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Evidence Resolution Ladder */}
              <div className="bg-white rounded-xl border border-[#DCE2D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4 text-[#246348]">
                  <Layers className="w-5 h-5" />
                  <h3 className="text-base font-bold text-[#202720]">The 3-Tier Resolution Evidence Ladder</h3>
                </div>
                <p className="text-xs text-[#626B63] mb-6">
                  Not all resolutions are created equal. The system transparently flags the level of evidence provided by the maintenance crew:
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#246348]/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#246348] flex items-center gap-1.5">
                        <Camera className="w-4 h-4" />
                        Photo Attached
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAF2ED] text-[#246348]">
                        Highest Verification
                      </span>
                    </div>
                    <p className="text-xs text-[#626B63]">
                      Operator supplies an explanatory repair diagnosis (≥10 chars) AND a photo attachment on record documenting physical rectification.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#946800] flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        Note Recorded
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FBF4E6] text-[#946800]">
                        Documented
                      </span>
                    </div>
                    <p className="text-xs text-[#626B63]">
                      Detailed diagnostic commentary recorded in the audit log explaining action taken, without photographic media attached.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#626B63] flex items-center gap-1.5">
                        <Activity className="w-4 h-4" />
                        Status Recorded Only
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EFEFEA] text-[#626B63]">
                        Basic Toggle
                      </span>
                    </div>
                    <p className="text-xs text-[#626B63]">
                      A status flip without notes or photos. Public signage transparently discloses this so students know documentation is pending.
                    </p>
                  </div>
                </div>
              </div>

              {/* Environmental Provenance Standards */}
              <div className="bg-white rounded-xl border border-[#DCE2D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4 text-[#246348]">
                  <Zap className="w-5 h-5" />
                  <h3 className="text-base font-bold text-[#202720]">Environmental Provenance & Integrity</h3>
                </div>
                <p className="text-xs text-[#626B63] mb-6">
                  Zero greenwashing. We explicitly declare the scientific origin of every figure:
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#202720]">MEASURED (Hardware Sub-Meter)</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-[#626B63] border border-[#DCE2D9]">
                        Hardware Present
                      </span>
                    </div>
                    <p className="text-xs text-[#626B63]">
                      Direct IoT or physical utility meter readings. When no live sub-meter is connected, CampusPulse explicitly outputs <span className="font-mono text-[#202720]">null</span> rather than inventing a number.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#202720]">MODELLED (Disclosed Engineering Formula)</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-[#626B63] border border-[#DCE2D9]">
                        Calculated
                      </span>
                    </div>
                    <p className="text-xs text-[#626B63]">
                      Standardized engineering heuristics (e.g. 2.5 kW cooling × run hours) with disclosed mathematical formulas, units, and baseline assumptions.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#202720]">NOT MEASURED (Qualitative Repairs)</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-[#626B63] border border-[#DCE2D9]">
                        Truthful
                      </span>
                    </div>
                    <p className="text-xs text-[#626B63]">
                      Safety items, latches, or pathway lighting defects carry zero false eco claims, preserving scientific integrity across the ledger.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 6. How CampusPulse Operates in Practice */}
        <section className="py-16 md:py-20 bg-white border-b border-[#DCE2D9]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202720]">
                How CampusPulse Operates in Practice
              </h2>
              <p className="text-xs sm:text-sm text-[#626B63] mt-2">
                A reliable operational sequence from first report to verified resolution.
              </p>
            </div>

            <div className="space-y-4">

              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#202720]">Submit an Issue Report in Student Intake</h4>
                  <p className="text-xs text-[#626B63] mt-1">
                    Select a category, specify location, choose urgency, and provide a description. The priority heuristic calculates an immediate urgency score.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#202720]">Triage and Assign in Operations Hub</h4>
                  <p className="text-xs text-[#626B63] mt-1">
                    Facility managers review reports ranked by deterministic priority, assign maintenance wings, and move tickets to In Progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#202720]">Document Resolution with Supporting Evidence in the Ledger</h4>
                  <p className="text-xs text-[#626B63] mt-1">
                    Operators record resolution notes and attach completion photos to advance the record on the evidence ladder.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAF9F5] border border-[#DCE2D9]">
                <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#246348] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#202720]">Ambient Public Broadcast on Campus Signage</h4>
                  <p className="text-xs text-[#626B63] mt-1">
                    Resolved tickets stream across the 16:9 signage ticker with standardized evidence badges, while suppressing all reporter personal details.
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setActiveRole('student')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#246348] text-white text-sm font-semibold hover:bg-[#1b4c37] transition-all shadow-xs"
              >
                <span>Launch Student Intake View</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* 7. Public Landing Footer */}
      <footer className="bg-white border-t border-[#DCE2D9] py-12 text-xs text-[#626B63]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#DCE2D9]">

            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-[#202720] font-bold text-base mb-2">
                <Building2 className="w-5 h-5 text-[#246348]" />
                <span>CampusPulse</span>
              </div>
              <p className="text-xs text-[#626B63] max-w-sm leading-relaxed">
                From Report to Resolution: An evidence-aware campus infrastructure reporting, triage, and ambient signage platform.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#246348]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Self-contained client state
                </span>
                <span className="text-[#DCE2D9]">&bull;</span>
                <span className="text-[11px] text-[#626B63]">
                  Browser-local storage
                </span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-[#202720] block mb-3 uppercase tracking-wider text-[11px]">
                Workspaces
              </span>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveRole('student')} className="hover:text-[#246348] transition-colors">
                    Student & Campus Intake
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveRole('operations')} className="hover:text-[#246348] transition-colors">
                    Operations Command Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveRole('benq-kiosk')} className="hover:text-[#246348] transition-colors">
                    Public Campus Signage
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Mandatory Transparency Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8E988F]">
            <p>
              CampusPulse is an independent operations prototype using browser-local storage. No live utility sub-meters or administrative systems are connected.
            </p>
            <p className="shrink-0">
              Zero external telemetry &bull; 100% Client-Side
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
