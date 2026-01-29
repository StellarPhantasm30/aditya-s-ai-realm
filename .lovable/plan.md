

# Featured Projects Enhancement Plan

Enhance the Projects section with flexible button configurations and clear project type indicators to differentiate between personal projects and client/professional work.

---

## The Problem

Currently, all project cards show the same "Code" and "Demo" buttons, but:
- Client/professional projects cannot share source code or live demos due to confidentiality
- Visitors may wonder why some projects lack these links
- No way to showcase project documentation as an alternative

---

## Solution Overview

Create a data-driven project card system with:
1. **Project Type Indicator** - Visual badge showing "Personal Project" vs "Client Work"
2. **Configurable Action Buttons** - Each project specifies which buttons to show (Code, Demo, Documentation)
3. **Professional Messaging** - Subtle explanation that builds credibility rather than raising questions

---

## Visual Design

### Project Type Badge

Position: Top-right corner of the gradient thumbnail area

| Type | Badge Style | Icon |
|------|-------------|------|
| Personal Project | Blue/Cyan gradient, "Personal" text | Sparkles or User icon |
| Client Work | Purple/Gold gradient, "Enterprise" text | Building or Briefcase icon |

Using "Enterprise" instead of "Client Work" sounds more professional and prestigious.

### Action Buttons

Three possible buttons (all optional per project):

| Button | Icon | Purpose | Style |
|--------|------|---------|-------|
| Code | Github | Link to repository | Outline variant |
| Demo | ExternalLink | Link to live demo | Gradient primary |
| Docs | FileText | Link to case study/documentation | Outline variant |

Buttons will always be visible (removing the hover-to-reveal behavior for clarity).

---

## Data Structure

Each project will have:

```typescript
interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  type: "personal" | "enterprise";  // Project category
  links: {
    code?: string;      // GitHub URL (optional)
    demo?: string;      // Live demo URL (optional)
    docs?: string;      // Documentation/case study URL (optional)
  };
}
```

### Example Configurations

**Validate.AI (Enterprise):**
```typescript
{
  type: "enterprise",
  links: { docs: "/docs/validate-ai" }
}
// Shows: Documentation button only + "Enterprise" badge
```

**Agentic RAG System (Personal):**
```typescript
{
  type: "personal",
  links: { 
    code: "https://github.com/...",
    demo: "https://demo.example.com",
    docs: "/docs/agentic-rag"
  }
}
// Shows: All 3 buttons + "Personal" badge
```

---

## Updated Project Data

| Project | Type | Buttons |
|---------|------|---------|
| Validate.AI | Enterprise | Docs only |
| Agentic RAG System | Personal | Code, Demo, Docs |
| GenAI Chatbot | Enterprise | Docs only |
| AIOps Agents | Enterprise | Docs only |
| Azure LLM Deployment | Personal | Code, Demo, Docs |
| Full-stack GenAI App | Personal | Code, Demo, Docs |

You can adjust these classifications and button configurations as needed.

---

## Component Changes

### Card Layout Updates

1. **Badge Overlay** - Add a positioned badge on the thumbnail
2. **Dynamic Buttons** - Render only the buttons that have URLs
3. **Button Row** - Always visible (not hidden behind hover state)
4. **Flexible Layout** - Button container adapts to 1, 2, or 3 buttons

### Visual Refinements

- Enterprise badge: Subtle gold/purple tint with briefcase icon
- Personal badge: Blue/cyan tint with code icon
- Buttons use consistent sizing and grow to fill available space
- If only one button, it spans the full width

---

## Implementation Summary

| File | Changes |
|------|---------|
| `src/components/Projects.tsx` | Update data structure, add type badges, conditional button rendering |

---

## Technical Notes

- No backend needed - all configuration is in the component's data array
- Easy to update by modifying the `projects` array
- Links can point to external URLs or internal routes (for future documentation pages)
- Empty/undefined links result in button not being rendered

