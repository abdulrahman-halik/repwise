---
tokens:
  colors:
    background: "#090d16"
    surface: "#111827"
    surface-elevated: "#1f2937"
    border: "#374151"
    border-subtle: "#1f2937"
    primary: "#10b981"
    primary-hover: "#059669"
    primary-light: "rgba(16, 185, 129, 0.12)"
    accent: "#f59e0b"
    accent-light: "rgba(245, 158, 11, 0.12)"
    text-main: "#f9fafb"
    text-muted: "#9ca3af"
    text-subtle: "#6b7280"
    danger: "#ef4444"
  typography:
    font-sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    font-mono: "'JetBrains Mono', ui-monospace, monospace"
  rounded:
    sm: "6px"
    md: "10px"
    lg: "16px"
    full: "9999px"
---

# Habit Tracker - Design Specification

## Overview
A tactile, focused daily habit tracker interface designed with an emphasis on clarity, rhythm, and instant feedback. Rather than overwhelming users with excessive charts or generic AI gradients, the interface presents a clear daily checklist, a 7-day completion matrix, and vivid streak indicators that make tracking habits satisfying.

## Colors
- **Canvas (`#090d16`)**: Deep, low-glare slate canvas ensuring eye comfort during morning and evening check-ins.
- **Card Surface (`#111827`)**: Structured card layers with sharp 1px borders (`#374151`) providing distinct separation.
- **Success & Action (`#10b981` Emerald)**: High-contrast emerald green for habit completion checkmarks and consistency graphs.
- **Streak Flame (`#f59e0b` Warm Amber)**: Dedicated amber hue reserved exclusively for streak counts and milestones.
- **Strict Prohibition**: Absolute ban on purple, violet, indigo, and fuchsia across all elements and accents.

## Typography
- **Headings & Data**: High-legibility grotesque sans-serif with bold tabular figures for streak counts and percentages.
- **Visual Hierarchy**:
  - Main Title: 24px - 30px, font-bold, tracking-tight.
  - Habit Names: 16px, font-semibold, high-contrast white.
  - Sublabels & Dates: 12px - 13px, font-medium, muted grey.

## Layout
- **Container**: Max width 840px, centered with comfortable margins. Optimized for focused single-column scanning.
- **Habit Matrix**: Horizontal 7-day pills aligned directly with each habit row, enabling one-tap check-ins for today or recent days.
- **Header Summary**: Quick glance metrics showing today's completion rate and total active streaks.

## Elevation & Depth
- Flat, tactile surfaces with 1px border borders (`border-gray-800`).
- Interactive buttons and day check-in pills use active micro-press transforms (`active:scale-95`) to give physical feedback.
- Zero blurry glassmorphism or floating neon drop-shadows.

## Components
- **HabitCard**: Row-based component containing habit name, category badge, streak badge, and 7 interactive day circles.
- **DayPill**: Individual day status button (completed, pending, or missed) with date initial (M, T, W, T, F, S, S) and day number.
- **Modal Dialog**: Centered keyboard-accessible overlay with high-contrast inputs for creating/editing habits.
- **Settings Sheet**: Quick access to JSON backup export, import, and reset actions.

## Do's and Don'ts
- **DO**: Keep day toggling instantaneous with immediate local storage write and optimistic UI update.
- **DO**: Support both today and retrospective checks for the current 7-day rolling window.
- **DON'T**: Use purple or violet accent gradients.
- **DON'T**: Rely on external database servers or auth gates that slow down habit logging.
