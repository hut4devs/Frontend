import { expect, test, type Page } from "@playwright/test";
import { contrastRatio } from "../helpers/design-token-validation";

function rgbToHex(rgb: string): string {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) throw new Error(`Unsupported computed color: ${rgb}`);
  return `#${match.slice(1).map((channel) => Number(channel).toString(16).padStart(2, "0")).join("")}`;
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

async function expectFocusFits(page: Page) {
  const appearance = await page.locator(":focus").evaluate((element) => {
    const style = getComputedStyle(element);
    const extent = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
    return {
      visible: element.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      outlineWidth: parseFloat(style.outlineWidth),
      outlineColor: style.outlineColor,
      shadow: style.boxShadow,
      fits: Array.from(element.getClientRects()).every((rect) =>
        rect.left >= extent && rect.right + extent <= document.documentElement.clientWidth),
    };
  });
  expect(appearance.visible).toBe(true);
  expect(appearance.outlineStyle).toBe("solid");
  expect(appearance.outlineWidth).toBeGreaterThanOrEqual(3);
  expect(appearance.outlineColor).toBe("rgb(90, 45, 12)");
  expect(appearance.shadow).toContain("rgb(255, 249, 238)");
  expect(appearance.fits).toBe(true);
}

// Controlled fixture consumes the built application's tokens; it does not add product UI.
async function addTokenFixture(page: Page) {
  await page.evaluate(() => {
    const fixture = document.createElement("section");
    fixture.id = "token-fixture";
    fixture.setAttribute("aria-label", "Token verification fixture");
    fixture.style.cssText = "padding:calc(var(--spacing)*4);display:grid;gap:calc(var(--spacing)*4)";
    for (const role of ["success", "warning", "danger", "info", "neutral"]) {
      const status = document.createElement("p");
      status.dataset.status = role;
      status.textContent = `${role}: Example status with meaningful text`;
      status.style.cssText = `color:var(--status-${role}-foreground);background:var(--status-${role}-surface);border:var(--border-width-default) solid var(--status-${role}-border);padding:calc(var(--spacing)*3);border-radius:var(--radius-control)`;
      fixture.append(status);
    }
    const label = document.createElement("label");
    label.htmlFor = "fixture-input";
    label.textContent = "Example name";
    const input = document.createElement("input");
    input.id = "fixture-input";
    input.style.cssText = "min-width:0;width:100%;min-height:calc(var(--spacing)*11);padding:calc(var(--spacing)*3);color:var(--text-primary);background:var(--surface-primary);border:var(--border-width-default) solid var(--border-control);border-radius:var(--radius-control)";
    const button = document.createElement("button");
    button.textContent = "Continue example";
    button.style.cssText = "min-height:calc(var(--spacing)*11);padding:calc(var(--spacing)*3);color:var(--action-primary-foreground);background:var(--action-primary);border:var(--border-width-default) solid var(--border-control);border-radius:var(--radius-control)";
    fixture.append(label, input, button);
    document.querySelector("main")!.append(fixture);
  });
}

test.beforeEach(async ({ page }) => {
  // Verify resilient fallback rendering deterministically without a third-party network dependency.
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
});

for (const width of [320, 768, 1280]) {
  test(`warm surfaces, keyboard focus and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Welcome to Hut4Devs" })).toBeVisible();
    const body = await page.locator("body").evaluate((element) => {
      const style = getComputedStyle(element);
      const html = getComputedStyle(document.documentElement);
      return { color: style.color, background: html.backgroundColor, fontSize: parseFloat(style.fontSize), lineHeight: parseFloat(style.lineHeight), font: style.fontFamily };
    });
    expect(body.background).toBe("rgb(247, 241, 231)");
    expect(body.font).toContain("DM Sans");
    expect(body.fontSize).toBeGreaterThanOrEqual(16);
    expect(body.lineHeight / body.fontSize).toBeGreaterThanOrEqual(1.5);
    expect(contrastRatio(rgbToHex(body.color), rgbToHex(body.background))).toBeGreaterThanOrEqual(4.5);
    for (const name of ["Hut4Devs home", "Accommodation", "Members", "Payments", "Peer support", "Trust trails"]) {
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name, exact: true })).toBeFocused();
      await expectFocusFits(page);
    }
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/trust-trails$/);
    await expect(page.getByRole("heading", { name: "Trust trails" })).toBeVisible();
    await expectNoOverflow(page);
  });

  test(`status and form token fixture reflows with 200% text at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await addTokenFixture(page);
    const initialFontSize = await page.locator("body").evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.locator("body").evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBe(initialFontSize * 2);
    for (const role of ["success", "warning", "danger", "info", "neutral"]) {
      const status = page.locator(`[data-status="${role}"]`);
      await expect(status).toContainText(`${role}:`);
      const style = await status.evaluate((element) => {
        const computed = getComputedStyle(element);
        return { color: computed.color, background: computed.backgroundColor, border: computed.borderTopColor };
      });
      expect(contrastRatio(rgbToHex(style.color), rgbToHex(style.background))).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(rgbToHex(style.border), rgbToHex(style.background))).toBeGreaterThanOrEqual(3);
    }
    const input = page.getByRole("textbox", { name: "Example name" });
    await input.focus();
    await input.fill("A readable example");
    await page.keyboard.press("Tab");
    const button = page.getByRole("button", { name: "Continue example" });
    await expect(button).toBeFocused();
    await expectFocusFits(page);
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expectNoOverflow(page);
  });
}

test("retains the light theme under a dark system preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  expect(await page.locator("html").evaluate((element) => {
    const style = getComputedStyle(element);
    return { scheme: style.colorScheme, background: style.backgroundColor };
  })).toEqual({ scheme: "light", background: "rgb(247, 241, 231)" });
});

test("provides a system-color focus outline in forced-colors mode", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: "Hut4Devs home" });
  await expect(link).toBeFocused();
  const style = await link.evaluate((element) => {
    const computed = getComputedStyle(element);
    const probe = document.createElement("span");
    probe.style.color = "Highlight";
    document.body.append(probe);
    const highlight = getComputedStyle(probe).color;
    probe.remove();
    return { outline: computed.outlineStyle, width: computed.outlineWidth, color: computed.outlineColor, shadow: computed.boxShadow, highlight };
  });
  expect(style.outline).toBe("solid");
  expect(style.width).toBe("3px");
  expect(style.color).toBe(style.highlight);
  expect(style.shadow).toBe("none");
});
