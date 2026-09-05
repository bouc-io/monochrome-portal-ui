

## Plan: Reshape into User Portal

Transform the current admin console into a user-facing portal with three sections: **My Instructions**, **Billing**, and **Settings**.

### What changes

**1. Sidebar (`AdminSidebar.tsx`)**
- Rename from "Admin Console" to "User Portal"
- Replace nav items with three entries:
  - "My Instructions" (`/instructions`, FileText icon)
  - "Billing" (`/billing`, CreditCard icon)
  - "Settings" (`/settings`, Settings icon)
- Remove admin-only items (Dashboard, SSO, System Status, LLM Providers, LLM Assignments)

**2. My Instructions page (`LLMInstructions.tsx`)**
- Rebrand from "LLM Instructions" to "My Instructions"
- Change description from "Global instructions applied to all users" to "Your personal instructions for LLM sessions"
- Keep the full CRUD UI (create, edit, toggle, delete) as-is

**3. New Billing page (`src/pages/Billing.tsx`)**
- **Subscription card**: shows current plan name, status (active/cancelled), next billing date, monthly price
- **Payment method card**: masked card number, expiry, "Update" button (placeholder)
- **Invoice history table**: columns for date, description, amount, status (paid/pending/failed), and a "Download" link
- All data is mock/static for now since there is no real Stripe backend wired up
- Uses existing Card, Table, Badge, and Button components

**4. Settings page (`SettingsPage.tsx`)**
- Keep as-is (theme, language, account info, keyboard shortcuts) — already user-appropriate

**5. Dashboard redirect**
- Change the `/` route to render `LLMInstructions` (or redirect to `/instructions`) so the portal opens to a useful page instead of the old admin dashboard
- Remove unused pages: `Dashboard.tsx`, `SSOConfig.tsx`, `SystemStatus.tsx`, `LLMProviders.tsx`, `LLMAssignments.tsx` (remove routes from `App.tsx`)

**6. App.tsx route cleanup**
- Keep: `/login`, `/instructions`, `/billing`, `/settings`, `*`
- Default `/` redirects to `/instructions`

### Files modified
| File | Action |
|---|---|
| `src/components/AdminSidebar.tsx` | Update nav items, rename header |
| `src/pages/LLMInstructions.tsx` | Rebrand copy |
| `src/pages/Billing.tsx` | **New** — subscription + invoices UI with mock data |
| `src/App.tsx` | Remove old routes, add `/billing`, redirect `/` |
| `src/pages/Dashboard.tsx` | Delete (unused) |
| `src/pages/SSOConfig.tsx` | Delete (unused) |
| `src/pages/SystemStatus.tsx` | Delete (unused) |
| `src/pages/LLMProviders.tsx` | Delete (unused) |
| `src/pages/LLMAssignments.tsx` | Delete (unused) |

