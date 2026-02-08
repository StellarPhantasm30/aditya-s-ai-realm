
# Hero Section "Hi, I am" Text Enhancement

## Current Issue
The "Hi, I am" greeting text is:
- **Too small**: Using `text-lg` (1.125rem) vs the name's `text-6xl` (3.75rem)
- **Too faded**: Using `text-muted-foreground` (light gray/65% opacity) instead of white
- **Visually lost**: Gets overshadowed by the larger, brighter elements below it

## Solution

### Changes to Make
Update the "Hi, I am" paragraph styling in `src/components/Hero.tsx` (lines 78-85):

| Aspect | Current | New | Reason |
|--------|---------|-----|--------|
| Text Color | `text-muted-foreground` | `text-foreground` (white) | Better visibility and hierarchy |
| Font Size | `text-lg` | `text-xl` or `text-2xl` | More proportional to the name below |
| Additional Enhancement | None | Optional: `font-medium` | Adds subtle emphasis |

### Implementation Details

Change line 82 from:
```typescript
className="text-muted-foreground text-lg mb-2"
```

To:
```typescript
className="text-foreground text-xl md:text-2xl font-medium mb-2"
```

This will:
- **Make text white** using `text-foreground` (which is the portfolio's main light color, `#fef6f3` from your color scheme)
- **Increase visibility** with `text-xl` (1.25rem) on mobile and `text-2xl` (1.5rem) on desktop
- **Add subtle weight** with `font-medium` for better visual presence
- **Maintain responsive design** with the `md:` breakpoint

### Visual Result
The greeting will now have appropriate visual weight relative to the name and other elements, making the hero section feel more balanced and intentional.

### Files to Modify
- `src/components/Hero.tsx` - Update the className on line 82
