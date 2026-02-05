# Contracts: Transcript Window

**Feature**: 001-transcript-window  
**Date**: 2026-02-05  
**Status**: N/A - No API contracts required

## Overview

This feature is a frontend-only UI enhancement that modifies an existing React component. It does not introduce or modify any API endpoints.

## Relevant Existing Contracts

The TranscriptWindow component consumes data from an existing transcript service. The interface is unchanged by this feature.

### Consumed (Read-Only)

The component receives transcript entries via props from the parent component:

```typescript
// Existing contract - NOT modified
interface TranscriptEntry {
  id: string;
  timestamp: Date;
  speaker: 'caller' | 'operator' | 'system';
  text: string;
  confidence?: number;
  language?: string;
}
```

### Exposed (New)

No new external APIs are exposed by this feature. All changes are internal to the TranscriptWindow component.

## Notes

For component interface contracts (props, state, hooks), see [data-model.md](../data-model.md).
