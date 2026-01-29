

# Skills Section Optimization Plan

## Current Issues with Code

Looking at your current implementation, the code has several redundancies:

1. **Manual position tracking** - Each skill has hardcoded `x`, `y` coordinates and explicit `connections` arrays
2. **Flat data structure** - Skills are in one big array but grouped by category conceptually
3. **Repetitive connection logic** - Every node says "connect to next node below" which is always the same pattern
4. **Scattered position variables** - Position variables defined separately (`position_programming`, `position_databases`, etc.)

---

## Proposed Solution: Category-Based Data Structure

Transform the data into a cleaner, more maintainable structure where:
- Skills are grouped by category
- Connections are auto-generated (each skill connects to the one below it)
- Positions are calculated automatically based on column index

### New Data Structure

```typescript
interface Skill {
  name: string;
  icon?: IconType;
  color: string;
}

interface SkillCategory {
  name: string;
  icon: IconType;
  color: string;        // Column header/line color
  skills: Skill[];      // Skills in this category
}

const skillCategories: SkillCategory[] = [
  {
    name: "Programming",
    icon: SiDatabricks,
    color: "#3b82f6",
    skills: [
      { name: "Java", icon: FaJava, color: "#f89820" },
      { name: "Python", icon: SiPython, color: "#3776ab" },
      { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
    ]
  },
  // ... other categories
];
```

### Benefits

| Before | After |
|--------|-------|
| ~100 lines of node definitions | ~50 lines of clean category data |
| Manual x/y for each node | Auto-calculated from column index |
| Explicit connection arrays | Auto-generated (connect downward) |
| Scattered position variables | Single loop calculates all positions |

---

## Layout Improvements

The current grid layout looks good visually. A few potential improvements:

### Keep Current Grid
The 7-column vertical layout works well. Just optimize the code behind it.

---

## Code Optimization Details

### 1. Render Function Simplification

Current approach iterates flat array and searches for connections. New approach:

```typescript
{skillCategories.map((category, colIndex) => (
  <SkillColumn 
    key={category.name}
    category={category}
    colIndex={colIndex}
    isInView={isInView}
  />
))}
```

### 2. Auto-Generated Connections

Instead of explicitly defining connections, the SVG line component draws vertical lines through all skills in a column:

```typescript
// Draw one continuous gradient line per column
<line 
  x1={colX} y1={headerY}
  x2={colX} y2={lastSkillY}
  stroke={`url(#gradient-${colIndex})`}
/>
```

### 3. Position Calculation

```typescript
const COLUMN_WIDTH = 170;  // px between columns
const ROW_HEIGHT = 100;    // px between rows

const getPosition = (colIndex: number, rowIndex: number) => ({
  x: colIndex * COLUMN_WIDTH + PADDING,
  y: rowIndex * ROW_HEIGHT + PADDING
});
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/Skills.tsx` | Restructure data model, simplify rendering logic, auto-calculate positions |

---

## Summary

This optimization will:
- Reduce code by ~40%
- Make adding/removing skills trivial (just edit the category arrays)
- Eliminate manual coordinate math
- Keep the exact same visual output

The layout itself (7 vertical columns with connecting lines) is clean and effective - no need to change it visually. Add an animation in the connecting lines of a glowing dot moving between the grid edges.

