import React, { useState, useEffect, useRef } from 'react';
import { useCampusPulse } from '../context/CampusPulseContext';
import {
  IssueCategory,
  IssueStatus,
  CampusZone,
  CampusIssue,
  ResolutionEvidenceState,
  EvidenceAttachment
} from '../types';
import { getTierColor, getCategoryBadge } from '../utils/priority';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  SlidersHorizontal,
  Wrench,
  UserCheck,
  History,
  X,
  Flame,
  Check,
  Camera,
  FileText,
  ShieldCheck,
  Scale,
  Trash2,
  HelpCircle,
  Eye,
  Zap,
  Droplets,
  Tv,
  ExternalLink,
  LayoutGrid,
  List
} from 'lucide-react';
import { validateResolutionInput, validateAttachment } from '../utils/validation';

export const OperationsView: React.FC<{ initialTab?: 'QUEUE' | 'LEDGER' }> = ({ initialTab = 'QUEUE' }) => {
  const { issues, updateIssueStatus, ecoMetrics } = useCampusPulse();

  // Navigation tab: Queue vs. Trust & Impact Ledger
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'LEDGER'>(initialTab);
  const [viewMode, setViewMode] = useState<'TABLE' | 'LIST'>('TABLE');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'ALL'>('ALL');
  const [selectedZone, setSelectedZone] = useState<CampusZone | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'PRIORITY' | 'NEWEST' | 'OLDEST'>('PRIORITY');

  // Modal states
  const [resolvingIssue, setResolvingIssue] = useState<CampusIssue | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [evidenceStateChoice, setEvidenceStateChoice] = useState<ResolutionEvidenceState>('OPERATOR_DOCUMENTED');
  const [attachment, setAttachment] = useState<EvidenceAttachment | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  const [auditDetailIssue, setAuditDetailIssue] = useState<CampusIssue | null>(null);
  const [assigningIssue, setAssigningIssue] = useState<CampusIssue | null>(null);
  const [assignedWing, setAssignedWing] = useState('Campus Electrical Wing');
  const [inspectEvidenceIssue, setInspectEvidenceIssue] = useState<CampusIssue | null>(null);

  // Focus trap ref
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Accessible Modal Keyboard & Focus Trap Management
  const isAnyModalOpen = Boolean(resolvingIssue || assigningIssue || auditDetailIssue || inspectEvidenceIssue);

  useEffect(() => {
    if (isAnyModalOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setResolvingIssue(null);
          setAssigningIssue(null);
          setAuditDetailIssue(null);
          setInspectEvidenceIssue(null);
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

      // Auto-focus first focusable element in modal
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
  }, [isAnyModalOpen]);

  // Filter logic
  const filteredIssues = issues.filter((issue) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${issue.ticketNumber} ${issue.title} ${issue.location} ${issue.description}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    if (selectedStatus !== 'ALL' && issue.status !== selectedStatus) return false;
    if (selectedCategory !== 'ALL' && issue.category !== selectedCategory) return false;
    if (selectedZone !== 'ALL' && issue.zone !== selectedZone) return false;
    return true;
  });

  // Sort logic
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'PRIORITY') {
      return b.priorityScore - a.priorityScore;
    }
    if (sortBy === 'NEWEST') {
      const timeA = a.reportedAt ? new Date(a.reportedAt).getTime() : 0;
      const timeB = b.reportedAt ? new Date(b.reportedAt).getTime() : 0;
      return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
    }
    if (sortBy === 'OLDEST') {
      const timeA = a.reportedAt ? new Date(a.reportedAt).getTime() : 0;
      const timeB = b.reportedAt ? new Date(b.reportedAt).getTime() : 0;
      return (Number.isFinite(timeA) ? timeA : 0) - (Number.isFinite(timeB) ? timeB : 0);
    }
    return 0;
  });

  // KPI Calculations derived directly from records
  const totalActive = issues.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = issues.filter((i) => i.status !== 'RESOLVED' && i.priorityScore >= 80).length;
  const inProgressCount = issues.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedList = issues.filter((i) => i.status === 'RESOLVED');
  const resolvedCount = resolvedList.length;

  // Evidence state breakdown derived strictly from actual resolved records
  const evidenceAttachedCount = resolvedList.filter((i) => i.evidenceState === 'EVIDENCE_ATTACHED').length;
  const operatorDocumentedCount = resolvedList.filter((i) => i.evidenceState === 'OPERATOR_DOCUMENTED').length;
  const statusRecordedCount = resolvedList.filter((i) => i.evidenceState === 'STATUS_RECORDED').length;

  // Image downscaling and validation helper for local prototype storage
  const processImageFile = async (file: File): Promise<{ dataUrl: string; size: number }> => {
    let bytes: Uint8Array | undefined;
    try {
      if (typeof file.slice === 'function') {
        const slice = await file.slice(0, 32).arrayBuffer();
        bytes = new Uint8Array(slice);
      }
    } catch (_) {}

    const valResult = validateAttachment({
      type: file.type,
      size: file.size,
      name: file.name,
      bytes
    });
    if (!valResult.valid) {
      throw new Error(valResult.error || 'Invalid file format or size.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not initialize image processing canvas.'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          resolve({
            dataUrl,
            size: Math.round((dataUrl.length * 3) / 4),
          });
        };
        img.onerror = () => reject(new Error('Could not parse image file.'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('File reading error.'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachmentError(null);
    try {
      const processed = await processImageFile(file);
      setAttachment({
        id: `att-${Date.now()}`,
        name: file.name,
        type: 'image/jpeg',
        size: processed.size,
        dataUrl: processed.dataUrl,
        uploadedAt: new Date().toISOString(),
        caption: 'Supporting work photo on file',
      });
      setEvidenceStateChoice('EVIDENCE_ATTACHED');
    } catch (err: any) {
      setAttachmentError(err.message || 'Error processing attachment.');
      setAttachment(null);
    }
  };

  const handleOpenResolveModal = (issue: CampusIssue) => {
    setResolvingIssue(issue);
    setResolutionNotes(`Normal routine operation restored at ${issue.location}.`);
    setEvidenceStateChoice('OPERATOR_DOCUMENTED');
    setAttachment(null);
    setAttachmentError(null);
    setFormValidationError(null);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIssue) return;

    setFormValidationError(null);

    // Validation rules using production validation utility
    const valResult = validateResolutionInput(evidenceStateChoice, resolutionNotes, attachment);
    if (!valResult.valid) {
      setFormValidationError(valResult.error || 'Validation error.');
      return;
    }

    updateIssueStatus(
      resolvingIssue.id,
      'RESOLVED',
      resolvingIssue.assignedTo,
      resolutionNotes.trim(),
      evidenceStateChoice,
      attachment || undefined
    );

    setResolvingIssue(null);
    setResolutionNotes('');
    setAttachment(null);
    setAttachmentError(null);
  };

  const handleOpenAssignModal = (issue: CampusIssue) => {
    setAssigningIssue(issue);
    if (issue.category === 'ENERGY') setAssignedWing('Campus Electrical Wing');
    else if (issue.category === 'WATER') setAssignedWing('Campus Plumbing Wing');
    else if (issue.category === 'WASTE') setAssignedWing('Campus Waste & Composting Unit');
    else if (issue.category === 'SAFETY') setAssignedWing('Estate Safety & Security');
    else setAssignedWing('General Facilities Maintenance');
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningIssue) return;
    updateIssueStatus(assigningIssue.id, 'TRIAGED', assignedWing);
    setAssigningIssue(null);
  };

  const categories: IssueCategory[] = ['ENERGY', 'WATER', 'WASTE', 'SAFETY', 'FACILITIES'];
  const zones: CampusZone[] = [
    'Core 1 Lecture Complex',
    'Hostels (Manas / Brahmaputra)',
    'Central Library & Admin',
    'Food Court & Market Area',
    'Sports Complex & Grounds',
    'Green Belt & Riverfront Path',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Top Header & Operational Views */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE2D9] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348]">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#202720] tracking-tight">
                Operations Command Hub
              </h1>
              <p className="text-xs text-[#626B63]">
                Triage, assign, and document campus maintenance tickets
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-View Navigation */}
          <div
            role="tablist"
            aria-label="Operations sub-views"
            className="flex bg-[#EFEFEA] p-0.5 rounded-lg border border-[#DCE2D9] text-xs"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'QUEUE'}
              onClick={() => setActiveTab('QUEUE')}
              className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                activeTab === 'QUEUE'
                  ? 'bg-white text-[#202720] shadow-sm border border-[#DCE2D9]'
                  : 'text-[#626B63] hover:text-[#202720]'
              }`}
            >
              Triage queue
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'LEDGER'}
              onClick={() => setActiveTab('LEDGER')}
              className={`px-3 py-1.5 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                activeTab === 'LEDGER'
                  ? 'bg-white text-[#202720] shadow-sm border border-[#DCE2D9]'
                  : 'text-[#626B63] hover:text-[#202720]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#6D28D9]" />
              Trust & impact ledger
            </button>
          </div>

          <a
            href="#kiosk"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#DCE2D9] hover:border-[#246348] text-[#202720] text-xs font-medium transition-colors"
            title="Open Public Campus Signage in a new tab"
          >
            <Tv className="w-3.5 h-3.5 text-[#246348]" />
            <span>Open signage tab</span>
            <ExternalLink className="w-3 h-3 text-[#8E988F]" />
          </a>
        </div>
      </div>

      {/* Operational Summary Strip (Clean & Restrained) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#626B63] text-xs font-medium">
            <span>Active queue</span>
            <AlertTriangle className="w-4 h-4 text-[#B45309]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#202720]">{totalActive}</span>
            <span className="text-xs text-[#626B63]">unresolved</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#B91C1C] text-xs font-medium">
            <span>Critical priority</span>
            <Flame className="w-4 h-4 text-[#B91C1C]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#B91C1C]">{criticalCount}</span>
            <span className="text-xs text-[#626B63]">Score &ge; 80</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#0F766E] text-xs font-medium">
            <span>In maintenance</span>
            <Clock className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#0F766E]">{inProgressCount}</span>
            <span className="text-xs text-[#626B63]">dispatched</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] shadow-sm">
          <div className="flex items-center justify-between text-[#246348] text-xs font-medium">
            <span>Documented closed</span>
            <CheckCircle2 className="w-4 h-4 text-[#246348]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#246348]">{resolvedCount}</span>
            <span className="text-xs text-[#626B63]">in ledger</span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* TAB 1: OPERATIONAL QUEUE                                 */}
      {/* ======================================================== */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-4">

          {/* Search, Filter & Sort Controls */}
          <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] space-y-3 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">

              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E988F]" />
                <input
                  type="text"
                  aria-label="Search incident records"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ticket #, description, room, or title..."
                  className="w-full bg-[#EFEFEA] border border-[#DCE2D9] rounded-md pl-9 pr-8 py-1.5 text-xs text-[#202720] placeholder-[#8E988F] focus:bg-white focus:outline-none focus:border-[#246348]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E988F] hover:text-[#202720]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <select
                aria-label="Filter by Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="bg-[#EFEFEA] border border-[#DCE2D9] rounded-md px-2.5 py-1.5 text-xs text-[#202720] focus:bg-white focus:outline-none focus:border-[#246348]"
              >
                <option value="ALL">All statuses</option>
                <option value="REPORTED">Reported</option>
                <option value="TRIAGED">Triaged</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Category filter */}
              <select
                aria-label="Filter by Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="bg-[#EFEFEA] border border-[#DCE2D9] rounded-md px-2.5 py-1.5 text-xs text-[#202720] focus:bg-white focus:outline-none focus:border-[#246348]"
              >
                <option value="ALL">All categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Zone filter */}
              <select
                aria-label="Filter by Campus Zone"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value as any)}
                className="bg-[#EFEFEA] border border-[#DCE2D9] rounded-md px-2.5 py-1.5 text-xs text-[#202720] focus:bg-white focus:outline-none focus:border-[#246348]"
              >
                <option value="ALL">All zones</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>

              {/* Sort by */}
              <select
                aria-label="Sort Order"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#EFEFEA] border border-[#DCE2D9] rounded-md px-2.5 py-1.5 text-xs text-[#202720] focus:bg-white focus:outline-none focus:border-[#246348]"
              >
                <option value="PRIORITY">Priority score (high to low)</option>
                <option value="NEWEST">Newest first</option>
                <option value="OLDEST">Oldest first</option>
              </select>

              {/* View Toggle */}
              <div className="hidden lg:flex items-center border border-[#DCE2D9] rounded-md p-0.5 bg-[#EFEFEA]">
                <button
                  type="button"
                  onClick={() => setViewMode('TABLE')}
                  className={`p-1 rounded text-xs ${viewMode === 'TABLE' ? 'bg-white text-[#202720] shadow-sm' : 'text-[#626B63] hover:text-[#202720]'}`}
                  title="Table view"
                  aria-label="Switch to Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('LIST')}
                  className={`p-1 rounded text-xs ${viewMode === 'LIST' ? 'bg-white text-[#202720] shadow-sm' : 'text-[#626B63] hover:text-[#202720]'}`}
                  title="Card list view"
                  aria-label="Switch to Card List View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            <div className="flex items-center justify-between text-xs text-[#626B63] pt-2 border-t border-[#DCE2D9]">
              <span>Showing {sortedIssues.length} of {issues.length} records</span>
              {(selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || selectedZone !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedStatus('ALL');
                    setSelectedCategory('ALL');
                    setSelectedZone('ALL');
                    setSearchQuery('');
                  }}
                  className="text-[#246348] hover:underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Ticket Queue View */}
          {issues.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg border border-dashed border-[#DCE2D9]">
              <SlidersHorizontal className="w-8 h-8 text-[#8E988F] mx-auto mb-2 opacity-60" />
              <h2 className="text-sm font-semibold text-[#202720]">No reports recorded yet</h2>
              <p className="text-xs text-[#626B63] mt-1 max-w-sm mx-auto">
                When campus issues are reported in this browser, they will appear here in the triage queue for assignment and resolution.
              </p>
            </div>
          ) : sortedIssues.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-[#DCE2D9]">
              <CheckCircle2 className="w-8 h-8 text-[#246348] mx-auto mb-2 opacity-60" />
              <h2 className="text-sm font-semibold text-[#202720]">No tickets match filter criteria</h2>
              <p className="text-xs text-[#626B63] mt-1">Try clearing active search terms or category filters.</p>
            </div>
          ) : viewMode === 'TABLE' ? (
            /* TABULAR GRID VIEW */
            <div className="bg-white rounded-lg border border-[#DCE2D9] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] text-[#626B63] font-medium border-b border-[#DCE2D9]">
                    <tr>
                      <th className="p-3">Ticket</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Title & Location</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Assignment</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE2D9]">
                    {sortedIssues.map((issue) => {
                      const badge = getCategoryBadge(issue.category);
                      const tierColor = getTierColor(issue.priorityTier);

                      return (
                        <tr key={issue.id} className="hover:bg-[#F6F6F1] transition-colors">
                          <td className="p-3 font-mono font-semibold text-[#246348] whitespace-nowrap">
                            {issue.ticketNumber}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`text-[11px] px-2 py-0.5 rounded border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${tierColor.bg} ${tierColor.text} ${tierColor.border}`}>
                              {issue.priorityScore} &bull; {issue.priorityTier}
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="font-medium text-[#202720] line-clamp-1">{issue.title}</div>
                            <div className="text-[11px] text-[#626B63] truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#8E988F] shrink-0" />
                              {issue.location} &bull; {issue.zone}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="flex flex-col gap-1 items-start">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  issue.status === 'RESOLVED'
                                    ? 'bg-[#EAF2ED] text-[#246348]'
                                    : issue.status === 'IN_PROGRESS'
                                    ? 'bg-[#E6F4F2] text-[#0F766E]'
                                    : issue.status === 'TRIAGED'
                                    ? 'bg-[#F3E8FF] text-[#6D28D9]'
                                    : 'bg-[#FEF3C7] text-[#B45309]'
                                }`}
                              >
                                {issue.status.replace('_', ' ')}
                              </span>
                              {issue.status === 'RESOLVED' && (
                                <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${
                                  issue.evidenceState === 'EVIDENCE_ATTACHED'
                                    ? 'border-[#D8B4FE] text-[#6D28D9] bg-[#F3E8FF]'
                                    : issue.evidenceState === 'OPERATOR_DOCUMENTED'
                                    ? 'border-[#DCE2D9] text-[#246348] bg-[#EAF2ED]'
                                    : 'border-[#DCE2D9] text-[#626B63] bg-[#EFEFEA]'
                                }`}>
                                  {issue.evidenceState === 'EVIDENCE_ATTACHED' ? 'Photo attached' : issue.evidenceState === 'OPERATOR_DOCUMENTED' ? 'Note recorded' : 'Status only'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap text-xs text-[#626B63]">
                            {issue.assignedTo || <span className="text-[#8E988F] italic">Unassigned</span>}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {issue.status === 'REPORTED' && (
                                <button
                                  onClick={() => handleOpenAssignModal(issue)}
                                  className="px-2.5 py-1 rounded bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#D8B4FE] text-[#6D28D9] text-xs font-medium transition-colors"
                                >
                                  Assign
                                </button>
                              )}

                              {issue.status === 'TRIAGED' && (
                                <button
                                  onClick={() => updateIssueStatus(issue.id, 'IN_PROGRESS')}
                                  className="px-2.5 py-1 rounded bg-[#E6F4F2] hover:bg-[#CCECE8] border border-[#99D9D1] text-[#0F766E] text-xs font-medium transition-colors"
                                >
                                  Dispatch
                                </button>
                              )}

                              {issue.status !== 'RESOLVED' && (
                                <button
                                  onClick={() => handleOpenResolveModal(issue)}
                                  className="px-2.5 py-1 rounded bg-[#EAF2ED] hover:bg-[#D5E6DA] border border-[#246348] text-[#246348] text-xs font-semibold transition-colors"
                                >
                                  Resolve
                                </button>
                              )}

                              <button
                                onClick={() => setAuditDetailIssue(issue)}
                                className="p-1 rounded bg-white hover:bg-[#EFEFEA] border border-[#DCE2D9] text-[#626B63] hover:text-[#202720] transition-colors"
                                title={`Audit history (${issue.auditHistory.length} events)`}
                                aria-label={`View audit history for ${issue.ticketNumber}`}
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CARD LIST VIEW */
            <div className="space-y-3">
              {sortedIssues.map((issue) => {
                const badge = getCategoryBadge(issue.category);
                const tierColor = getTierColor(issue.priorityTier);

                return (
                  <div
                    key={issue.id}
                    className="p-4 rounded-lg bg-white border border-[#DCE2D9] hover:border-[#BAC5B5] transition-colors shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

                      {/* Left: Info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#246348] bg-[#EAF2ED] px-2 py-0.5 rounded border border-[#DCE2D9]">
                            {issue.ticketNumber}
                          </span>

                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badge.color}`}>
                            {badge.label}
                          </span>

                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${tierColor.bg} ${tierColor.text} ${tierColor.border}`}>
                            Score: {issue.priorityScore} ({issue.priorityTier})
                          </span>

                          <span className="text-[11px] px-2 py-0.5 rounded bg-[#EFEFEA] text-[#626B63]">
                            {issue.status.replace('_', ' ')}
                          </span>

                          {issue.status === 'RESOLVED' && (
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                              issue.evidenceState === 'EVIDENCE_ATTACHED'
                                ? 'bg-[#F3E8FF] border border-[#D8B4FE] text-[#6D28D9]'
                                : issue.evidenceState === 'OPERATOR_DOCUMENTED'
                                ? 'bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348]'
                                : 'bg-[#EFEFEA] border border-[#DCE2D9] text-[#626B63]'
                            }`}>
                              {issue.evidenceState === 'EVIDENCE_ATTACHED' && <Camera className="w-3 h-3 text-[#6D28D9]" />}
                              {issue.evidenceState === 'OPERATOR_DOCUMENTED' && <FileText className="w-3 h-3 text-[#246348]" />}
                              {issue.evidenceState === 'STATUS_RECORDED' && <HelpCircle className="w-3 h-3 text-[#626B63]" />}
                              {issue.evidenceState === 'EVIDENCE_ATTACHED' ? 'Photo attached' : issue.evidenceState === 'OPERATOR_DOCUMENTED' ? 'Note recorded' : 'Status only'}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-semibold text-[#202720]">
                          {issue.title}
                        </h3>

                        <p className="text-xs text-[#626B63] leading-relaxed">
                          {issue.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#626B63] pt-1">
                          <span className="flex items-center gap-1 text-[#202720]">
                            <MapPin className="w-3.5 h-3.5 text-[#246348]" />
                            {issue.location} ({issue.zone})
                          </span>

                          {issue.assignedTo && (
                            <span className="flex items-center gap-1 text-[#0F766E]">
                              <UserCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                              Assigned: {issue.assignedTo}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#8E988F]" />
                            Reported: {issue.reportedAt && !isNaN(new Date(issue.reportedAt).getTime()) ? new Date(issue.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recorded'}
                          </span>
                        </div>

                        {issue.status === 'RESOLVED' && (
                          <div className="mt-2 p-2.5 rounded-md bg-[#FAF9F5] border border-[#DCE2D9] text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#246348] flex items-center gap-1 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#246348]" />
                                Work note on file
                              </span>
                              {issue.evidenceAttachment && (
                                <button
                                  onClick={() => setInspectEvidenceIssue(issue)}
                                  className="text-xs text-[#6D28D9] hover:underline font-medium flex items-center gap-1"
                                >
                                  <Camera className="w-3 h-3" />
                                  View attached photo
                                </button>
                              )}
                            </div>
                            <p className="text-[#626B63] italic text-xs">
                              "{issue.resolutionNotes || 'Marked resolved without extra note.'}"
                            </p>
                          </div>
                        )}

                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap lg:flex-col items-stretch justify-end gap-1.5 shrink-0 border-t lg:border-t-0 lg:border-l border-[#DCE2D9] pt-2 lg:pt-0 lg:pl-4">
                        {issue.status === 'REPORTED' && (
                          <button
                            onClick={() => handleOpenAssignModal(issue)}
                            className="px-3 py-1.5 rounded-md bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#D8B4FE] text-[#6D28D9] text-xs font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Assign
                          </button>
                        )}

                        {issue.status === 'TRIAGED' && (
                          <button
                            onClick={() => updateIssueStatus(issue.id, 'IN_PROGRESS')}
                            className="px-3 py-1.5 rounded-md bg-[#E6F4F2] hover:bg-[#CCECE8] border border-[#99D9D1] text-[#0F766E] text-xs font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            Dispatch
                          </button>
                        )}

                        {issue.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleOpenResolveModal(issue)}
                            className="px-3 py-1.5 rounded-md bg-[#EAF2ED] hover:bg-[#D5E6DA] border border-[#246348] text-[#246348] text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resolve
                          </button>
                        )}

                        <button
                          onClick={() => setAuditDetailIssue(issue)}
                          className="px-2.5 py-1.5 rounded-md bg-white hover:bg-[#EFEFEA] border border-[#DCE2D9] text-[#626B63] text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <History className="w-3.5 h-3.5 text-[#8E988F]" />
                          Audit ({issue.auditHistory.length})
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TRUST & IMPACT LEDGER                             */}
      {/* ======================================================== */}
      {activeTab === 'LEDGER' && (
        <div className="space-y-6">

          {/* Ledger Header & Narrative */}
          <div className="p-5 rounded-lg bg-white border border-[#DCE2D9] space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-[#F3E8FF] border border-[#D8B4FE] text-[#6D28D9]">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-[#202720]">
                  Trust & Impact Ledger
                </h2>
                <p className="text-xs text-[#626B63]">
                  Verifiable resolution documentation and disclosed environmental calculation models
                </p>
              </div>
            </div>
            <p className="text-xs text-[#626B63] leading-relaxed max-w-4xl">
              CampusPulse distinguishes resolutions into three verifiable levels: <strong>Status recorded</strong>, <strong>Resolution note recorded</strong>, and <strong>Photo attached</strong>. Environmental metrics clearly distinguish modelled engineering estimates from live physical utility meters.
            </p>
          </div>

          {/* Evidence States Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6D28D9] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Photo attached
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#F3E8FF] text-[#6D28D9] font-medium">
                  {resolvedCount > 0 ? Math.round((evidenceAttachedCount / resolvedCount) * 100) : 0}% of closed
                </span>
              </div>
              <div className="text-2xl font-bold text-[#202720]">{evidenceAttachedCount} tickets</div>
              <p className="text-xs text-[#626B63]">
                Supporting photo attached with resolution entry before marking complete.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#246348] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Note recorded
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#EAF2ED] text-[#246348] font-medium">
                  {resolvedCount > 0 ? Math.round((operatorDocumentedCount / resolvedCount) * 100) : 0}% of closed
                </span>
              </div>
              <div className="text-2xl font-bold text-[#202720]">{operatorDocumentedCount} tickets</div>
              <p className="text-xs text-[#626B63]">
                Operational work note entered describing corrective maintenance.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border border-[#DCE2D9] space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#626B63] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Status recorded only
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#EFEFEA] text-[#626B63] font-medium">
                  {resolvedCount > 0 ? Math.round((statusRecordedCount / resolvedCount) * 100) : 0}% of closed
                </span>
              </div>
              <div className="text-2xl font-bold text-[#202720]">{statusRecordedCount} tickets</div>
              <p className="text-xs text-[#626B63]">
                Ticket marked resolved in queue without supporting work note or photo.
              </p>
            </div>

          </div>

          {/* Environmental Provenance Transparency Section */}
          <div className="p-5 rounded-lg bg-white border border-[#DCE2D9] space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCE2D9] pb-2.5">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#246348]" />
                <h3 className="text-sm font-semibold text-[#202720]">
                  Environmental Data Provenance & Models
                </h3>
              </div>
              <span className="text-xs text-[#626B63]">
                Calculation transparency
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              {/* Power */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#B45309] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Power / Electricity
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] font-medium">
                    Modelled heuristic
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#626B63]">
                    <span>Physical sub-meter:</span>
                    <span className="font-semibold text-[#B45309]">Not measured</span>
                  </div>
                  <div className="flex justify-between text-[#626B63]">
                    <span>Modelled heuristic:</span>
                    <span className="font-semibold text-[#202720]">{ecoMetrics.totalModelledKwhSaved} kWh</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-white border border-[#DCE2D9] text-[11px] text-[#626B63] space-y-0.5">
                  <div>Formula: &Sigma;(kW &times; Avoidable hours)</div>
                  <div>AHU: 4.5 kW &bull; Split AC: 1.8 kW</div>
                </div>
                <p className="text-[11px] text-[#626B63] leading-tight">
                  Derived from reported idle equipment downtime. No live physical sub-meter connected.
                </p>
              </div>

              {/* Water */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0F766E] flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" />
                    Freshwater preserved
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E6F4F2] text-[#0F766E] font-medium">
                    Modelled heuristic
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#626B63]">
                    <span>Inline flow meter:</span>
                    <span className="font-semibold text-[#0F766E]">Not measured</span>
                  </div>
                  <div className="flex justify-between text-[#626B63]">
                    <span>Modelled heuristic:</span>
                    <span className="font-semibold text-[#202720]">{ecoMetrics.totalModelledLitersPreserved.toLocaleString()} L</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-white border border-[#DCE2D9] text-[11px] text-[#626B63] space-y-0.5">
                  <div>Formula: &Sigma;(Flow rate &times; Duration)</div>
                  <div>Rate: 16.6 L/hr @ 2.2 bar pressure</div>
                </div>
                <p className="text-[11px] text-[#626B63] leading-tight">
                  Derived from leak duration estimates. Continuous inline telemetry is absent from hostel risers.
                </p>
              </div>

              {/* Waste */}
              <div className="p-3.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#246348] flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    Compost diverted
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EAF2ED] text-[#246348] font-medium">
                    Modelled heuristic
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#626B63]">
                    <span>Digital scale feed:</span>
                    <span className="font-semibold text-[#246348]">Not measured</span>
                  </div>
                  <div className="flex justify-between text-[#626B63]">
                    <span>Modelled heuristic:</span>
                    <span className="font-semibold text-[#202720]">{ecoMetrics.totalModelledWasteDivertedKg} kg</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-white border border-[#DCE2D9] text-[11px] text-[#626B63] space-y-0.5">
                  <div>Formula: &Sigma;(Hopper volume &times; Density)</div>
                  <div>Density: 0.5 kg/L food scraps</div>
                </div>
                <p className="text-[11px] text-[#626B63] leading-tight">
                  Estimated from volumetric cafeteria bin capacity. No connected digital scale hardware.
                </p>
              </div>

            </div>
          </div>

          {/* Verifiable Resolution Ledger Table */}
          <div className="bg-white rounded-lg border border-[#DCE2D9] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#DCE2D9] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#202720]">
                  Closed Incident Resolution Ledger
                </h3>
                <p className="text-xs text-[#626B63]">Audit log of closed tickets with evidence levels</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#EAF2ED] text-[#246348] font-medium">
                {resolvedList.length} documented {resolvedList.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] text-[#626B63] font-medium border-b border-[#DCE2D9]">
                  <tr>
                    <th className="p-3">Ticket</th>
                    <th className="p-3">Title & Location</th>
                    <th className="p-3">Evidence level</th>
                    <th className="p-3">Work note</th>
                    <th className="p-3">Eco model</th>
                    <th className="p-3 text-right">Photo attachment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE2D9]">
                  {resolvedList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-[#8E988F]">
                        No closed tickets are currently recorded in this browser's local data.
                      </td>
                    </tr>
                  ) : (
                    resolvedList.map((res) => (
                      <tr key={res.id} className="hover:bg-[#F6F6F1] transition-colors">
                        <td className="p-3 font-mono font-semibold text-[#246348] whitespace-nowrap">
                          {res.ticketNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-[#202720]">{res.title}</div>
                          <div className="text-xs text-[#626B63]">{res.location}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                            res.evidenceState === 'EVIDENCE_ATTACHED'
                              ? 'bg-[#F3E8FF] border border-[#D8B4FE] text-[#6D28D9]'
                              : res.evidenceState === 'OPERATOR_DOCUMENTED'
                              ? 'bg-[#EAF2ED] border border-[#DCE2D9] text-[#246348]'
                              : 'bg-[#EFEFEA] border border-[#DCE2D9] text-[#626B63]'
                          }`}>
                            {res.evidenceState === 'EVIDENCE_ATTACHED' ? 'Photo attached' : res.evidenceState === 'OPERATOR_DOCUMENTED' ? 'Note recorded' : 'Status recorded'}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs text-[#626B63] text-xs truncate" title={res.resolutionNotes}>
                          {res.resolutionNotes || <span className="text-[#8E988F] italic">None</span>}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded ${
                            res.ecoImpact?.basis === 'MODELLED'
                              ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                              : 'bg-[#EFEFEA] text-[#626B63]'
                          }`}>
                            {res.ecoImpact?.basis || 'Not measured'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {res.evidenceAttachment ? (
                            <button
                              onClick={() => setInspectEvidenceIssue(res)}
                              className="px-2.5 py-1 rounded bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6D28D9] text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View photo
                            </button>
                          ) : (
                            <span className="text-xs text-[#8E988F] italic">None</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: Record Operator Resolution Modal                */}
      {/* ======================================================== */}
      {resolvingIssue && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resolveModalHeading"
          className="fixed inset-0 z-50 bg-[#202720]/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            ref={modalRef}
            className="bg-white border border-[#DCE2D9] rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >

            <div className="flex items-center justify-between border-b border-[#DCE2D9] pb-3">
              <div className="flex items-center gap-2 text-[#246348]">
                <CheckCircle2 className="w-5 h-5" />
                <h3 id="resolveModalHeading" className="text-base font-semibold text-[#202720]">
                  Record resolution and evidence
                </h3>
              </div>
              <button
                onClick={() => setResolvingIssue(null)}
                aria-label="Close resolution modal"
                className="text-[#8E988F] hover:text-[#202720] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] text-xs space-y-0.5">
              <div className="font-mono text-[#246348] font-semibold">{resolvingIssue.ticketNumber}</div>
              <div className="font-medium text-[#202720]">{resolvingIssue.title}</div>
              <div className="text-[#626B63]">{resolvingIssue.location}</div>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-4">

              {/* Evidence Level Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#202720] mb-2">
                  Select resolution documentation level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceStateChoice('STATUS_RECORDED');
                      setFormValidationError(null);
                    }}
                    className={`p-2.5 rounded-md border text-left text-xs transition-all flex flex-col justify-between gap-1 ${
                      evidenceStateChoice === 'STATUS_RECORDED'
                        ? 'border-[#202720] bg-[#EFEFEA] text-[#202720] font-semibold ring-1 ring-[#202720]'
                        : 'border-[#DCE2D9] bg-white text-[#626B63] hover:bg-[#F6F6F1]'
                    }`}
                  >
                    <span className="flex items-center gap-1 text-xs">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Status only
                    </span>
                    <span className="text-[11px] text-[#626B63] font-normal leading-tight">Mark resolved; no extra note</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceStateChoice('OPERATOR_DOCUMENTED');
                      setFormValidationError(null);
                    }}
                    className={`p-2.5 rounded-md border text-left text-xs transition-all flex flex-col justify-between gap-1 ${
                      evidenceStateChoice === 'OPERATOR_DOCUMENTED'
                        ? 'border-[#246348] bg-[#EAF2ED] text-[#246348] font-semibold ring-1 ring-[#246348]'
                        : 'border-[#DCE2D9] bg-white text-[#626B63] hover:bg-[#F6F6F1]'
                    }`}
                  >
                    <span className="flex items-center gap-1 text-[#246348] text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      Note recorded
                    </span>
                    <span className="text-[11px] text-[#626B63] font-normal leading-tight">Operational work note entered</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceStateChoice('EVIDENCE_ATTACHED');
                      setFormValidationError(null);
                    }}
                    className={`p-2.5 rounded-md border text-left text-xs transition-all flex flex-col justify-between gap-1 ${
                      evidenceStateChoice === 'EVIDENCE_ATTACHED'
                        ? 'border-[#6D28D9] bg-[#F3E8FF] text-[#6D28D9] font-semibold ring-1 ring-[#6D28D9]'
                        : 'border-[#DCE2D9] bg-white text-[#626B63] hover:bg-[#F6F6F1]'
                    }`}
                  >
                    <span className="flex items-center gap-1 text-[#6D28D9] text-xs">
                      <Camera className="w-3.5 h-3.5" />
                      Photo attached
                    </span>
                    <span className="text-[11px] text-[#626B63] font-normal leading-tight">Supporting work photo on file</span>
                  </button>

                </div>
              </div>

              {/* Resolution Note Textarea */}
              <div>
                <label htmlFor="resolveNoteTextarea" className="block text-xs font-semibold text-[#202720] mb-1">
                  Resolution note {evidenceStateChoice !== 'STATUS_RECORDED' ? '(Required, min 10 characters)' : '(Optional)'}
                </label>
                <textarea
                  id="resolveNoteTextarea"
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe corrective maintenance completed, components replaced, or testing conducted..."
                  className="w-full bg-[#EFEFEA] border border-[#DCE2D9] rounded-md p-2.5 text-xs text-[#202720] focus:bg-white focus:outline-none focus:border-[#246348]"
                />
              </div>

              {/* File Attachment Upload */}
              {evidenceStateChoice === 'EVIDENCE_ATTACHED' && (
                <div className="space-y-2 p-3 rounded-md bg-[#FAF9F5] border border-[#DCE2D9]">
                  <label htmlFor="photoUploadInput" className="block text-xs text-[#6D28D9] font-semibold">
                    Supporting work photo (JPEG, PNG, WebP &le; 2MB, optimized client-side)
                  </label>

                  {!attachment ? (
                    <div>
                      <input
                        id="photoUploadInput"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="block w-full text-xs text-[#626B63] file:mr-2.5 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#F3E8FF] file:text-[#6D28D9] hover:file:bg-[#E9D5FF] cursor-pointer"
                      />
                      {attachmentError && (
                        <div className="text-[#B91C1C] text-xs mt-1">{attachmentError}</div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-[#DCE2D9]">
                      <div className="flex items-center gap-2">
                        {attachment.dataUrl && (
                          <img
                            src={attachment.dataUrl}
                            alt="Supporting photo preview"
                            className="w-9 h-9 object-cover rounded border border-[#DCE2D9]"
                          />
                        )}
                        <div>
                          <div className="text-xs font-semibold text-[#202720] truncate max-w-[200px]">
                            {attachment.name}
                          </div>
                          <div className="text-[11px] text-[#626B63]">
                            ~{Math.round(attachment.size / 1024)} KB &bull; Saved locally
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        className="p-1 text-[#8E988F] hover:text-[#B91C1C] rounded"
                        title="Remove attachment"
                        aria-label="Remove uploaded image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Validation Warning */}
              {formValidationError && (
                <div className="p-2.5 rounded-md bg-[#FEE2E2] border border-[#FECACA] text-xs text-[#B91C1C]">
                  {formValidationError}
                </div>
              )}

              {/* Integrity Notice */}
              <div className="p-2.5 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] text-xs text-[#626B63] leading-relaxed">
                <strong>Documentation note:</strong> Attaching a photo records supporting visual documentation on file. It documents operator entry; it does not constitute independent third-party engineering certification or technician identity authentication.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingIssue(null)}
                  className="px-3 py-1.5 rounded-md bg-[#EFEFEA] hover:bg-[#E5E7EB] text-xs font-medium text-[#202720]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#246348] hover:bg-[#1B4D37] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Save resolution
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Department Assignment Modal                     */}
      {/* ======================================================== */}
      {assigningIssue && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="assignModalHeading"
          className="fixed inset-0 z-50 bg-[#202720]/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            ref={modalRef}
            className="bg-white border border-[#DCE2D9] rounded-lg max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#DCE2D9] pb-3">
              <div className="flex items-center gap-2 text-[#6D28D9]">
                <UserCheck className="w-5 h-5" />
                <h3 id="assignModalHeading" className="text-base font-semibold text-[#202720]">
                  Assign maintenance team
                </h3>
              </div>
              <button
                onClick={() => setAssigningIssue(null)}
                aria-label="Close assignment dialog"
                className="text-[#8E988F] hover:text-[#202720] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] text-xs space-y-0.5">
              <div className="font-mono text-[#6D28D9] font-semibold">{assigningIssue.ticketNumber}</div>
              <div className="font-medium text-[#202720]">{assigningIssue.title}</div>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-4">
              <div>
                <label htmlFor="deptAssignSelect" className="block text-xs font-semibold text-[#202720] mb-1.5">
                  Responsible department or wing
                </label>
                <select
                  id="deptAssignSelect"
                  value={assignedWing}
                  onChange={(e) => setAssignedWing(e.target.value)}
                  className="w-full bg-[#EFEFEA] border border-[#DCE2D9] rounded-md p-2.5 text-xs text-[#202720] focus:bg-white focus:outline-none focus:border-[#246348]"
                >
                  <option value="Campus Electrical Wing">Campus Electrical Wing (Power/HVAC)</option>
                  <option value="Campus Plumbing Wing">Campus Plumbing Wing</option>
                  <option value="Campus Waste & Composting Unit">Campus Waste & Composting Unit</option>
                  <option value="Estate Safety & Security">Estate Safety & Security</option>
                  <option value="Audiovisual & Classroom Tech">Audiovisual & Classroom Tech</option>
                  <option value="General Facilities Maintenance">General Facilities Maintenance</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningIssue(null)}
                  className="px-3 py-1.5 rounded-md bg-[#EFEFEA] hover:bg-[#E5E7EB] text-xs font-medium text-[#202720]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold shadow-sm"
                >
                  Confirm assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: Audit Trail Timeline Drawer                     */}
      {/* ======================================================== */}
      {auditDetailIssue && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auditModalHeading"
          className="fixed inset-0 z-50 bg-[#202720]/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            ref={modalRef}
            className="bg-white border border-[#DCE2D9] rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#DCE2D9] pb-3">
              <div className="flex items-center gap-2 text-[#246348]">
                <History className="w-5 h-5" />
                <h3 id="auditModalHeading" className="text-base font-semibold text-[#202720]">
                  Audit history ({auditDetailIssue.ticketNumber})
                </h3>
              </div>
              <button
                onClick={() => setAuditDetailIssue(null)}
                aria-label="Close audit trail dialog"
                className="text-[#8E988F] hover:text-[#202720] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              <div className="p-3 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] text-xs">
                <div className="font-semibold text-[#202720]">{auditDetailIssue.title}</div>
                <div className="text-[#626B63] mt-0.5">{auditDetailIssue.location}</div>
                <div className="text-[#246348] font-medium mt-1">Priority: {auditDetailIssue.priorityScore}/100</div>
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE2D9]">
                {auditDetailIssue.auditHistory.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#246348] ring-2 ring-white"></span>
                    <div className="text-xs font-semibold text-[#202720]">{step.action}</div>
                    <div className="text-[11px] text-[#626B63]">
                      By: <span className="text-[#202720]">{step.actor}</span> &bull; {new Date(step.timestamp).toLocaleString()}
                    </div>
                    {step.note && (
                      <div className="mt-1 p-2 rounded bg-[#FAF9F5] border border-[#DCE2D9] text-xs text-[#202720]">
                        {step.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#DCE2D9] flex justify-end">
              <button
                onClick={() => setAuditDetailIssue(null)}
                className="px-3 py-1.5 rounded-md bg-[#EFEFEA] hover:bg-[#E5E7EB] text-xs font-medium text-[#202720]"
              >
                Close audit trail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: Photographic Evidence Inspection Modal          */}
      {/* ======================================================== */}
      {inspectEvidenceIssue && inspectEvidenceIssue.evidenceAttachment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidencePhotoModalHeading"
          className="fixed inset-0 z-50 bg-[#202720]/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            ref={modalRef}
            className="bg-white border border-[#DCE2D9] rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[85vh] flex flex-col"
          >

            <div className="flex items-center justify-between border-b border-[#DCE2D9] pb-3">
              <div className="flex items-center gap-2 text-[#6D28D9]">
                <Camera className="w-5 h-5" />
                <h3 id="evidencePhotoModalHeading" className="text-base font-semibold text-[#202720]">
                  Attached work photo ({inspectEvidenceIssue.ticketNumber})
                </h3>
              </div>
              <button
                onClick={() => setInspectEvidenceIssue(null)}
                aria-label="Close photo inspection dialog"
                className="text-[#8E988F] hover:text-[#202720] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1">
              {inspectEvidenceIssue.evidenceAttachment.dataUrl ? (
                <div className="rounded-md overflow-hidden border border-[#DCE2D9] bg-[#F6F6F1] flex items-center justify-center p-2">
                  <img
                    src={inspectEvidenceIssue.evidenceAttachment.dataUrl}
                    alt="Supporting photo preview"
                    className="max-h-60 object-contain rounded"
                  />
                </div>
              ) : (
                <div className="p-6 text-center text-[#8E988F] bg-[#F6F6F1] rounded-md border border-[#DCE2D9] text-xs">
                  [Image preview omitted from local storage to conserve quota]
                </div>
              )}

              <div className="p-3 rounded-md bg-[#F6F6F1] border border-[#DCE2D9] text-xs space-y-1">
                <div className="flex justify-between text-[#626B63]">
                  <span>File name:</span>
                  <span className="text-[#202720] font-medium">{inspectEvidenceIssue.evidenceAttachment.name}</span>
                </div>
                <div className="flex justify-between text-[#626B63]">
                  <span>Uploaded:</span>
                  <span className="text-[#202720]">{new Date(inspectEvidenceIssue.evidenceAttachment.uploadedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#626B63]">
                  <span>Stored size:</span>
                  <span className="text-[#202720]">~{Math.round(inspectEvidenceIssue.evidenceAttachment.size / 1024)} KB</span>
                </div>
                {inspectEvidenceIssue.resolutionNotes && (
                  <div className="pt-2 border-t border-[#DCE2D9]">
                    <span className="font-semibold text-[#202720]">Associated work note:</span>
                    <p className="text-[#626B63] italic mt-0.5">"{inspectEvidenceIssue.resolutionNotes}"</p>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-md bg-[#FAF9F5] border border-[#DCE2D9] text-xs text-[#626B63]">
                <strong>Integrity notice:</strong> This photo attachment documents operator work entry. It does not constitute independent third-party engineering certification or technician identity authentication.
              </div>
            </div>

            <div className="pt-2 border-t border-[#DCE2D9] flex justify-end">
              <button
                onClick={() => setInspectEvidenceIssue(null)}
                className="px-4 py-1.5 rounded-md bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold shadow-sm"
              >
                Close photo view
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
