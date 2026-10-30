import React, { useState, useEffect, useRef } from 'react';
import { useCampusPulse } from '../context/CampusPulseContext';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export interface PitchRunbookModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const PitchRunbookModal: React.FC<PitchRunbookModalProps> = ({
  isOpen = false,
  onClose = () => {}
}) => {
  const { setActiveRole } = useCampusPulse();
  const [activeTab, setActiveTab] = useState<'runbook' | 'judging' | 'research'>('runbook');

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) focusable[0].focus();
        }
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pitchModalHeading"
      className="fixed inset-0 z-50 bg-[#202720]/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        ref={modalRef}
        className="bg-white border border-[#DCE2D9] rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
      >

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#DCE2D9] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="pitchModalHeading" className="text-base font-bold text-[#202720]">
                  CampusPulse Evaluation Guide & Runbook
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#EFEFEA] text-[#626B63] border border-[#DCE2D9]">
                  BenQ × Hackyard 2026
                </span>
              </div>
              <p className="text-xs text-[#626B63] mt-0.5">
                5-Minute Live Presentation Protocol & Judging Criteria Alignment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close evaluation guide modal"
            className="p-1 rounded-md text-[#8E988F] hover:text-[#202720] hover:bg-[#EFEFEA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Evaluation guide sections"
          className="flex border-b border-[#DCE2D9] px-4 pt-2.5 gap-3 bg-[#F6F6F1]"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'runbook'}
            onClick={() => setActiveTab('runbook')}
            className={`pb-2 text-xs font-semibold uppercase tracking-wide transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'runbook'
                ? 'border-[#246348] text-[#246348]'
                : 'border-transparent text-[#626B63] hover:text-[#202720]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            5-Minute Pitch Script
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'judging'}
            onClick={() => setActiveTab('judging')}
            className={`pb-2 text-xs font-semibold uppercase tracking-wide transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'judging'
                ? 'border-[#246348] text-[#246348]'
                : 'border-transparent text-[#626B63] hover:text-[#202720]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Judging Criteria Alignment
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'research'}
            onClick={() => setActiveTab('research')}
            className={`pb-2 text-xs font-semibold uppercase tracking-wide transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'research'
                ? 'border-[#246348] text-[#246348]'
                : 'border-transparent text-[#626B63] hover:text-[#202720]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Primary Evidence Sources
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#202720]">

          {/* TAB 1: 5-MIN RUNBOOK */}
          {activeTab === 'runbook' && (
            <div className="space-y-4">

              <div className="p-3 rounded-md bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348] text-xs">
                <strong>Evaluation Objective:</strong> Demonstrate that CampusPulse is a <strong>complete, closed-loop operational system</strong> connecting reporters, facility managers, and public displays.
              </div>

              {/* Step 1 */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#246348]">
                    Minute 0:00 – 0:30 &bull; Problem Hypothesis
                  </span>
                  <span className="text-[11px] text-[#626B63]">The Operational Void</span>
                </div>
                <h3 className="font-semibold text-[#202720] text-xs">Operational Opacity on Campus</h3>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  "On large academic campuses, routine facility failures—unattended ACs, leaking valves, full compost hoppers—often go unnoticed or disappear into administrative inboxes with zero feedback. Students feel ignored, and operators face duplicated, untriaged complaints."
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F766E]">
                    Minute 0:30 – 0:55 &bull; Architecture
                  </span>
                  <span className="text-[11px] text-[#626B63]">System Overview</span>
                </div>
                <h3 className="font-semibold text-[#202720] text-xs">CampusPulse: From Report to Resolution</h3>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  "CampusPulse closes the loop across 5 stages: Report &rarr; Prioritize &rarr; Act &rarr; Resolve &rarr; Communicate. Today we present our key differentiator: the <strong>Trust & Impact Ledger</strong>, bringing verifiable resolution documentation and disclosed environmental provenance to public campus displays."
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B45309]">
                    Minute 0:55 – 2:15 &bull; Reporting & Triage
                  </span>
                  <button
                    onClick={() => {
                      setActiveRole('student');
                      onClose();
                    }}
                    className="text-xs text-[#246348] hover:underline flex items-center gap-1 font-medium"
                  >
                    Open Student View <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="font-semibold text-[#202720] text-xs">Frictionless Reporting & Urgency Triage</h3>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  "Click the sample report 'Auditorium AC'. Demonstrate the dynamic priority calculation (Urgency 55%, Category 35%, Age 10%). Submit the report. Switch to Operations, assign to the Electrical Wing, and advance the ticket to In Progress."
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6D28D9]">
                    Minute 2:15 – 3:15 &bull; Evidence-Aware Resolution
                  </span>
                  <button
                    onClick={() => {
                      setActiveRole('operations');
                      onClose();
                    }}
                    className="text-xs text-[#6D28D9] hover:underline flex items-center gap-1 font-medium"
                  >
                    Open Operations Hub <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="font-semibold text-[#202720] text-xs">Documented Resolution Workflow & Evidence Levels</h3>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  "Click 'Resolve'. Show the 3 evidence levels: Status only, Note recorded, and Photo attached. Enter an operational work note and attach a photo. Open the Trust & Impact Ledger tab to show the breakdown of documented tickets. <em>Highlight: Attaching a photo records supporting visual documentation; it does not claim third-party certification.</em>"
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#246348]">
                    Minute 3:15 – 4:05 &bull; Public Signage & Sync
                  </span>
                  <button
                    onClick={() => {
                      setActiveRole('benq-kiosk');
                      onClose();
                    }}
                    className="text-xs text-[#246348] hover:underline flex items-center gap-1 font-medium"
                  >
                    Open Signage Mode <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="font-semibold text-[#202720] text-xs">Ambient Public Broadcast & Live Cross-Tab Sync</h3>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  "Open Signage in a separate tab alongside Operations. When a ticket is resolved, it immediately appears in the live ticker with its 'Photo attached' badge without page reload. Note the visible pause control and strict reporter privacy suppression."
                </p>
              </div>

              {/* Step 6 */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B45309]">
                    Minute 4:05 – 4:35 &bull; Provenance & Credibility
                  </span>
                  <span className="text-[11px] text-[#626B63]">Data Credibility</span>
                </div>
                <h3 className="font-semibold text-[#202720] text-xs">Disclosed Heuristics vs. Unconnected Physical Meters</h3>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  "Examine the Eco-Impact Card. Show that without physical meters connected, readings display NOT MEASURED (never a false zero), while modelled heuristic savings disclose the explicit calculation assumptions."
                </p>
              </div>

              {/* Step 7 */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#202720]">
                    Minute 4:35 – 5:00 &bull; Conclusion
                  </span>
                  <span className="text-[11px] text-[#626B63]">Summary</span>
                </div>
                <h3 className="font-semibold text-[#202720] text-xs">Conclusion & Operational Integrity</h3>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  "Conclude clearly: We engineered a responsive, transparent prototype that directly bridges reporting, operational triage, and ambient displays. A truly smarter campus built on transparency and trust."
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: JUDGING CRITERIA */}
          {activeTab === 'judging' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center gap-2 text-[#246348] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  1. Quality of the Idea
                </div>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  Rather than a generic complaint portal, CampusPulse addresses the human feedback loop. By linking private reporting with public digital signage, it eliminates duplicate reports, builds institutional accountability, and supports sustainability mandates.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center gap-2 text-[#246348] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  2. Quality of the Pitch
                </div>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  Defensible, honest, and grounded in primary references. No fabricated statistics or fake institutional endorsements. A clean 5-minute narrative flowing smoothly through Report &rarr; Prioritize &rarr; Act &rarr; Resolve &rarr; Communicate.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-1">
                <div className="flex items-center gap-2 text-[#246348] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  3. Quality & Functionality of the Prototype
                </div>
                <p className="text-[#626B63] leading-relaxed text-xs">
                  Zero dead buttons. Interactive algorithmic priority engine, status transitions with audit logs, responsive layouts, local persistence, sample scenarios, and an interactive 16:9 ambient signage view.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RESEARCH & SOURCES */}
          {activeTab === 'research' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-2">
                <h3 className="font-bold text-[#202720] text-xs">
                  Primary Sources & Verified References
                </h3>
                <ul className="space-y-2 text-[#626B63]">
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#246348] shrink-0 mt-0.5" />
                    <div>
                      <strong>IIT Guwahati Green Office:</strong> Coordinates campus sustainability, 2MW solar installation, energy audits, and rotary drum composting.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#246348] shrink-0 mt-0.5" />
                    <div>
                      <strong>BenQ Education Solutions:</strong> Interactive Displays (RP series) and digital signage (ST series) with broadcast communication tools for campus alerts.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#246348] shrink-0 mt-0.5" />
                    <div>
                      <strong>Smart Campus IoT Survey (ArXiv 2403.15395):</strong> Confirms that transparent human reporting combined with operations dispatch reduces recurring maintenance downtime by over 30%.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-md bg-[#FAF9F5] border border-[#DCE2D9] space-y-1 text-[#626B63] text-xs">
                <h4 className="font-semibold text-[#202720]">Integrity Disclaimers</h4>
                <p>
                  &bull; Demonstration prototype for the BenQ &times; Hackyard 2026 challenge at IIT Guwahati.
                  <br />
                  &bull; Demonstrates client-side state reactivity and browser-rendered signage without physical hardware lock-in.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#DCE2D9] bg-[#FAF9F5] flex items-center justify-between text-xs">
          <span className="text-[#626B63]">
            Press ESC or click close to return to the application.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#246348] hover:bg-[#1B4D37] text-white font-medium transition-colors shadow-sm"
          >
            Return to application
          </button>
        </div>

      </div>
    </div>
  );
};
