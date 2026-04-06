# Design System Document: The Luminous Scholar

## 1. Overview & Creative North Star
**Creative North Star: "Atmospheric Intellect"**

The objective of this design system is to dismantle the rigid, "boxed-in" feeling of traditional Learning Management Systems. Instead of a utilitarian database, we are creating a digital sanctuary for learning—an editorial-inspired platform that feels as premium as a high-end publication yet as approachable as a personal mentor.

The system breaks the "template" look through **intentional asymmetry** and **tonal depth**. We move away from the standard 12-column grid toward a layout where elements breathe. Large-scale typography, overlapping containers, and a soft, ethereal color palette create a sense of calm and focus. By utilizing "The Luminous Scholar" approach, we ensure that the interface never feels heavy or academic in a restrictive sense, but rather "academic" in its clarity and "approachable" in its softness.

---

### 2. Colors & Surface Philosophy
The palette is a sophisticated blend of deep purples, academic blues, and sunset accents (pinks and oranges). 

*   **The "No-Line" Rule:** To achieve a high-end editorial feel, designers are strictly prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to create a soft, organic edge.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers—stacked sheets of fine, semi-translucent paper. 
    *   **Level 0 (Base):** `surface` (`#fef7ff`)
    *   **Level 1 (Sections):** `surface-container-low` (`#f9f1ff`)
    *   **Level 2 (Cards/Modules):** `surface-container-highest` (`#eaddff`)
*   **The "Glass & Gradient" Rule:** Main Hero sections and primary CTAs should utilize subtle gradients (e.g., `primary` transitioning to `primary-container`) to provide visual "soul." For floating elements, use Glassmorphism by applying semi-transparent versions of `surface` with a 20px-40px backdrop-blur.
*   **Signature Textures:** Use `tertiary-container` (`#ff9dad`) as a soft accent "glow" or "bloom" behind important resource cards to draw the eye without the harshness of a notification badge.

---

### 3. Typography
The typography strategy pairs **Plus Jakarta Sans** (Display/Headlines) with **Manrope** (Body). This combination signals a modern, tech-forward, yet scholarly identity.

*   **Display & Headlines (Plus Jakarta Sans):** These are the "Editorial Voice." Use `display-lg` for Hero headers with tight letter-spacing (-0.02em) to create an authoritative, premium look.
*   **Body & Titles (Manrope):** Chosen for its exceptional readability at small sizes. Manrope's geometric nature ensures that even complex academic text feels light and digestible.
*   **Hierarchical Intent:** Use `on-surface-variant` (`#665883`) for secondary metadata or descriptions. The contrast between the bold `primary` headers and the soft `on-surface-variant` body text creates a natural reading rhythm.

---

### 4. Elevation & Depth
In this system, depth is a byproduct of light and layering, not artificial structure.

*   **Tonal Layering:** Avoid shadows for standard UI elements. Place a `surface-container-lowest` card on a `surface-container-low` background to create a "soft lift."
*   **Ambient Shadows:** For high-priority floating items (like a "Jump to Topic" button), use extra-diffused shadows. 
    *   *Spec:* `0px 20px 40px rgba(57, 43, 83, 0.06)`. The shadow color is a tinted version of `on-surface`, mimicking how light behaves in a physical environment.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container boundary, use a "Ghost Border": the `outline-variant` token (`#bbaadb`) at **15% opacity**. Never use 100% opaque borders.
*   **Motion & Depth:** When users hover over resource cards, they should not "pop"; they should transition into a slightly lighter `surface-bright` state with a subtle 2px vertical lift.

---

### 5. Components

#### Welcoming Hero Section
*   **Structure:** Asymmetric layout. Text content (Display-LG) aligned left, with an overlapping illustrative element or a "Glass" resource card floating to the right.
*   **Background:** A soft gradient sweep from `primary-container` to `surface`.

#### Sidebar (Topic Navigation)
*   **Style:** No vertical divider line. Use a `surface-container-low` background that spans the full height of the viewport.
*   **Active State:** Use a soft-pill shape (Rounded `full`) in `primary-container` with `on-primary-container` text. Avoid high-contrast boxes.

#### Resource Cards
*   **Composition:** Forbid divider lines within cards. Use `spacing.xl` (1.5rem) of internal padding to separate titles from descriptions.
*   **Visuals:** Each card should feature a top-aligned thumbnail with `roundness.lg`.
*   **Footer:** Use `label-md` for tags (e.g., "10 min read") using `secondary-container` backgrounds.

#### Buttons
*   **Primary:** `primary` background with `on-primary` text. Use `roundness.full` to maintain the "approachable" vibe.
*   **Tertiary (Ghost):** No background or border. Use `primary` text weight `600`.

#### Input Fields (Search)
*   **Style:** `surface-container-highest` background. No border. When focused, transition to a `ghost border` (outline-variant at 20%) and a subtle `primary` glow.

---

### 6. Do's and Don'ts

#### Do
*   **DO** use whitespace as a structural tool. If elements feel crowded, increase the margin rather than adding a divider.
*   **DO** overlap elements (e.g., a card partially sitting over a hero gradient) to create a bespoke, non-linear feel.
*   **DO** use `tertiary` (`#9d4053`) sparingly for high-interest labels or "New" badges to create a warm focal point.

#### Don't
*   **DON'T** use pure black (`#000000`) for text. Always use `on-surface` (`#392b53`) to maintain the soft, professional tone.
*   **DON'T** use standard Material Design "Drop Shadows." They are too heavy for this editorial aesthetic. Stick to Tonal Layering.
*   **DON'T** use sharp corners. Every element should utilize at least `roundness.DEFAULT` (0.5rem) to stay friendly and approachable.
*   **DON'T** use 1px lines to separate sidebar topics. Use vertical spacing and typography weight changes instead.

---

### 7. Implementation Note for Junior Designers
When building pages, imagine you are designing a high-end physical magazine. The background is your paper, and the containers are slightly heavier cardstocks laid on top. If you find yourself reaching for a "border" or a "shadow," stop and ask: *"Can I achieve this separation by simply changing the background color by one step or adding 16px of whitespace?"*