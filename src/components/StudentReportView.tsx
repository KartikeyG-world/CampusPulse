import React, { useState } from 'react';
import { useCampusPulse } from '../context/CampusPulseContext';
import { IssueCategory, UrgencyLevel, CampusZone } from '../types';
import { calculatePriorityScore, getCategoryBadge, getTierColor } from '../utils/priority';
import { validateReportSubmission } from '../utils/validation';
import {
  Zap,
  Droplets,
  Trash2,
  ShieldAlert,
  Wrench,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export const StudentReportView: React.FC = () => {
  const { addIssue, issues, setActiveRole } = useCampusPulse();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('ENERGY');
  const [zone, setZone] = useState<CampusZone>('Core 1 Lecture Complex');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);

  // Real-time calculated priority preview (informational & secondary)
  const livePriority = calculatePriorityScore(urgency, category, 0);

  const validate = () => {
    const res = validateReportSubmission({ title, location, description, category, zone });
    setErrors(res.errors);
    return res.valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addIssue({
      title,
      category,
      zone,
      location,
      urgency,
      description,
      reporterName: reporterName || undefined,
    });

    // Reset form fields
    setTitle('');
    setLocation('');
    setDescription('');
    setReporterName('');
    setErrors({});
  };

  const categories: { id: IssueCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'ENERGY',
      label: 'Energy & Power',
      icon: <Zap className="w-4 h-4 text-[#B45309]" />,
      desc: 'HVAC running in empty rooms, lights on during daylight',
    },
    {
      id: 'WATER',
      label: 'Water & Plumbing',
      icon: <Droplets className="w-4 h-4 text-[#0F766E]" />,
      desc: 'Leaking taps, pipe seepage, tank overflow',
    },
    {
      id: 'WASTE',
      label: 'Waste & Composting',
      icon: <Trash2 className="w-4 h-4 text-[#246348]" />,
      desc: 'Overflowing bins, unsegregated food waste',
    },
    {
      id: 'SAFETY',
      label: 'Safety & Hazards',
      icon: <ShieldAlert className="w-4 h-4 text-[#B91C1C]" />,
      desc: 'Dark pathways, walkway hazards, loose cables',
    },
    {
      id: 'FACILITIES',
      label: 'Facilities & AV',
      icon: <Wrench className="w-4 h-4 text-[#4B5563]" />,
      desc: 'Broken doors, smart screens, classroom hardware',
    },
  ];

  const urgencies: { id: UrgencyLevel; label: string; desc: string }[] = [
    { id: 'LOW', label: 'Low', desc: 'Cosmetic wear or minor convenience' },
    { id: 'MEDIUM', label: 'Medium', desc: 'Routine operational inconvenience' },
    { id: 'HIGH', label: 'High', desc: 'Active resource waste or walking hazard' },
    { id: 'EMERGENCY', label: 'Urgent', desc: 'Immediate safety or facility concern' },
  ];

  const zones: CampusZone[] = [
    'Core 1 Lecture Complex',
    'Hostels (Manas / Brahmaputra)',
    'Central Library & Admin',
    'Food Court & Market Area',
    'Sports Complex & Grounds',
    'Green Belt & Riverfront Path',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Page Header & Purpose */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202720]">
          Report a campus issue
        </h1>
        <p className="text-sm text-[#626B63] leading-relaxed">
          Submit facility, maintenance, or resource issues across campus to help operations triage and resolve them quickly.
        </p>
      </div>

      {/* Main Reporting Form (Single-Column Sequence) */}
      <div className="bg-white rounded-lg border border-[#DCE2D9] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1: Category Picker */}
          <div>
            <label className="block text-sm font-semibold text-[#202720] mb-1">
              1. Issue category
            </label>
            <p className="text-xs text-[#626B63] mb-3">
              Select the option that best describes the issue.
            </p>
            <div
              role="radiogroup"
              aria-label="Issue category"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setCategory(cat.id)}
                    className={`text-left p-3 rounded-md border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#246348] bg-[#EAF2ED] text-[#202720] ring-1 ring-[#246348]'
                        : 'border-[#DCE2D9] bg-white text-[#202720] hover:border-[#BAC5B5] hover:bg-[#F6F6F1]'
                    }`}
                  >
                    <div className="p-1.5 rounded bg-white border border-[#DCE2D9] shrink-0 mt-0.5">
                      {cat.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#202720]">{cat.label}</div>
                      <div className="text-xs text-[#626B63] mt-0.5 leading-snug">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Location & Zone */}
          <div className="space-y-4 pt-2 border-t border-[#DCE2D9]">
            <label className="block text-sm font-semibold text-[#202720]">
              2. Location
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="campusZoneSelect" className="block text-xs font-medium text-[#626B63] mb-1.5">
                  Campus zone
                </label>
                <select
                  id="campusZoneSelect"
                  value={zone}
                  onChange={(e) => setZone(e.target.value as CampusZone)}
                  className="w-full bg-[#EFEFEA] border border-[#DCE2D9] rounded-md px-3 py-2 text-sm text-[#202720] focus:bg-white focus:outline-none focus:border-[#246348] focus:ring-1 focus:ring-[#246348]"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="locationInput" className="block text-xs font-medium text-[#626B63] mb-1.5">
                  Specific room or area
                </label>
                <div className="relative">
                  <input
                    id="locationInput"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Core 1 Hall 3, 2nd floor"
                    className={`w-full bg-[#EFEFEA] border rounded-md px-3 py-2 text-sm text-[#202720] focus:bg-white focus:outline-none focus:ring-1 ${
                      errors.location
                        ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]'
                        : 'border-[#DCE2D9] focus:border-[#246348] focus:ring-[#246348]'
                    }`}
                  />
                  <MapPin className="w-4 h-4 text-[#8E988F] absolute right-3 top-2.5" />
                </div>
                {errors.location && (
                  <p className="text-xs text-[#B91C1C] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Urgency Level */}
          <div className="space-y-2 pt-2 border-t border-[#DCE2D9]">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#202720]">
                3. Urgency
              </label>
              <span className="text-xs text-[#626B63]">Helps operations prioritize response</span>
            </div>
            <div
              role="radiogroup"
              aria-label="Urgency level"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {urgencies.map((u) => {
                const isSelected = urgency === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setUrgency(u.id)}
                    className={`p-3 rounded-md border text-left transition-all ${
                      isSelected
                        ? 'border-[#246348] bg-[#EAF2ED] text-[#202720] ring-1 ring-[#246348]'
                        : 'border-[#DCE2D9] bg-white text-[#626B63] hover:border-[#BAC5B5] hover:bg-[#F6F6F1]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#202720]">{u.label}</div>
                    <div className="text-[11px] text-[#626B63] mt-0.5 leading-tight">{u.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Title & Description */}
          <div className="space-y-4 pt-2 border-t border-[#DCE2D9]">
            <div>
              <label htmlFor="issueTitleInput" className="block text-sm font-semibold text-[#202720] mb-1">
                4. Short title
              </label>
              <input
                id="issueTitleInput"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AC left running in empty lecture hall"
                className={`w-full bg-[#EFEFEA] border rounded-md px-3 py-2 text-sm text-[#202720] focus:bg-white focus:outline-none focus:ring-1 ${
                  errors.title
                    ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]'
                    : 'border-[#DCE2D9] focus:border-[#246348] focus:ring-[#246348]'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-[#B91C1C] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="issueDescriptionInput" className="block text-sm font-semibold text-[#202720] mb-1">
                5. Description
              </label>
              <textarea
                id="issueDescriptionInput"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed, approximate duration, or specific equipment details..."
                className={`w-full bg-[#EFEFEA] border rounded-md px-3 py-2 text-sm text-[#202720] focus:bg-white focus:outline-none focus:ring-1 ${
                  errors.description
                    ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]'
                    : 'border-[#DCE2D9] focus:border-[#246348] focus:ring-[#246348]'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-[#B91C1C] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Step 5: Optional Reporter Name & Privacy Disclosure */}
          <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-2">
            <div>
              <label htmlFor="reporterNameInput" className="block text-xs font-medium text-[#202720] mb-1">
                Your name or handle (optional)
              </label>
              <input
                id="reporterNameInput"
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Arjun (Student) or leave blank"
                className="w-full bg-white border border-[#DCE2D9] rounded-md px-3 py-1.5 text-xs text-[#202720] focus:outline-none focus:border-[#246348]"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#626B63]">
              <ShieldCheck className="w-4 h-4 text-[#246348] shrink-0" />
              <span>Your name is optional and will not be displayed on public campus signage.</span>
            </div>
          </div>

          {/* Secondary Priority Preview (Informational & Collapsible) */}
          <div
            role="status"
            aria-live="polite"
            className="p-3.5 rounded-md bg-[#FAF9F5] border border-[#DCE2D9] space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#202720]">
                  Estimated priority: {livePriority.score} / 100 ({livePriority.tier})
                </span>
                <p className="text-[11px] text-[#626B63] mt-0.5">
                  Preliminary estimate based on urgency and category. Operations triages all tickets upon submission.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCalculationDetails(!showCalculationDetails)}
                className="text-xs text-[#246348] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>{showCalculationDetails ? 'Hide' : 'Details'}</span>
                {showCalculationDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showCalculationDetails && (
              <div className="pt-2 border-t border-[#DCE2D9] text-xs text-[#626B63] space-y-1">
                <div className="flex justify-between">
                  <span>Urgency weight (55%):</span>
                  <span className="font-medium text-[#202720]">{livePriority.breakdown.urgencyScore} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Category impact (35%):</span>
                  <span className="font-medium text-[#202720]">{livePriority.breakdown.categoryScore} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Age factor (10%):</span>
                  <span className="text-[#626B63]">0 pts (New report)</span>
                </div>
              </div>
            )}
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-md bg-[#246348] hover:bg-[#1B4D37] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors active:translate-y-px"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            Submit report
          </button>

        </form>
      </div>

      {/* Routine Maintenance Notice */}
      <div className="p-3.5 rounded-md bg-white border border-[#DCE2D9] flex items-start gap-2.5 text-xs text-[#626B63]">
        <Info className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
        <span>
          <strong>Routine maintenance notice:</strong> CampusPulse handles routine campus facility and energy issues. For urgent life-safety or medical emergencies, contact campus emergency services directly.
        </span>
      </div>

      {/* Recent Community Reports Feed */}
      <div className="bg-white rounded-lg border border-[#DCE2D9] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE2D9] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#202720]">
              Recent campus reports
            </h2>
            <p className="text-xs text-[#626B63]">
              Track the progress of recently reported issues across campus.
            </p>
          </div>
          <button
            onClick={() => setActiveRole('benq-kiosk')}
            className="text-xs text-[#246348] hover:underline flex items-center gap-1 font-medium"
          >
            View public campus signage →
          </button>
        </div>

        {/* Issue Cards or Empty State */}
        {issues.length === 0 ? (
          <div className="p-8 text-center rounded-md bg-[#FAF9F5] border border-dashed border-[#DCE2D9]">
            <p className="text-xs font-medium text-[#202720]">No reports recorded yet</p>
            <p className="text-xs text-[#626B63] mt-1 max-w-sm mx-auto">
              Reports submitted through this form will appear here and synchronize to the Operations Hub.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {issues.slice(0, 6).map((item) => {
              const catBadge = getCategoryBadge(item.category);
              const tier = getTierColor(item.priorityTier);

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] flex flex-col justify-between gap-2 hover:border-[#BAC5B5] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-[#246348]">
                          {item.ticketNumber}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-white border border-[#DCE2D9] text-[#626B63]">
                          {catBadge.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.status === 'RESOLVED'
                            ? 'bg-[#EAF2ED] text-[#246348]'
                            : item.status === 'IN_PROGRESS'
                            ? 'bg-[#E6F4F2] text-[#0F766E]'
                            : item.status === 'TRIAGED'
                            ? 'bg-[#F3E8FF] text-[#6D28D9]'
                            : 'bg-[#FEF3C7] text-[#B45309]'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-[#202720] line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-[#626B63] line-clamp-2 mt-0.5">{item.description}</p>
                  </div>

                  <div className="border-t border-[#DCE2D9] pt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#626B63]">
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-[#8E988F] shrink-0" />
                        {item.location}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${tier.badge}`}>
                        Priority: {item.priorityScore}
                      </span>
                    </div>

                    {item.status === 'RESOLVED' && item.resolutionNotes && (
                      <div className="p-2 rounded bg-white border border-[#DCE2D9] text-xs text-[#202720] flex items-start gap-1.5 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#246348] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.resolutionNotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
