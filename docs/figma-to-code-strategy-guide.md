# Figma-to-Code Strategy Guide

> **For Figma Workflow Team**: Comparison of tools for converting Figma designs to React code

## Overview

This POC serves as a **testbed for evaluating Figma-to-code tools**. All components in `src/components/stitch/` can be replaced with components generated from Figma using various export strategies.

## 🎯 Evaluation Criteria

When testing a Figma-to-code tool with this POC, consider:

1. **Code Quality**: Is the generated code maintainable?
2. **TypeScript Support**: Does it generate proper types?
3. **Props Interface**: Can you match our interface contracts?
4. **Tailwind CSS**: Does it use our existing Tailwind setup?
5. **Component Isolation**: Can each component be exported individually?
6. **State Management**: Can it integrate with Zustand/React hooks?
7. **Iteration Speed**: How fast can you make changes?

## 🔧 Tool Comparison

### 1. Builder.io

**Website**: https://www.builder.io/

**Approach**: Design-to-code with AI assistance

**Pros**:
- ✅ React + TypeScript output
- ✅ Tailwind CSS support
- ✅ Component-level export
- ✅ Good for complex layouts
- ✅ Supports responsive design

**Cons**:
- ⚠️ Requires Builder.io account
- ⚠️ Learning curve for setup
- ⚠️ May generate wrapper components

**Best For**: Complex UIs with multiple variants

**How to Use with POC**:
1. Design component in Figma
2. Export to Builder.io
3. Generate React + Tailwind code
4. Adapt to match our props interface
5. Replace file in `src/components/stitch/`

---

### 2. Anima

**Website**: https://www.animaapp.com/

**Approach**: Direct Figma-to-React export

**Pros**:
- ✅ Figma plugin for direct export
- ✅ React code generation
- ✅ CSS modules or styled-components
- ✅ Fast iteration

**Cons**:
- ⚠️ May not use Tailwind by default
- ⚠️ Generated code often needs cleanup
- ⚠️ Props interface may need manual adjustment

**Best For**: Quick prototyping and initial component structure

**How to Use with POC**:
1. Install Anima Figma plugin
2. Select component in Figma
3. Export as React component
4. Convert styles to Tailwind classes
5. Add our props interface
6. Replace file in `src/components/stitch/`

---

### 3. Locofy

**Website**: https://www.locofy.ai/

**Approach**: AI-powered Figma-to-code with custom config

**Pros**:
- ✅ Supports Tailwind CSS
- ✅ TypeScript support
- ✅ Configurable component structure
- ✅ Good for entire screens

**Cons**:
- ⚠️ Requires premium plan for best features
- ⚠️ May generate too much boilerplate
- ⚠️ Learning curve for configuration

**Best For**: Converting entire screens or complex component trees

**How to Use with POC**:
1. Configure Locofy for React + TypeScript + Tailwind
2. Export Figma component
3. Review generated code
4. Simplify and adapt to our interface
5. Replace file in `src/components/stitch/`

---

### 4. Figma Dev Mode (Native)

**Website**: https://www.figma.com/dev-mode/

**Approach**: Inspect-and-copy code snippets

**Pros**:
- ✅ Built into Figma (no plugin needed)
- ✅ Shows CSS, spacing, colors directly
- ✅ Free with Figma
- ✅ Great for understanding design specs

**Cons**:
- ⚠️ Not full code generation
- ⚠️ Manual implementation required
- ⚠️ No TypeScript generation
- ⚠️ No component structure

**Best For**: Manual implementation with design reference

**How to Use with POC**:
1. Open Figma file in Dev Mode
2. Inspect component for spacing, colors, fonts
3. Manually implement React component
4. Use Tailwind classes matching design specs
5. Ensure props interface matches
6. Replace file in `src/components/stitch/`

---

### 5. Google Stitch (Referenced in POC)

**Status**: Not publicly available (internal Google tool as referenced)

**Approach**: AI-generated components with shadcn/ui patterns

**Pros** (theoretical):
- ✅ shadcn/ui component patterns
- ✅ Tailwind CSS by default
- ✅ AI understands context
- ✅ Modern React patterns

**Cons**:
- ⚠️ Not available for external testing
- ⚠️ Unknown iteration workflow

**Note**: Current POC components are human-written in the style of what Google Stitch might generate.

---

## 📊 Recommended Workflow

### Phase 1: Design in Figma

1. Create component in Figma following Versaterm design system
2. Use **Auto Layout** for proper React translation
3. Name layers clearly (affects generated code)
4. Use **components and variants** for different states
5. Document props in Figma (comments or descriptions)

### Phase 2: Export Strategy

Choose based on component complexity:

| Component Type | Recommended Tool | Reason |
|---------------|------------------|--------|
| Simple badge/label | Dev Mode (manual) | Faster to write than configure tool |
| Complex chat UI | Builder.io or Locofy | Handles layout complexity well |
| Form controls | Anima | Good for interactive elements |
| Full screen layouts | Locofy | Best for screen-level exports |

### Phase 3: Adapt to POC Interface

1. **Match props interface** from original component
2. **Convert to Tailwind** if tool used different CSS
3. **Add TypeScript types** if not generated
4. **Test with backend** to ensure data flows correctly
5. **Iterate on styling** using live reload

### Phase 4: Evaluate

Track metrics:
- ⏱️ **Time to first render**: Figma to working component
- 🔧 **Manual edits required**: How much cleanup?
- 🐛 **Bugs introduced**: Breaking changes or issues?
- 🎨 **Design fidelity**: Match to Figma design?
- ♻️ **Iteration speed**: How fast can you make changes?

---

## 🧪 Testing Each Tool with POC

### Test Scenario: Replace LanguageBadge

1. **Design** a language badge in Figma
   - Include: speaker label, flag icon, language name, confidence %
   - States: none, detecting (pulsing), confirmed (solid)
   - Colors: Versaterm brand (green for confirmed, yellow for detecting)

2. **Export** using chosen tool

3. **Adapt** to match this interface:
   ```typescript
   interface LanguageBadgeProps {
     speaker: 'caller' | 'telecommunicator';
     languageCode: string;
     languageName: string;
     confidence: number;
     status: 'detecting' | 'confirmed' | 'none';
   }
   ```

4. **Replace** `src/components/stitch/LanguageBadge.tsx`

5. **Test**:
   ```bash
   npm run dev
   # Click "Start Call" and observe badge behavior
   ```

6. **Measure**: Time from Figma export to working component

---

## 💡 Best Practices

### In Figma

- **Use Auto Layout** extensively (translates to flexbox)
- **Name layers semantically** (e.g., "CallButton", not "Rectangle 42")
- **Create component variants** for different states
- **Use design tokens** (colors, spacing) that match Tailwind
- **Document interactive states** (hover, active, disabled)

### When Adapting Code

- **Keep props interface stable** (see Component Replacement Guide)
- **Use Tailwind utility classes** instead of inline styles
- **Extract repeated patterns** to shared utilities
- **Add prop validation** with TypeScript
- **Test all states** (idle, active, error, etc.)

### When Evaluating

- **Compare side-by-side**: Original design vs. rendered component
- **Check responsiveness**: Resize browser window
- **Test interactions**: Hover, click, keyboard navigation
- **Validate accessibility**: Screen reader, keyboard-only
- **Profile performance**: React DevTools Profiler

---

## 📈 Success Metrics

A tool is successful if:

1. **<30 min** from Figma to working component (simple components)
2. **<2 hours** from Figma to working component (complex components)
3. **<10% manual edits** to generated code for basic fixes
4. **100% design fidelity** to Figma mockup
5. **Zero runtime errors** after adaptation
6. **Maintainable code** that team can understand and modify

---

## 🔗 Related Resources

- **[Component Replacement Guide](./component-replacement-guide.md)**: How to swap components
- **[Demo Runbook](./demo-runbook.md)**: Step-by-step demo instructions
- **shadcn/ui**: https://ui.shadcn.com/ (component patterns we follow)
- **Tailwind CSS**: https://tailwindcss.com/docs (our CSS framework)

---

## 📋 Evaluation Template

Use this template when testing a new tool:

```markdown
## Tool: [Tool Name]

**Date**: YYYY-MM-DD  
**Tester**: [Your Name]  
**Component**: [Which POC component replaced]

### Setup
- [ ] Tool installed/configured
- [ ] Figma design prepared
- [ ] Export settings configured

### Export Process
- **Time to export**: ___ minutes
- **Configuration required**: Yes / No / Minimal
- **Manual steps**: [List]

### Code Quality
- TypeScript support: ✅ / ⚠️ / ❌
- Tailwind CSS: ✅ / ⚠️ / ❌
- Props interface match: ✅ / ⚠️ / ❌
- Code readability: 1-5 ⭐

### Integration
- **Time to integrate**: ___ minutes
- **Manual edits required**: [List]
- **Bugs encountered**: [List]

### Results
- Design fidelity: 1-5 ⭐
- Performance: 1-5 ⭐
- Maintainability: 1-5 ⭐

### Recommendation
- Use for: [Component types]
- Avoid for: [Component types]
- Overall: ✅ Recommended / ⚠️ Use with caution / ❌ Not recommended
```

---

**Last Updated**: 2024-02-04  
**Maintainer**: Versaterm Design Systems Team
