# Phase 03: Consolidate Chatbot Implementations

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: A (can run with Phases 01, 02, 04, 08)
**Depends On**: None
**Blocks**: Phase 05 (shared named exports)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | HIGH |
| Status | PENDING |
| Estimated Effort | 3-4 hours |
| Files Modified | 3+ |

**Description**: Consolidate chatbot-v2.tsx (374 lines) and chatbot-v3.tsx (530 lines) into single maintainable implementation.

---

## Key Insights (From Research)

- Two chatbot versions exist: v2 and v3 (904 total lines)
- Likely evolutionary development without cleanup
- Should consolidate to single implementation with feature flags if needed
- Extract hooks for state management following React 19 patterns

---

## Requirements

1. Analyze differences between v2 and v3
2. Create single `Chatbot` component with all required features
3. Remove deprecated version (likely v2)
4. Extract reusable hooks for chat logic
5. Keep total lines <300

---

## Architecture

### Current Structure

```
src/components/shared/chatbot_v2/
├── chatbot-v2.tsx     # 374 lines (older?)
└── chatbot-v3.tsx     # 530 lines (newer?)
```

### Target Structure

```
src/components/shared/chatbot/
├── index.ts                    # Barrel export
├── chatbot.tsx                 # Main component (~150 lines)
├── chatbot-header.tsx          # Header with close button
├── chatbot-messages.tsx        # Message list display
├── chatbot-input.tsx           # Input area with send button
├── chatbot-message-item.tsx    # Single message bubble
├── chatbot-typing-indicator.tsx
├── hooks/
│   ├── use-chat-session.ts     # Session management
│   ├── use-chat-messages.ts    # Message state/API
│   └── index.ts
└── types.ts                    # Shared types
```

---

## File Ownership (Exclusive to Phase 03)

| File | Action |
|------|--------|
| `src/components/shared/chatbot_v2/chatbot-v2.tsx` | DELETE (after consolidation) |
| `src/components/shared/chatbot_v2/chatbot-v3.tsx` | REFACTOR -> chatbot/ |
| `src/components/shared/chatbot_v2/` | RENAME -> chatbot/ |
| `src/components/shared/chatbot/` | CREATE (new structure) |

**No other phase modifies these files.**

---

## Implementation Steps

### Step 1: Analyze Both Versions

1. Read chatbot-v2.tsx - identify features and patterns
2. Read chatbot-v3.tsx - identify features and patterns
3. Create feature comparison matrix:
   - Message display
   - Typing indicators
   - Session management
   - API integration
   - UI differences

### Step 2: Identify Which Version is Active

```bash
grep -r "chatbot-v2" src/
grep -r "chatbot-v3" src/
grep -r "ChatbotV2" src/
grep -r "ChatbotV3" src/
```

### Step 3: Design Consolidated Architecture

1. Take best features from both versions
2. Design component hierarchy
3. Design hook interfaces

### Step 4: Create New Chatbot Folder

```bash
mkdir -p src/components/shared/chatbot/hooks
```

### Step 5: Extract Hooks

```typescript
// use-chat-session.ts
export function useChatSession() {
  // Session creation/management logic
}

// use-chat-messages.ts
export function useChatMessages(sessionId: string) {
  // Message fetching, sending, streaming
}
```

### Step 6: Create UI Components

1. `ChatbotHeader` - title, minimize/close buttons
2. `ChatbotMessages` - scrollable message list
3. `ChatbotMessageItem` - single message with user/bot styling
4. `ChatbotTypingIndicator` - animated dots
5. `ChatbotInput` - text input with send button

### Step 7: Create Main Chatbot Component

```typescript
// chatbot.tsx
export function Chatbot() {
  const { sessionId, createSession } = useChatSession();
  const { messages, sendMessage, isLoading } = useChatMessages(sessionId);

  return (
    <div className="chatbot-container">
      <ChatbotHeader />
      <ChatbotMessages messages={messages} />
      {isLoading && <ChatbotTypingIndicator />}
      <ChatbotInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

### Step 8: Update All Imports

1. Find all usages of old chatbot components
2. Update imports to new consolidated version
3. Adjust any props if interface changed

### Step 9: Remove Old Files

1. Delete chatbot-v2.tsx
2. Delete chatbot-v3.tsx (if fully migrated)
3. Remove chatbot_v2 folder

### Step 10: Verify

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

- [ ] Read and analyze chatbot-v2.tsx
- [ ] Read and analyze chatbot-v3.tsx
- [ ] Create feature comparison document
- [ ] Determine which version(s) are actively used
- [ ] Create chatbot/ folder structure
- [ ] Extract useChatSession hook
- [ ] Extract useChatMessages hook
- [ ] Create ChatbotHeader component
- [ ] Create ChatbotMessages component
- [ ] Create ChatbotMessageItem component
- [ ] Create ChatbotTypingIndicator component
- [ ] Create ChatbotInput component
- [ ] Create main Chatbot component
- [ ] Create barrel export index.ts
- [ ] Update all imports across codebase
- [ ] Delete old chatbot files
- [ ] Remove chatbot_v2 folder
- [ ] Run lint, build, and tests
- [ ] Manual testing of chatbot functionality

---

## Success Criteria

1. Single chatbot implementation
2. No file >150 lines
3. All chatbot features preserved
4. `npm run build` passes
5. Chatbot works in all locations

---

## Conflict Prevention

- **Exclusive files**: Only Phase 03 touches chatbot_v2/ folder
- **Clear boundary**: chatbot is isolated from other shared components
- **No overlap**: Phase 05 will handle other shared components

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing v2-specific feature | MEDIUM | MEDIUM | Thorough feature comparison |
| Breaking chat session continuity | LOW | HIGH | Test session persistence |
| API contract change | LOW | HIGH | Keep same API interface |

---

## Security Considerations

- Maintain XSS prevention for user message display
- Keep session token handling secure
- Preserve rate limiting logic if present

---

## Next Steps

After completion, Phase 05 will convert the consolidated chatbot to named exports if needed. Phase 10 will add tests.
