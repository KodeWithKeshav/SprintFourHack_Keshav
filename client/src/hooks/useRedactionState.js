import { useReducer, useMemo, useCallback } from 'react';

const SEVERITY_WEIGHTS = {
  high: 1.0,
  medium: 0.6,
  low: 0.3,
};

const HIGH_RISK_THRESHOLD = 0.5;

function calculateRiskScore(redaction) {
  const weight = SEVERITY_WEIGHTS[redaction.severity?.toLowerCase()] || 0.5;
  return (1 - redaction.confidence) * weight;
}

function isHighRisk(redaction) {
  if (redaction.source === 'missed') return true;
  if (redaction.groundTruth === 'falsePositive') return false;
  if (redaction.severity?.toLowerCase() === 'high') return true;
  return calculateRiskScore(redaction) >= HIGH_RISK_THRESHOLD;
}

const INITIAL_STATE = {
  decisions: {},
  decisionLog: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'DISMISS_FALSE_POSITIVE': {
      const { redaction } = action.payload;
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        redactionId: redaction.id,
        action: 'dismissed',
        text: redaction.text,
        piiType: redaction.type,
        confidence: redaction.confidence,
        timestamp: Date.now(),
        actor: 'User'
      };
      return {
        ...state,
        decisions: { ...state.decisions, [redaction.id]: 'dismissed' },
        decisionLog: [entry, ...state.decisionLog],
      };
    }

    case 'CONFIRM_REDACT': {
      const { redaction } = action.payload;
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        redactionId: redaction.id,
        action: 'redacted',
        text: redaction.text,
        piiType: redaction.type,
        confidence: redaction.confidence,
        timestamp: Date.now(),
        actor: 'User'
      };
      return {
        ...state,
        decisions: { ...state.decisions, [redaction.id]: 'redacted' },
        decisionLog: [entry, ...state.decisionLog],
      };
    }

    case 'CONFIRM_SAFE': {
      const { redaction } = action.payload;
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        redactionId: redaction.id,
        action: 'confirmed_safe',
        text: redaction.text,
        piiType: redaction.type,
        confidence: redaction.confidence,
        timestamp: Date.now(),
        actor: 'User'
      };
      return {
        ...state,
        decisions: { ...state.decisions, [redaction.id]: 'confirmed_safe' },
        decisionLog: [entry, ...state.decisionLog],
      };
    }

    case 'APPROVE_REDACTION': {
      const { redaction } = action.payload;
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        redactionId: redaction.id,
        action: 'approved',
        text: redaction.text,
        piiType: redaction.type,
        confidence: redaction.confidence,
        timestamp: Date.now(),
        actor: 'User'
      };
      return {
        ...state,
        decisions: { ...state.decisions, [redaction.id]: 'approved' },
        decisionLog: [entry, ...state.decisionLog],
      };
    }

    case 'SKIP_ITEM': {
      const { redaction } = action.payload;
      return {
        ...state,
        decisions: { ...state.decisions, [redaction.id]: 'skipped' },
      };
    }

    case 'UNDO': {
      const { logEntryId } = action.payload;
      const entry = state.decisionLog.find((e) => e.id === logEntryId);
      if (!entry) return state;

      const newDecisions = { ...state.decisions };
      delete newDecisions[entry.redactionId];

      const undoEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        redactionId: entry.redactionId,
        action: 'undone',
        text: entry.text,
        piiType: entry.piiType,
        confidence: entry.confidence,
        timestamp: Date.now(),
        undid: entry.action,
        actor: 'User'
      };

      return {
        ...state,
        decisions: newDecisions,
        decisionLog: [undoEntry, ...state.decisionLog],
      };
    }

    case 'RESET':
      return INITIAL_STATE;

    case 'INITIALIZE_DOCUMENT': {
      const { redactions } = action.payload;
      const newDecisions = { ...state.decisions };
      const newLogs = [];

      redactions.forEach((r) => {
        if (r.source === 'verified') {
          if (r.groundTruth === 'correct') {
            newDecisions[r.id] = 'auto-redacted';
            newLogs.push({
              id: Date.now().toString(36) + Math.random().toString(36).substring(2) + r.id,
              redactionId: r.id,
              action: 'auto-redacted',
              text: r.text,
              piiType: r.type,
              confidence: r.confidence,
              timestamp: Date.now(),
              actor: 'System (Auto)'
            });
          } else if (r.groundTruth === 'falsePositive') {
            newDecisions[r.id] = 'auto-safe';
            newLogs.push({
              id: Date.now().toString(36) + Math.random().toString(36).substring(2) + r.id,
              redactionId: r.id,
              action: 'auto-safe',
              text: r.text,
              piiType: r.type,
              confidence: r.confidence,
              timestamp: Date.now(),
              actor: 'System (Auto)'
            });
          }
        }
      });

      if (newLogs.length === 0) return state;

      return {
        ...state,
        decisions: { ...state.decisions, ...newDecisions },
        decisionLog: [...newLogs, ...state.decisionLog],
      };
    }

    default:
      return state;
  }
}

export function useRedactionState(redactions) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const enrichedRedactions = useMemo(() => {
    if (!redactions) return [];
    return redactions
      .map((r) => ({
        ...r,
        riskScore: calculateRiskScore(r),
        highRisk: isHighRisk(r),
        status: state.decisions[r.id] || 'pending',
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [redactions, state.decisions]);

  const unresolvedItems = useMemo(
    () => enrichedRedactions.filter((r) => r.status === 'pending' || r.status === 'skipped'),
    [enrichedRedactions]
  );

  const pendingItems = useMemo(
    () => enrichedRedactions.filter((r) => r.status === 'pending'),
    [enrichedRedactions]
  );

  const highRiskPending = useMemo(
    () => pendingItems.filter((r) => r.highRisk),
    [pendingItems]
  );

  // Exposure meter counts ALL unresolved items, even if skipped
  const totalPending = unresolvedItems.length;
  const highRiskCount = unresolvedItems.filter((r) => r.highRisk).length;
  
  const totalItems = enrichedRedactions.length;
  const resolvedCount = totalItems - totalPending;
  const allClear = highRiskCount === 0 && totalPending === 0;

  const dismissFalsePositive = useCallback(
    (redaction) => dispatch({ type: 'DISMISS_FALSE_POSITIVE', payload: { redaction } }),
    []
  );

  const confirmRedact = useCallback(
    (redaction) => dispatch({ type: 'CONFIRM_REDACT', payload: { redaction } }),
    []
  );

  const confirmSafe = useCallback(
    (redaction) => dispatch({ type: 'CONFIRM_SAFE', payload: { redaction } }),
    []
  );

  const approveRedaction = useCallback(
    (redaction) => dispatch({ type: 'APPROVE_REDACTION', payload: { redaction } }),
    []
  );

  const undo = useCallback(
    (logEntryId) => dispatch({ type: 'UNDO', payload: { logEntryId } }),
    []
  );

  const reset = useCallback(
    () => dispatch({ type: 'RESET' }),
    []
  );

  const skipItem = useCallback(
    (redaction) => dispatch({ type: 'SKIP_ITEM', payload: { redaction } }),
    []
  );

  const initializeDocument = useCallback(
    (redactions) => dispatch({ type: 'INITIALIZE_DOCUMENT', payload: { redactions } }),
    []
  );

  return {
    enrichedRedactions,
    pendingItems,
    highRiskPending,
    totalPending,
    highRiskCount,
    totalItems,
    allClear,
    decisionLog: state.decisionLog,
    decisions: state.decisions,
    dismissFalsePositive,
    confirmRedact,
    confirmSafe,
    approveRedaction,
    undo,
    reset,
    skipItem,
    initializeDocument,
  };
}

export { HIGH_RISK_THRESHOLD, calculateRiskScore, isHighRisk };
