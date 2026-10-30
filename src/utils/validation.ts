import { CampusIssue, EvidenceAttachment, ResolutionEvidenceState } from '../types';

export interface ValidationResult {
  valid: boolean;
  isValid: boolean;
  error?: string;
}

export interface AttachmentValidationResult {
  valid: boolean;
  isValid: boolean;
  error?: string;
}

export interface ReportValidationResult {
  valid: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates resolution inputs for the Trust & Impact Ledger.
 * Enforces evidence ladder rules:
 * - OPERATOR_DOCUMENTED & EVIDENCE_ATTACHED require >= 10 characters note.
 * - EVIDENCE_ATTACHED requires a valid attachment.
 * - STATUS_RECORDED does not require a note.
 */
export function validateResolutionInput(
  evidenceState: ResolutionEvidenceState,
  notes?: string | null,
  attachment?: EvidenceAttachment | null
): ValidationResult {
  const cleanNotes = (notes || '').trim();

  if (evidenceState === 'OPERATOR_DOCUMENTED' || evidenceState === 'EVIDENCE_ATTACHED') {
    if (!cleanNotes || cleanNotes.length < 10) {
      return {
        valid: false,
        isValid: false,
        error: 'A resolution note of at least 10 characters is required for documented resolutions.'
      };
    }
  }

  if (evidenceState === 'EVIDENCE_ATTACHED' && !attachment) {
    return {
      valid: false,
      isValid: false,
      error: 'Photo Attached selected. Please attach a photo or choose Note Recorded / Status Only.'
    };
  }

  return { valid: true, isValid: true };
}

/**
 * Detects raster photo format from leading byte signature (magic bytes).
 */
export function detectMagicBytesFormat(bytes: Uint8Array | number[]): 'jpeg' | 'png' | 'webp' | 'svg' | 'unknown' {
  if (!bytes || bytes.length < 4) return 'unknown';

  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4E &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0D &&
    bytes[5] === 0x0A &&
    bytes[6] === 0x1A &&
    bytes[7] === 0x0A
  ) {
    return 'png';
  }

  // WebP: RIFF (bytes 0..3) ... WEBP (bytes 8..11)
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'webp';
  }

  // SVG / XML detection in bytes
  const headerStr = String.fromCharCode(...Array.from(bytes.slice(0, 32))).toLowerCase();
  if (headerStr.includes('<svg') || headerStr.includes('<?xml')) {
    return 'svg';
  }

  return 'unknown';
}

/**
 * Validates evidence file attachment size, format, filename extensions, and magic byte signatures.
 * Policy:
 * - Only photo formats: JPEG, PNG, WebP.
 * - Explicitly rejects SVG (active content / vector injection risk).
 * - Maximum size: 2 MB (local storage quota protection).
 * - Minimum size: > 0 bytes (rejects empty/corrupted files).
 * - Extension matching: Rejects misleading or mismatched file extensions.
 * - Byte signature matching: If byte buffer or data URL is provided, validates header magic bytes.
 */
export function validateAttachment(file: {
  type: string;
  size: number;
  name?: string;
  bytes?: Uint8Array | ArrayBuffer | number[];
  dataUrl?: string;
}): AttachmentValidationResult {
  if (!file) {
    return { valid: false, isValid: false, error: 'No file provided.' };
  }

  // Reject empty file
  if (file.size <= 0) {
    return { valid: false, isValid: false, error: 'File is empty. Please select a valid photo file.' };
  }

  // Enforce 2 MB upper bound
  if (file.size > 2 * 1024 * 1024) {
    return { valid: false, isValid: false, error: 'File exceeds 2 MB limit for browser local storage.' };
  }

  const mime = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();

  // Explicit SVG rejection by MIME or extension
  if (mime === 'image/svg+xml' || fileName.endsWith('.svg') || fileName.endsWith('.svgz')) {
    return {
      valid: false,
      isValid: false,
      error: 'SVG files are not supported as photographic evidence. Please upload JPEG, PNG, or WebP photo files.'
    };
  }

  // Valid photo MIME types
  const validPhotoMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validPhotoMimes.includes(mime)) {
    return {
      valid: false,
      isValid: false,
      error: 'Invalid file format. Please upload JPEG, PNG, or WebP photo files only.'
    };
  }

  // Extension validation if name is present
  if (file.name) {
    const lastDot = file.name.lastIndexOf('.');
    if (lastDot === -1) {
      return {
        valid: false,
        isValid: false,
        error: 'File lacks a valid extension. Supported extensions are .jpg, .jpeg, .png, and .webp.'
      };
    }
    const ext = file.name.slice(lastDot).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!validExtensions.includes(ext)) {
      return {
        valid: false,
        isValid: false,
        error: 'Invalid file extension. Please upload a photo with .jpg, .jpeg, .png, or .webp extension.'
      };
    }

    // Check MIME/extension mismatch
    if ((ext === '.jpg' || ext === '.jpeg') && mime !== 'image/jpeg') {
      return { valid: false, isValid: false, error: 'File extension does not match MIME type.' };
    }
    if (ext === '.png' && mime !== 'image/png') {
      return { valid: false, isValid: false, error: 'File extension does not match MIME type.' };
    }
    if (ext === '.webp' && mime !== 'image/webp') {
      return { valid: false, isValid: false, error: 'File extension does not match MIME type.' };
    }
  }

  // Byte signature / magic bytes validation
  let rawBytes: Uint8Array | null = null;
  if (file.bytes) {
    if (file.bytes instanceof Uint8Array) {
      rawBytes = file.bytes;
    } else if (file.bytes instanceof ArrayBuffer) {
      rawBytes = new Uint8Array(file.bytes);
    } else if (Array.isArray(file.bytes)) {
      rawBytes = new Uint8Array(file.bytes);
    }
  } else if (file.dataUrl && file.dataUrl.startsWith('data:')) {
    const commaIndex = file.dataUrl.indexOf(',');
    if (commaIndex !== -1) {
      try {
        const base64Prefix = file.dataUrl.substring(commaIndex + 1, commaIndex + 64);
        if (typeof atob === 'function') {
          const binaryStr = atob(base64Prefix);
          rawBytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            rawBytes[i] = binaryStr.charCodeAt(i);
          }
        }
      } catch (_) {}
    }
  }

  if (rawBytes && rawBytes.length >= 4) {
    const detected = detectMagicBytesFormat(rawBytes);
    if (detected === 'svg') {
      return {
        valid: false,
        isValid: false,
        error: 'SVG files are not supported as photographic evidence. Please upload JPEG, PNG, or WebP photo files.'
      };
    }
    if (mime === 'image/jpeg' && detected !== 'jpeg') {
      return {
        valid: false,
        isValid: false,
        error: 'File contents do not match JPEG signature (magic bytes mismatch).'
      };
    }
    if (mime === 'image/png' && detected !== 'png') {
      return {
        valid: false,
        isValid: false,
        error: 'File contents do not match PNG signature (magic bytes mismatch).'
      };
    }
    if (mime === 'image/webp' && detected !== 'webp') {
      return {
        valid: false,
        isValid: false,
        error: 'File contents do not match WebP signature (magic bytes mismatch).'
      };
    }
  }

  return { valid: true, isValid: true };
}

/**
 * Validates report submission intake form.
 */
export function validateReportSubmission(data: {
  title?: string;
  category?: string;
  zone?: string;
  location?: string;
  description?: string;
}): ReportValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim() || data.title.trim().length < 5) {
    errors.title = 'Please enter a title of at least 5 characters.';
  }
  if (!data.location || !data.location.trim() || data.location.trim().length < 3) {
    errors.location = 'Please specify a specific room or building location.';
  }
  if (!data.description || !data.description.trim() || data.description.trim().length < 10) {
    errors.description = 'Please provide a clear description (at least 10 characters).';
  }
  if (data.category !== undefined && !data.category) {
    errors.category = 'Please select an issue category.';
  }
  if (data.zone !== undefined && !data.zone) {
    errors.zone = 'Please select a campus zone.';
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    valid: isValid,
    isValid,
    errors
  };
}

/**
 * Strips private identifiers, internal notes, and sensitive metadata for public signage display.
 * Creates an immutable allowlisted projection of public operational fields.
 */
export function sanitizeForPublicSignage(issue: CampusIssue | null | undefined) {
  if (!issue || typeof issue !== 'object') return null;
  return {
    id: String(issue.id || ''),
    ticketNumber: String(issue.ticketNumber || ''),
    title: String(issue.title || ''),
    category: issue.category,
    location: String(issue.location || ''),
    zone: issue.zone,
    status: issue.status,
    evidenceState: issue.evidenceState,
    priorityScore: typeof issue.priorityScore === 'number' ? issue.priorityScore : 0,
    priorityTier: issue.priorityTier,
    reportedAt: issue.reportedAt,
  };
}

/**
 * Pure transition logic for resolving an issue with evidence ladder states.
 */
export function resolveIssue(
  issue: CampusIssue,
  options: {
    notes?: string;
    attachment?: EvidenceAttachment | null;
    explicitState?: ResolutionEvidenceState;
  } = {}
): CampusIssue {
  const { notes, attachment, explicitState } = options;
  let finalState: ResolutionEvidenceState = 'STATUS_RECORDED';

  if (explicitState) {
    finalState = explicitState;
  } else if (attachment) {
    finalState = 'EVIDENCE_ATTACHED';
  } else if (notes && notes.trim().length >= 10) {
    finalState = 'OPERATOR_DOCUMENTED';
  }

  return {
    ...issue,
    status: 'RESOLVED',
    resolutionNotes: notes,
    evidenceState: finalState,
    evidenceAttachment: attachment || undefined
  };
}
