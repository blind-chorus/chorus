# Text list

The default List sub-component — display or navigation rows over the shared List anatomy. No leading slot; the whole row is the click target. Row geometry, typography, divider, state overlays, and inward focus ring all delegate to the [family-wide rules](./list.md); this sub documents only Text-specific composition.

**Layout inset.** `full-bleed` — Text list is an **edge-to-edge** family. It sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. Each row pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap the list in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays and the rows land at a different inset than the section headings and other lists around them. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A plain text list — six menu rows with optional supporting text.

```preview
list/text
---
import { List } from '@blind-dsai/ui';

<List
  items={[
    { value: 'profile',  label: 'Profile',         supportingText: 'Name, photo, bio' },
    { value: 'notif',    label: 'Notifications',   supportingText: 'Email, push, in-app' },
    { value: 'privacy',  label: 'Privacy',         supportingText: 'Who can see your activity' },
    { value: 'language', label: 'Language' },
    { value: 'about',    label: 'About' },
  ]}
/>
```

## Use cases

### With trailing action

A Text Button dropped into the row's `trailingIcon` slot turns a display row into a row + action affordance — the row label stays informational (no `onClick` on the row itself), and the trailing button is the only commit target. Reach for it on settings rows that pair a value with a small "change / edit / view" action.

```preview
list/text-with-trailing-action
---
import { Button, List } from '@blind-dsai/ui';

<List
  variant="text"
  aria-label="Notification channels"
  items={[
    {
      value: 'email',
      label: 'Email',
      supportingText: 'work@example.com',
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          Edit
        </Button>
      ),
    },
    {
      value: 'sms',
      label: 'SMS',
      supportingText: '+1 (415) ***-2487',
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          Edit
        </Button>
      ),
    },
  ]}
/>
```

## Slots

- **container** — outer vertical stack (delegates to family).
- **row** — single list item; whole row is the click target.
- **leading** — omitted for this sub.
- **label** — primary row text. 16px / Regular / `onSurface`.
- **supportingText** *(optional)* — secondary line under label.
- **trailingIcon** *(optional)* — consumer-supplied 16px glyph at the trailing edge.

## States

No `selected` state — selection belongs to the [Radio sub](./radio.md).

## Focus indicator

Inward 3-layer ring inside the row's bounds — see the family-wide [Focus indicator](./list.md#cross-sub-contract).

## Behavior

- **Keyboard navigation.** Arrow ↑ / ↓ moves focus between rows; Home / End jump to first / last.
- **Row click target.** The whole row is clickable when `onClick` is bound to the item.
