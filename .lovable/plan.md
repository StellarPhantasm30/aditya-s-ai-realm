
# Technical Skills Section Redesign

Complete overhaul of the Skills visualization to create a static, always-visible graph-based skill map with a futuristic neural network aesthetic.

---

## Current State

The current implementation uses:
- Hover-based popups to reveal tools/technologies
- Abstract node positions without clear hierarchy
- Generic Lucide icons for categories
- Dynamic hover states that hide information

---

## New Design: Static Hierarchical Skill Graph

### Visual Concept

Each skill category becomes a **hub node** (large, prominent) with **tool nodes** (smaller, with actual logos) branching out visibly at all times.

```text
Layout per Hub (example: Cloud & DevOps):

                    [Docker Compose]
                         /
            [Docker]----/
                 \
                  \____[Cloud & DevOps]____[AWS]
                       (HUB - large)    \
                      /    |             \
              [Azure]     [K8s]        [GCP]
                           |
                      [Terraform]
```

---

## Technical Implementation

### 1. Data Structure

```typescript
interface ToolNode {
  name: string;
  icon: IconType; // from react-icons
  color: string;  // brand color for glow
  position: { x: number; y: number }; // absolute position
}

interface HubNode {
  name: string;
  icon: IconType;
  color: string;
  position: { x: number; y: number };
  tools: ToolNode[];
}
```

### 2. Hub Categories with Tools

| Hub | Tools |
|-----|-------|
| Programming & Databases | Java, Python, MySQL, FAISS, Chroma, Pinecone |
| Backend & APIs | FastAPI, Flask, REST, MCP, Streamlit, Docker |
| Cloud & DevOps | AWS, Azure, Kafka, Redis, Git, Serverless, LiteLLM |
| Generative AI & ML | LangChain, LangGraph, CrewAI, TensorFlow, PEFT, QLoRA, Bedrock, OpenAI |
| LLMOps / MLOps | MLflow, DVC, Weights & Biases, Langfuse, LangSmith |
| Architecture & Practices | Microservices, System Design, Agile/SCRUM, DSA |

### 3. Visual Design Specifications

**Hub Nodes (Primary):**
- Size: 80-90px diameter
- Glassmorphism background with backdrop blur
- Colored gradient border ring
- Category icon inside (Lucide icons)
- Category label below
- Subtle pulse glow animation (optional)

**Tool Nodes (Secondary):**
- Size: 50-60px diameter
- Glassmorphism background
- Brand-appropriate color border/glow
- Tool logo/icon inside (react-icons)
- Tool name label below
- Always visible, no hover required

**Connection Lines:**
- SVG-based lines connecting hub to each tool
- Thin glowing lines (1-2px stroke)
- Gradient from blue to purple
- Lines originate from hub center to tool center

### 4. Layout Strategy

The component will be divided into 6 distinct hub clusters, each independently positioned. Layout uses absolute positioning within a large container:

```text
Container (1400px x 1200px relative)

[Hub 1: Programming]     [Hub 2: Backend]      [Hub 3: Cloud]
   with tools              with tools            with tools
   branching               branching             branching

        [Hub 4: GenAI - CENTRAL, LARGEST]
              with tools branching

[Hub 5: LLMOps]                            [Hub 6: Architecture]
   with tools                                 with tools
```

Each hub is a self-contained cluster with manually positioned tool nodes around it.

### 5. Component Architecture

```text
<Skills>
  ├── Section Header ("Technical Skills")
  │
  ├── Desktop View (lg:block)
  │   └── <SkillGraph>
  │       ├── <svg> (all connection lines)
  │       │   └── <defs> (gradients, filters)
  │       │   └── <line> elements for each hub-to-tool connection
  │       │
  │       └── <HubCluster> x 6
  │           ├── <HubNode> (large, centered)
  │           └── <ToolNode> x N (positioned around hub)
  │
  └── Mobile View (lg:hidden)
      └── Card grid (existing implementation - kept as is)
```

### 6. Styling Details

**Background:**
- Dark navy base (`bg-background`)
- Soft radial gradient overlays at hub positions
- Subtle grid pattern or dots (optional)

**Glassmorphism Nodes:**
```css
.skill-node {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(color, 0.3);
}
```

**Connection Lines:**
```css
.connection-line {
  stroke: url(#skillLineGradient);
  stroke-width: 1.5;
  filter: url(#skillGlow);
}
```

### 7. Icons from react-icons

Using appropriate icon packs:
- `SiJava`, `SiPython`, `SiMysql` from `react-icons/si` (Simple Icons)
- `FaAws`, `FaDocker` from `react-icons/fa` (Font Awesome)
- `SiTensorflow`, `SiOpenai` from `react-icons/si`
- Fallback to first letter for tools without icons

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/Skills.tsx` | Complete rewrite with new graph-based layout, hub clusters, always-visible tool nodes, SVG connections |
| `src/index.css` | Add glassmorphism utility classes for skill nodes |

---

## Mobile Behavior

Mobile layout remains unchanged - the card-based grid view is already good for smaller screens. The graph visualization is hidden on mobile and replaced with the categorized cards.

---

## No Longer Included

- Hover popups (removed)
- Skill level bars (removed)
- Dynamic hover states (removed)
- Abstract node-only layout (replaced with hub + tools)
