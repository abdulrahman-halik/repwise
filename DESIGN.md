---
version: alpha
name: Repwise Night Lift
description: Dark-first athletic marketplace UI — near-black green-tinted surfaces, one electric-lime accent, condensed display type, large trainer imagery.
colors:
  background: "#0A0D0B"
  surface: "#111512"
  surface-elevated: "#171C18"
  border: "#232A25"
  primary: "#C6FF3D"
  primary-foreground: "#0A0D0B"
  primary-ink-light: "#4F7A00"
  text-main: "#F1F4EF"
  text-muted: "#8E978F"
  danger: "#FF5A4E"
  star: "#C6FF3D"
  light-background: "#F5F6F1"
  light-surface: "#FFFFFF"
  light-border: "#E1E4DC"
  light-text: "#0B0F0C"
typography:
  display:
    fontFamily: Barlow Condensed
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.01em
    textTransform: uppercase
  body:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  eyebrow:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    letterSpacing: 0.22em
    textTransform: uppercase
  script:
    fontFamily: Caveat
    fontWeight: 700
rounded:
  sm: 8px
  md: 12px
  lg: 18px
  xl: 24px
  full: 9999px
spacing:
  section: 96px
  container: 1240px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
---

# Repwise — Design Specification

## Overview
Repwise is a personal-training marketplace. The UI borrows the mood of a late-night gym: dark, quiet surfaces lit by a single electric-lime signal colour. Big condensed uppercase headlines carry the energy; trainer photography carries the emotion. Client pages are mobile-first, the trainer dashboard is desktop-first.

## Colors
- **Night (`#0A0D0B`)** – page canvas, faintly green-tinted black.
- **Surface (`#111512`) / Elevated (`#171C18`)** – cards, panels, inputs. Separated by 1px `#232A25` borders, not shadows.
- **Electric Lime (`#C6FF3D`)** – the only accent. Primary buttons, active states, ratings, live indicators. Text on lime is always near-black.
- **Light theme** – warm off-white canvas; lime stays as a button fill, but lime *text* switches to `#4F7A00` for contrast.
- **Banned:** purple/violet/indigo, multi-colour gradients, mesh backgrounds.

## Typography
- **Display:** Barlow Condensed 800, uppercase, tight leading (0.92). Used for H1/H2, prices and big stats.
- **Body/UI:** Inter 400–600.
- **Eyebrow:** 11px Inter, 0.22em tracking, lime.
- **Script accent:** Caveat 700 in lime, at most one per page (hero annotation), never for information.

## Layout
- Container max 1240px, 20px gutters on mobile, 32px on desktop.
- Sections separated by a 1px border and ~96px vertical rhythm.
- Dashboard: fixed 240px sidebar on ≥lg, top bar + sheet on mobile.

## Elevation & Depth
Flat surfaces with 1px borders. Depth comes from photography, dark vignettes over images and a soft lime glow behind the hero — nothing else glows.

## Shapes
12px radius for buttons/inputs, 18px for cards, full pills for chips and avatars.

## Components
- **TrainerCard** – tall portrait image, solid dark scrim (`bg-black/55`), name/headline/rating/price over the image.
- **ProgramCard** – cover with lesson count + price, "Explore" outlined button.
- **SpecialtyChip** – round icon tile + label (from the reference "Workouts for every goal" row).
- **SlotPill** – date/time pill; open = outlined, selected = lime.
- **LessonRow** – position number, title, duration, preview badge or lock.
- **StatCard** – eyebrow label, display-font number, delta.
- **EmptyState / Skeleton** – every list has both.

## Do's and Don'ts
- **Do** keep one primary (lime) action per view.
- **Do** show money as USD with no decimals when whole (`$49`).
- **Don't** add new accent colours for status — use lime, muted grey and danger red only.
- **Don't** use glassmorphism except the navbar backdrop blur.
