Create a premium landing page for a **Private Rental Due Diligence Concierge** service targeting overseas tenants moving to Toronto, Canada.

---

### BUSINESS DETAILS

**Service name:** ZIP Home Rental Verification  
**Tagline:** Private Rental Due Diligence for Overseas Tenants  
**Core hook:** "Before you send a $5,000 deposit, have someone you trust on the ground."  
**Pricing:** $350–$500 per property verification  
**Contact:** hello@torontorentalconcierge.com

**What the service includes (6 deliverables):**
1. Private scheduled viewing (45–60 min, not a group tour)
2. Live Zoom walkthrough OR 4K recorded video tour
3. Deep in-unit inspection — moisture, damage, smell, appliances, light
4. Building common areas review — lobby, laundry, hallways, parking
5. Neighbourhood walk video — transit, shops, street safety, real vibe
6. Honest written assessment + basic lease red flag scan (non-legal)
7. Same-day PDF report with photos, notes, and a clear recommendation

**Target clients:**
- International students from India, China, Middle East (rent $2,200–$3,000/mo, upfront $5K–$7K)
- Relocating tech workers (rent $3,000–$4,500/mo, upfront $6K–$9K)
- Immigrating families (rent $3,200–$4,800/mo, upfront $7K–$10K)

**Key risk framing (use in Problem section):**
- Rental fraud: scammers collect deposits on properties they don't own
- Misleading listings: wide-angle lenses hide small rooms, photos hide mould/smells
- Lease traps: non-standard clauses go unnoticed under time pressure
- No way to verify remotely: can't smell the hallway, can't see the real neighbourhood

**The math argument:**
- $8,000 at risk (deposit + first & last) WITHOUT verification
- $400 for certainty WITH verification
- Frame: "$400 for certainty is not an expense — it's insurance."

**4-step process:**
1. Share the listing → confirm availability, get exact quote
2. We book the viewing → private, coordinated with your Zoom availability
3. Live walkthrough → join Zoom in real time or receive 4K recording
4. Same-day report → PDF with findings, photos, red flags, verdict

---

### DESIGN SYSTEM

**Aesthetic:** Dark luxury / refined editorial. Think private banking meets investigative journalism. NOT real estate agent generic. NOT startup pastel. Serious, trustworthy, expensive-feeling.

**Color palette (CSS variables):**
```css
--ink: #0d0d0d;        /* primary background */
--cream: #f5f0e8;      /* primary text */
--gold: #b8966a;       /* brand accent */
--gold-light: #d4b483; /* headings, highlights */
--gold-pale: #f0e6d0;  /* subtle fills */
--slate: #1a1a1f;      /* alternate section backgrounds */
--mid: #2e2e36;        /* card backgrounds */
--muted: #888890;      /* secondary text, labels */
--white: #ffffff;      /* emphasis text */
```

**Typography:**
- Display/headings: `Cormorant Garamond` (Google Fonts) — weights 300, 400, italic
- Body/UI: `DM Sans` (Google Fonts) — weights 300, 400, 500
- Section labels: 0.68–0.72rem, letter-spacing 0.2–0.25em, uppercase, gold color
- Hero heading: clamp(3rem, 7vw, 6rem), weight 300, line-height 1.06
- Section headings: clamp(2rem, 3.5vw, 3rem), weight 300

**Background effects:**
- Grain overlay: fixed SVG feTurbulence noise at opacity 0.035, z-index 9999, pointer-events none
- Section alternation: `--ink` and `--slate` backgrounds
- Radial gold glows: `radial-gradient(circle, rgba(184,150,106,0.08) 0%, transparent 70%)` on hero and CTA
- No solid white backgrounds anywhere

**Component patterns:**

*Nav:* Fixed top, flex space-between, logo left (Cormorant Garamond, gold, uppercase, letter-spacing 0.15em), CTA button right (gold background, dark text, uppercase small caps). Fades to transparent below.

*Buttons:*
- Primary: gold background `#b8966a`, ink text, font 0.8rem uppercase letter-spacing 0.15em, padding 18px 44px, no border-radius (square corners), hover lightens to `#d4b483`
- Ghost: transparent, cream text, 1px border rgba(cream,0.25), same sizing, hover border/text turns gold

*Section labels:* Always a small uppercase gold tag above the section heading. 0.68rem, letter-spacing 0.25em.

*Cards/deliverables:* Dark background `rgba(255,255,255,0.02–0.03)`, border `1px solid rgba(255,255,255,0.06–0.08)`, left accent border `2px solid rgba(184,150,106,0.4)` on hover-sensitive items. Square corners. Hover shifts background slightly toward gold tint.

*Numbered items:* Use `01`, `02` etc. in Cormorant Garamond, small, muted gold `rgba(184,150,106,0.4)`.

*Quote blocks:* Cormorant Garamond italic, large decorative `"` in background at opacity 0.1, gold accent text below.

*Stat blocks:* Number in Cormorant Garamond ~2.4rem weight 300 gold-light, label in tiny uppercase muted text.

**Animations:**
- Hero elements: `fadeUp` keyframe (opacity 0→1, translateY 24px→0), staggered with animation-delay 0s, 0.1s, 0.2s, 0.3s, 0.45s
- Scroll sections: IntersectionObserver adds `.visible` class to `.reveal` elements (threshold 0.12), CSS transition opacity + translateY 30px→0 over 0.8s
- Cards: transition-delay staggering for grid children (0s, 0.1s, 0.2s)
- No libraries needed — pure CSS + vanilla JS IntersectionObserver

**Layout principles:**
- Max content width: 1100px, centered with auto margins
- Standard section padding: 120px top/bottom, 60px left/right
- Grid gaps: 80px for two-column layouts, 24px for card grids, 2px for deliverable grids (flush)
- No border-radius on any element (sharp corners only)
- Responsive breakpoint at 900px: all grids collapse to 1 column

---

### PAGE SECTIONS (in order)

1. **Fixed Nav** — logo + CTA
2. **Hero** — label pill, h1 with italic highlight, subtext, two CTAs, proof stats row
3. **Problem** — two-column: heading left, 4 risk cards right (icon + title + description)
4. **Positioning Strip** — full-width slate bg, centered italic pull quote in Cormorant
5. **Offer** — slate bg, header row (heading + price block), 3×2 deliverable grid
6. **Clients** — dark bg, 3 client profile cards with emoji icon, spend data at bottom
7. **Math** — centered, side-by-side comparison boxes ($8K risk vs $400 certainty)
8. **Process** — slate bg, 4-step horizontal layout with connecting line and numbered circles
9. **CTA** — centered, radial gold glow, heading + subtext + primary button + email link
10. **Footer** — border-top, logo left, legal note right ("Not a licensed real estate brokerage")

---

### TONE & COPY RULES

- Never use exclamation marks
- Never use "we're excited to" or marketing filler
- Body copy: short, declarative sentences. Maximum 2 sentences per paragraph in cards.
- Headlines: use line breaks intentionally for rhythm, always end with the emotional hook
- Always use italic Cormorant for the emotional/memorable part of a heading
- Framing: premium protection, not errands. Trusted friend, not a vendor.
- The word "honest" should appear at least twice (in deliverables and CTA sections)

---

### TECHNICAL REQUIREMENTS

- Single HTML file, no external JS libraries
- Google Fonts loaded via @import or link tag
- All CSS in `<style>` block in `<head>`
- All JS in `<script>` block before `</body>`
- Smooth scroll behavior on html element
- Mobile responsive at 900px breakpoint
- No border-radius on any element
- No form elements — CTA uses mailto: link and a "Book a Verification" email CTA
- Footer must include: "Not a licensed real estate brokerage."

---