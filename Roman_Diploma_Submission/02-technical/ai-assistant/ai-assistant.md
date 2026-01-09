# AI Assistant / Chatbot

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-10-15

### Context

The application requires an AI-powered assistant to help QA engineers and developers create test specifications, organize test structure, and manage requirements through natural language interaction. The AI assistant should provide value beyond simple API proxying and demonstrate understanding of prompt engineering.

### Decision

Using Vercel AI SDK for LLM integration with multiple model support (OpenRouter, Gemini), context-aware prompting, and streaming responses.

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Assistant purpose & audience documented | ✅ | Specification assistant for QA/developers |
| 2 | Architecture with model selection | ✅ | AI SDK with multiple providers |
| 3 | System prompt documentation | ✅ | Context-aware prompts |
| 4 | Prompt templates for scenarios | ✅ | Natural language → specification structure |
| 5 | API documentation | ✅ | oRPC endpoints documented |
| 6 | System limitations documented | ✅ | Section below |
| 7 | User instructions | ✅ | UI guidance provided |
| 8 | Modern LLM API usage | ✅ | OpenRouter, Gemini APIs |
| 9 | Multi-layer architecture | ✅ | UI → API → AI SDK → LLM |
| 10 | Prompt engineering | ✅ | Context-aware prompts |
| 11 | Edge case handling | ✅ | Input validation, error handling |
| 12 | Intuitive chat interface | ✅ | AI panel in dashboard |
| 13 | Status indicators | ✅ | Loading states, errors |
| 14 | Text request handling | ✅ | Natural language to code |
| 15 | Input validation | ✅ | Length limits, format checks |
| 16 | API error handling | ✅ | Timeouts, rate limits handled |
| 17 | Logging | ✅ | Request/response logging |
| 18 | API keys in environment | ✅ | `OPENROUTER_API_KEY`, `GEMINI_API_KEY` |
| 19 | Rate limiting | ✅ | Request throttling implemented |
| 20 | Response time <10s | ✅ | Streaming for fast feedback |
| 21 | Session history | ✅ | Context maintained in session |

## Architecture

### Component Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React UI      │────>│   oRPC API      │────>│   AI SDK        │
│   (AI Panel)    │     │   (ai.generate) │     │   (Provider)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   LLM Provider  │
                                               │ OpenRouter/Gemini│
                                               └─────────────────┘
```

### Provider Configuration

| Provider | API Key Env Var | Use Case |
|----------|-----------------|----------|
| OpenRouter | `OPENROUTER_API_KEY` | Primary test generation |
| Gemini | `GEMINI_API_KEY` | Fallback/alternative |

## Prompt Engineering

### System Prompt Structure

The AI assistant uses structured prompts optimized for specification creation and organization:

1. **Role Definition**: Expert test specification assistant
2. **Context Injection**: Requirement text, spec structure, folder hierarchy
3. **Output Format**: Structured specification suggestions
4. **Constraints**: Follow project conventions, maintain consistency

### Prompt Templates

| Scenario | Template |
|----------|----------|
| New test from requirement | Requirement + spec context → test code |
| Test improvement | Existing test + feedback → improved code |
| Coverage expansion | Requirement + coverage gaps → additional tests |

## Implementation Details

### AI Integration Files

```
app/
└── ai/
    └── page.tsx           # AI panel UI

orpc/
└── ai.ts                  # AI generation procedures

lib/
└── ...                    # AI utilities
```

### Key Features

1. **Context-Aware Generation**
   - Includes folder/spec/requirement context
   - References existing tests in spec
   - Follows project test conventions

2. **Streaming Responses**
   - Real-time response display
   - Reduced perceived latency
   - Progress indication

3. **Quality Suggestions**
   - Suggestions follow best practices
   - Organized structure recommendations
   - Consistent naming patterns

4. **Error Handling**
   - API timeout handling
   - Rate limit response
   - Graceful degradation

## System Limitations

| Limitation | Description |
|------------|-------------|
| Vitest only | Currently generates Vitest tests only |
| No execution | Does not run generated tests |
| Context window | Limited by LLM token limits |
| Quality variance | AI output quality may vary |
| API dependency | Requires external LLM API access |

## Usage Guidelines

### For Users

1. Provide clear, specific requirements
2. Review generated code before accepting
3. Edit as needed for edge cases
4. Verify test assertions match expectations

### For Developers

1. API keys stored in environment variables only
2. Rate limiting prevents abuse
3. Logging captures generation metrics
4. Error boundaries handle failures gracefully

## Metrics & Monitoring

| Metric | Description |
|--------|-------------|
| Generation time | Time from request to complete response |
| Token usage | Tokens consumed per generation |
| Success rate | Percentage of successful generations |
| User acceptance | Rate of accepted vs rejected code |

## Security Measures

| Measure | Implementation |
|---------|----------------|
| API key protection | Environment variables only |
| Input sanitization | Zod validation |
| Output validation | Code structure verification |
| Rate limiting | Per-user request limits |
| Logging | No sensitive data in logs |

## References

- [Requirements Document](../../../older_docs/Требования%20по%20ИИ-ассистент%20-%20Chatbot%20(Рома).md)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [AI Implementation](../../../app/ai/)
- [oRPC Procedures](../../../orpc/)
