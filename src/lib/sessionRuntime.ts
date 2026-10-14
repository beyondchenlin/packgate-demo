/**
 * PackGate demo session runtime — aligned with VerticalCraft/agent-web
 * SessionDaemon semantics (not a second executor):
 *
 * Core chain (agent-web NORTH-STAR / ASSISTANT-UI PRD):
 *   Machine → Project → Workspace → Session
 *   Browser is control surface; Session owns prompt / queue / tools / persist.
 *
 * Prompt rules:
 *   idle  → prompt (creates session on first send)
 *   running → steer | followUp (queued; not written into confirmed history yet)
 *   Stop in chat → abort current run (NOT /stop which kills the instance)
 *
 * Tools:
 *   stable toolCallId; phases running → update → end | error | aborted
 *   Pack/Skill calls render as tool cards, not fake assistant text alone.
 *
 * Host UI (Pi Web kinds):
 *   confirm | select | input — demo uses confirm before destructive Pack runs.
 */

export type SessionPhase =
  | 'idle' // no session yet (first-send)
  | 'creating' // first prompt creating session
  | 'running'
  | 'aborting'

export type QueueKind = 'steer' | 'followUp'

export type ToolPhase = 'running' | 'update' | 'end' | 'error' | 'aborted'

export type HostUiKind = 'confirm' | 'select' | 'input'

export type ChatMessage =
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'assistant'; text: string; partial?: boolean }
  | {
      id: string
      kind: 'tool'
      toolCallId: string
      name: string
      cmd?: string
      phase: ToolPhase
      detail: string
    }

export type QueueItem = {
  id: string
  kind: QueueKind
  text: string
}

export type HostUiRequest = {
  id: string
  kind: HostUiKind
  title: string
  message: string
  /** Resolve with true=allow / false=reject */
  resolve: (ok: boolean) => void
}

export type SessionSnapshot = {
  /** null until first successful create (agent-web first-send) */
  sessionId: string | null
  /** Bound model for this session after first send */
  model: string
  phase: SessionPhase
  messages: ChatMessage[]
  /** Separate queues — agent-web clearQueue returns { steering, followUp } */
  queue: QueueItem[]
  hostUi: HostUiRequest | null
  /** Demo target identity (product layer; agent-web stores workspace identity) */
  target: {
    machineId: string
    projectId: string
    workspaceId: string
  }
}

export function newSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function newToolCallId(): string {
  return `tool_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

export function initialSnapshot(model: string): SessionSnapshot {
  return {
    sessionId: null,
    model,
    phase: 'idle',
    messages: [],
    queue: [],
    hostUi: null,
    target: {
      machineId: 'local',
      projectId: 'packgate-demo',
      workspaceId: 'default',
    },
  }
}

/** Classify send while running: demo always followUp (steer reserved for interrupt text) */
export function queueKindForBusySend(): QueueKind {
  return 'followUp'
}
