# Test ID Conventions (v3.3.0)

Playwright specs in `playwright-tests/` reference stable `data-testid` hooks so
tests remain resilient to copy changes and Tailwind reshuffles. The canonical
list lives in `playwright-tests/testids.ts`; please import from there rather
than hard-coding strings.

## Why `data-testid`?

- Role / text selectors are the first choice, but they break when copy changes.
- `data-testid` is the last-resort, explicit hook owned by the test layer.
- We use it **selectively** — only for elements the specs interact with often.

## Inventory

| Testid                | Where it belongs                                          | Owning agent |
| --------------------- | --------------------------------------------------------- | ------------ |
| `part-card`           | Root element of a repeated product card                    | 1 / 2        |
| `band-badge`          | The 🟢 / 🟡 / 🔴 supply-band badge inside a card           | 1 / 2        |
| `qty-inc` / `qty-dec` | `+` / `-` buttons of the cart line-item qty stepper        | 3            |
| `nav-cart-count`      | Cart count bubble inside the top `NavBar`                  | 2            |
| `pagination-{n}`      | Each pagination chip on `/marketplace`                     | 1            |
| `compare-toggle`      | Compare-checkbox / toggle on each part card                | 1            |

## Protocol

Agent 5 (tests) does **not** edit app code. If a testid above is missing when
the tests run, the corresponding spec will fail. During merge cleanup the
owning agent (or a final integrator) adds the attribute. Grep for the testid
string to find the corresponding test and confirm the target element.

```
grep -R "data-testid=\"part-card\"" app/
```

## Adding new testids

1. Add the constant to `playwright-tests/testids.ts` with a `TODO(agent-X)`
   comment pointing to the component that needs the attribute.
2. Use the constant in specs: `page.getByTestId(TESTIDS.PART_CARD)`.
3. File a merge-cleanup note so the owning agent wires it into the component.
