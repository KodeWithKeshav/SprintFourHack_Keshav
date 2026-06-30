import { useReducer, useMemo, useCallback } from 'react';

const SEVERITY_WEIGHTS = {
  ssn: 10,
  phone: 9,
  name: 8,
  email: 7,
  date: 2,
  identifier: 1,
  organization: 1,
};

const HIGH_RISK_THRESHOLD = 4.0;

function calculateRiskScore(redaction) {
  const weight = SEVERITY_WEIGHTS[redaction.type] || 1;
  return (1 - redaction.confidence) * weight;
}

function isHighRisk(redaction) {
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
      };
      return {
        ...state,
        decisions: { ...state.decisions, [redaction.id]: 'approved' },
        decisionLog: [entry, ...state.decisionLog],
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
      };

      return {
        ...state,
        decisions: newDecisions,
        decisionLog: [undoEntry, ...state.decisionLog],
      };
    }

    case 'RESET':
      return INITIAL_STATE;

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

  const pendingItems = useMemo(
    () => enrichedRedactions.filter((r) => r.status === 'pending'),
    [enrichedRedactions]
  );

  const highRiskPending = useMemo(
    () => pendingItems.filter((r) => r.highRisk),
    [pendingItems]
  );

  const totalPending = pendingItems.length;
  const highRiskCount = highRiskPending.length;
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
  };
}

export { HIGH_RISK_THRESHOLD, calculateRiskScore, isHighRisk };
