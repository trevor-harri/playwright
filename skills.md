# IKEA AT (ikea.com/at/en) - Playwright Locator Reference

Verified locators for the IKEA Austria English website. Use these when writing Playwright tests — AI-generated locators for this site are frequently wrong.

## Cookie consent banner

| Action | Locator |
|--------|---------|
| Accept all cookies | `page.getByRole("button", { name: "Accept" })` |

## Header navigation bar

The main nav items are `<a>` tags with `role="button"` and class `hnf-megamenu__entrypoint`. Clicking them opens a mega menu overlay on the current page — they do **not** trigger a page navigation.

| Action | Locator |
|--------|---------|
| Products | `page.locator("a.hnf-megamenu__entrypoint", { hasText: "Products" })` |
| Rooms | `page.locator("a.hnf-megamenu__entrypoint", { hasText: "Rooms" })` |
| Offers & more | `page.locator("a.hnf-megamenu__entrypoint", { hasText: "Offers & more" })` |

> **Gotcha**: `getByRole("link", { name: "Products" })` matches 8+ elements because "Products" appears in carousel links like "Outdoor products", "Bathroom products", etc. Always use the CSS class `hnf-megamenu__entrypoint` to target the nav bar.

## Category carousel (homepage / Products page)

Category links in the horizontal carousel use class `hnf-inpage-nav__card`.

| Action | Locator |
|--------|---------|
| Any category (e.g. Smart home) | `page.locator("a.hnf-inpage-nav__card", { hasText: "Smart home" })` |

> **Gotcha — sticky header occlusion**: The sticky header (`div.hnf-content-container` inside `<header>`) intercepts pointer events on carousel items. Playwright retries indefinitely and times out. **Workaround**: read the `href` attribute and navigate directly:
> ```ts
> const link = page.locator("a.hnf-inpage-nav__card", { hasText: "Smart home" });
> const href = await link.getAttribute("href");
> await page.goto(href!);
> ```

> **Gotcha — capitalization**: The actual text is "Smart home" (lowercase h), not "Smart Home".

## Product cards (category pages)

Products are rendered as `div.pip-product-compact` components. Category landing pages are curated carousels — there is **no sort/filter UI**.

| Element | Locator |
|---------|---------|
| All product cards | `page.locator("div.pip-product-compact")` |
| Product link (within card) | `card.locator("a.pip-product-compact__wrapper-link")` |
| Product name (within card) | `card.locator(".pip-price-module__name-decorator")` |
| Product description (within card) | `card.locator(".pip-price-module__description")` |
| Price (within card) | `card.locator(".pip-price-module__price")` |
| Add to bag button (within card) | `card.locator('button[aria-label^="Add to shopping bag"]')` |
| Save to list button (within card) | `card.locator('button[aria-label^="Save to shopping list"]')` |

> **Price format**: European comma decimal, e.g. `€6,99`. Parse with:
> ```ts
> const text = await card.locator(".pip-price-module__price").textContent();
> const match = text?.match(/€([\d.,]+)/);
> const price = parseFloat(match[1].replace(",", "."));
> ```

> **Add-to-bag aria-label format**: `"Add to shopping bag, PRODUCT_NAME, description, variant"` — e.g. `"Add to shopping bag, TRETAKT, plug, smart"`.

## Toast notifications

After adding to cart, a toast appears with class `hnf-toast`. Multiple toasts can exist simultaneously (e.g. a postal code prompt).

| Element | Locator |
|---------|---------|
| Cart confirmation toast | `page.locator(".hnf-toast__text").filter({ hasText: "was added to your shopping bag" })` |
| Toast "Show" button | `page.locator(".hnf-toast__action-message")` |
| Toast dismiss button | `page.locator(".hnf-toast__close-btn")` |

> **Gotcha**: `.hnf-toast__text` resolves to multiple elements (postal code prompt + add-to-cart confirmation). Always filter with `{ hasText: ... }` to avoid strict mode violations.

## Shopping bag (cart) header icon

| Element | Locator |
|---------|---------|
| Shopping bag link | `page.locator('a[href*="shoppingcart"]')` |
| Shopping bag link (with count) | `page.getByRole("link", { name: /Shopping bag, \d+ items/ })` |
| Cart item counter badge | `page.locator("span.hnf-header__cart-counter")` |

> The counter badge only appears after items are added.

## Search

| Element | Locator |
|---------|---------|
| Search input | `page.getByRole("combobox").first()` |
| Search button | `page.locator('button.search-box-btn', { hasText: "Search" })` |

## Common AI locator mistakes

1. **`getByRole("link", { name: "Products" })`** — matches 8+ elements. Use `a.hnf-megamenu__entrypoint`.
2. **`getByRole("link", { name: "Smart Home" })`** — wrong capitalization ("Smart home") and subject to sticky header occlusion.
3. **`getByRole("button", { name: "Sort" })`** — does not exist on category landing pages.
4. **`[data-testid="product-card"]`** — IKEA does not use `data-testid`. Use `div.pip-product-compact`.
5. **`.hnf-toast__text` without filter** — matches multiple toasts. Always filter by text.
6. **`span.hnf-btn__badge`** — does not exist. Cart counter is `span.hnf-header__cart-counter`.
7. **`waitForLoadState("networkidle")`** — times out due to constant background requests. Use `domcontentloaded` and wait for specific elements.
