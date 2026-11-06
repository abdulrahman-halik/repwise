# Habit Tracker - Project Plan

## Overview
A lightweight, tactile, and minimalist daily habit tracker built with Next.js (App Router), Tailwind CSS, and TypeScript. It stores all habits and completion history client-side in `localStorage` with zero latency, zero backend requirement, and complete privacy. The application helps users build consistency through daily check-ins, current/best streak calculations, weekly 7-day completion matrices, and seamless data backup/reset capabilities.

## Project Type
**WEB** (Next.js 15+ App Router, React, Tailwind CSS, TypeScript)

## Success Criteria
- [ ] Responsive, accessible, and tactile UI that works seamlessly on desktop and mobile browsers.
- [ ] Complete offline capability via `localStorage` with initial seed habits (Drink Water, Read 20 mins, Exercise) on first launch.
- [ ] Real-time streak tracking (current streak & best streak) calculated automatically based on local calendar dates (`YYYY-MM-DD`).
- [ ] 7-day visual completion grid showing current week status per habit with single-click toggle.
- [ ] Quick habit creation modal/dialog with category tag (Health, Focus, Mind, Fitness) and frequency configuration.
- [ ] Edit & archive/delete capabilities for any habit.
- [ ] Settings modal with Data Export (JSON download), Data Import, and Reset to Defaults.
- [ ] Zero purple/indigo/violet palette violations (strictly adhering to modern dark/light slate + emerald/amber accents).
- [ ] Type-safe codebase passing TypeScript strict checks, ESLint, and security audit scripts.

## Tech Stack
- **Framework**: Next.js (App Router, React 19 / 18, TypeScript)
- **Styling**: Tailwind CSS (clean utility architecture, dark/light theme support)
- **Icons**: Lucide React (clean, accessible vector icons)
- **State & Persistence**: Custom React hook (`useLocalStorage` / `useHabits`) with hydration safety (`isHydrated` guard to prevent SSR mismatch)
- **Date Handling**: Native JavaScript `Intl` and date utility functions (no heavy moment/date-fns dependencies)

## File Structure
```
/home/abdul/repwise/
├── habit-tracker.md                     # Active Project Plan & Verification Record
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout with metadata and theme providers
│   │   ├── page.tsx                     # Main dashboard page
│   │   └── globals.css                  # Custom tokens, reset, and base styles
│   ├── types/
│   │   └── habit.ts                     # Core domain interfaces (Habit, HabitLog, Category)
│   ├── lib/
│   │   ├── date-utils.ts                # Date formatting (YYYY-MM-DD), 7-day ranges, streak calculations
│   │   ├── storage.ts                   # LocalStorage adapters, seed data, export/import utilities
│   │   └── constants.ts                 # Preset categories, colors, default seed habits
│   ├── hooks/
│   │   └── useHabits.ts                 # Habit state management, actions (toggle, add, edit, delete, export)
│   └── components/
│       ├── Header.tsx                   # Top navigation with date header, streak summary, settings trigger
│       ├── HabitList.tsx                # List container for all active habit rows
│       ├── HabitCard.tsx                # Individual habit item with 7-day check-in pills, streak badge, menu
│       ├── HabitModal.tsx               # Modal to create or edit habit
│       ├── WeeklyOverview.tsx           # Weekly completion progress bar and aggregate score
│       ├── SettingsModal.tsx            # Export, import, and reset data modal
│       └── EmptyState.tsx               # Clean empty state when no habits exist
```

## Task Breakdown

### Task 1: Project Initialization & Configuration
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `nextjs-react-expert`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: Fresh directory with Node.js v24.12.0
- **OUTPUT**: Next.js project scaffolded with TypeScript, Tailwind CSS, and `lucide-react`
- **VERIFY**: `npm run build` succeeds and package dependencies install without errors.

### Task 2: Core Domain Models & Utility Functions
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `frontend-architecture`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Habit tracking business requirements (streaks, 7-day matrix, local storage persistence)
- **OUTPUT**:
  - `src/types/habit.ts`: TypeScript types for `Habit`, `HabitCategory`, `DailyStatus`, `HabitExport`
  - `src/lib/date-utils.ts`: Functions for local date keys (`getTodayKey`, `getPastNDays`, `calculateStreak`)
  - `src/lib/storage.ts`: Storage helpers with fallback seeds, JSON import/export, and schema validation
- **VERIFY**: Unit test / node assertion script verifying streak logic handles consecutive days, missed days, and today's toggle correctly.

### Task 3: State Management & Custom Hook (`useHabits`)
- **Agent**: `frontend-specialist`
- **Skills**: `nextjs-react-expert`, `clean-code`
- **Priority**: P1
- **Dependencies**: Task 2
- **INPUT**: Storage helpers and domain types
- **OUTPUT**: `src/hooks/useHabits.ts` providing CRUD actions, toggle completions, progress stats, and export/reset handlers with SSR hydration safety
- **VERIFY**: Hook mounts cleanly without hydration error warnings; habit toggling updates state and localStorage synchronously.

### Task 4: UI Components & Tactile Interaction
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `tailwind-patterns`, `atomic-design`
- **Priority**: P2
- **Dependencies**: Task 3
- **INPUT**: Hook state and design requirements (tactile check-ins, emerald/slate palette, accessible keyboard navigation, no purple ban violations)
- **OUTPUT**:
  - `Header.tsx`: Date display, summary metrics (today's completion %, active streaks)
  - `HabitCard.tsx`: Habit title, category badge, streak indicator, 7-day interactive check circles
  - `HabitModal.tsx`: Creation/edit form with title, description, category selector, frequency target
  - `SettingsModal.tsx`: JSON backup download, JSON upload restore, reset confirmation
  - `WeeklyOverview.tsx`: At-a-glance weekly consistency rate
- **VERIFY**: Visual inspection and keyboard accessibility test; all buttons and day-pills respond with smooth transitions and aria attributes.

### Task 5: Main Dashboard Integration & Polish
- **Agent**: `frontend-specialist`
- **Skills**: `nextjs-react-expert`, `frontend-design`
- **Priority**: P2
- **Dependencies**: Task 4
- **INPUT**: Assembled components and hooks
- **OUTPUT**: Integrated `src/app/page.tsx` and `src/app/layout.tsx` with filter tabs (All, Active, Categories) and quick "Add Habit" action.
- **VERIFY**: Dashboard loads seed habits, allows adding/editing/deleting habits, records completions across days, and persists across browser refreshes.

## Phase X: Final Verification Checklist
- [x] No purple, violet, indigo, or magenta color tokens used in styles (`grep -i -E "purple|violet|indigo|fuchsia" src/`)
- [x] Lint & TypeScript Check: `npm run lint` and `npx tsc --noEmit` pass with zero errors
- [x] Project Security Scan: `python3 .agents/skills/vulnerability-scanner/scripts/security_scan.py .` (0 vulnerabilities, SECURE)
- [x] UX & Accessibility Audit: `python3 .agents/skills/frontend-design/scripts/ux_audit.py .` (0 issues, PASS)
- [x] Production Build: `npm run build` succeeds
- [x] Runtime Verification: Dev server runs and responds with HTTP 200 at `http://localhost:3000`

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass (0 errors, 0 warnings)
- Security: ✅ No critical issues (Supply chain & config checks passed)
- Build: ✅ Success (Next.js 15 App Router static generation)
- Date: 2026-11-06
