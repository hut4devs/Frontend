import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import postcss from "postcss";
import { contrastRatio, readTokens, requireContrast, requireMappings, resolveToken } from "./helpers/design-token-validation";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const source = read("../src/styles/tokens.css");
const globalStyles = read("../src/styles/global.css");
const tokens = new Map([
  ...readTokens(read("../node_modules/tailwindcss/theme.css")),
  ...readTokens(source),
]);
const statuses = ["success", "warning", "danger", "info", "neutral"];
const statusParts = ["foreground", "surface", "border", "icon"];
const surfaces = ["canvas", "primary", "secondary", "raised"];
const textRoles = ["primary", "secondary", "muted", "interactive", "interactive-hover", "interactive-active"];
const mappings: Record<string, string> = {
  "--color-canvas": "--surface-canvas",
  "--color-surface": "--surface-primary",
  "--color-surface-secondary": "--surface-secondary",
  "--color-surface-raised": "--surface-raised",
  "--color-foreground": "--text-primary",
  "--color-foreground-secondary": "--text-secondary",
  "--color-muted": "--text-muted",
  "--color-interactive": "--text-interactive",
  "--color-interactive-hover": "--text-interactive-hover",
  "--color-interactive-active": "--text-interactive-active",
  "--color-on-primary": "--action-primary-foreground",
  "--color-on-secondary": "--action-secondary-foreground",
  "--color-divider": "--border-divider",
  "--color-control": "--border-control",
};
for (const role of statuses) {
  for (const part of statusParts) mappings[`--color-${role}-${part}`] = `--status-${role}-${part}`;
}
for (const role of [
  "action-primary", "action-primary-hover", "action-primary-active",
  "action-secondary", "action-secondary-hover", "action-secondary-active",
  "accent-decorative", "accent-decorative-strong", "accent-foreground",
  "disabled-surface", "disabled-foreground", "disabled-border", "focus-outer", "focus-inner",
]) mappings[`--color-${role}`] = `--${role}`;

describe("Warm Daylight token integrity", () => {
  it("retains the approved brand primitives", () => {
    const approved = {
      ivory: "#F7F1E7", cream: "#FFF9EE", chocolate: "#5A2D0C",
      caramel: "#C88D3A", golden: "#B77620",
    };
    for (const [name, value] of Object.entries(approved)) {
      expect(resolveToken(tokens, `--brand-${name}`)).toBe(value);
    }
  });

  it("provides every required token category and semantic status role", () => {
    const required = [
      ...surfaces.map((name) => `--surface-${name}`),
      ...textRoles.map((name) => `--text-${name}`),
      ...statuses.flatMap((role) => statusParts.map((part) => `--status-${role}-${part}`)),
      ...Object.values(mappings),
      "--font-body", "--font-heading", "--text-caption", "--text-label",
      "--leading-body", "--leading-heading", "--tracking-heading", "--spacing",
      "--font-weight-normal", "--font-weight-medium", "--font-weight-semibold", "--font-weight-bold",
      "--border-width-default", "--border-width-emphasis", "--radius-control", "--radius-panel",
      "--radius-pill", "--shadow-panel", "--focus-width", "--focus-offset",
      ...["base", "lg", "xl", "2xl", "3xl"].map((name) => `--text-${name}`),
    ];
    for (const name of required) expect(resolveToken(tokens, name).length).toBeGreaterThan(0);
    const statusNames = [...readTokens(source).keys()].filter((name) => name.startsWith("--status-"));
    expect(statusNames.sort()).toEqual(statuses.flatMap((role) => statusParts.map((part) => `--status-${role}-${part}`)).sort());
  });

  it("resolves every project token and all stylesheet references", () => {
    for (const name of readTokens(source).keys()) expect(resolveToken(tokens, name)).not.toContain("var(");
    for (const match of globalStyles.matchAll(/var\(\s*(--[\w-]+)/g)) {
      expect(resolveToken(tokens, match[1])).not.toContain("var(");
    }
  });

  it("maps every utility to its intended semantic role", () => {
    requireMappings(tokens, mappings);
    expect([...readTokens(source).keys()].filter((name) => name.startsWith("--color-")).sort()).toEqual(Object.keys(mappings).sort());
  });

  it("retains relative typography and accessible fallback fonts", () => {
    expect(resolveToken(tokens, "--font-body")).toMatch(/"DM Sans".*system-ui.*sans-serif/);
    expect(resolveToken(tokens, "--font-heading")).toMatch(/"Fraunces".*Georgia.*serif/);
    for (const name of ["--text-base", "--text-caption", "--text-label", "--spacing", "--radius-control", "--radius-panel"]) {
      expect(resolveToken(tokens, name)).toMatch(/^\d*\.?\d+rem$/);
    }
    expect(Number(resolveToken(tokens, "--leading-body"))).toBeGreaterThanOrEqual(1.5);
  });

  it("declares light mode without introducing an unapproved dark mapping", () => {
    const root = postcss.parse(source);
    const schemes: string[] = [];
    root.walkDecls("color-scheme", (declaration) => { schemes.push(declaration.value); });
    expect(schemes).toEqual(["light"]);
    root.walkRules((rule) => { expect(rule.selector).toBe(":root"); });
    root.walkAtRules("media", (rule) => { expect(rule.params).not.toContain("prefers-color-scheme"); });
  });
});

describe("supported light-mode contrast", () => {
  it.each(surfaces)("supports readable text on the %s surface", (surface) => {
    for (const role of textRoles) requireContrast(tokens, `--text-${role}`, `--surface-${surface}`, 4.5);
    requireContrast(tokens, "--accent-foreground", `--surface-${surface}`, 4.5);
  });

  it.each(["primary", "secondary"])("supports all %s action states", (action) => {
    for (const state of ["", "-hover", "-active"]) {
      requireContrast(tokens, `--action-${action}-foreground`, `--action-${action}${state}`, 4.5);
    }
  });

  it.each(statuses)("supports %s status text, borders, and icons", (role) => {
    requireContrast(tokens, `--status-${role}-foreground`, `--status-${role}-surface`, 4.5);
    for (const part of ["border", "icon"]) {
      requireContrast(tokens, `--status-${role}-${part}`, `--status-${role}-surface`, 3);
      requireContrast(tokens, `--status-${role}-${part}`, "--surface-canvas", 3);
    }
  });

  it("supports essential control boundaries and readable disabled labels", () => {
    for (const surface of surfaces) requireContrast(tokens, "--border-control", `--surface-${surface}`, 3);
    requireContrast(tokens, "--disabled-foreground", "--disabled-surface", 4.5);
    requireContrast(tokens, "--disabled-border", "--disabled-surface", 3);
  });

  it("provides contrasting focus bands on warm surfaces and chocolate actions", () => {
    requireContrast(tokens, "--focus-outer", "--focus-inner", 3);
    for (const surface of surfaces) requireContrast(tokens, "--focus-outer", `--surface-${surface}`, 3);
    for (const state of ["", "-hover", "-active"]) {
      requireContrast(tokens, "--focus-inner", `--action-primary${state}`, 3);
    }
    expect(parseFloat(resolveToken(tokens, "--focus-width"))).toBeGreaterThanOrEqual(3);
  });

  it("does not treat decorative brand accents as accessible small text", () => {
    for (const foreground of ["--brand-caramel", "--brand-golden"]) {
      expect(() => requireContrast(tokens, foreground, "--surface-primary", 4.5)).toThrow("Insufficient contrast");
    }
  });
});

describe("validator failure paths", () => {
  it("matches known WCAG reference ratios", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBe(21);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBe(1);
    expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.478, 3);
    expect(contrastRatio("#FFFFFF", "#777777")).toBeCloseTo(4.478, 3);
  });

  it("rejects a deliberately insufficient-contrast fixture without rounding it into a pass", () => {
    const fixture = readTokens(":root { --text: #777777; --surface: #FFFFFF; }");
    expect(() => requireContrast(fixture, "--text", "--surface", 4.5)).toThrow("Insufficient contrast");
  });

  it("rejects missing and unresolved references", () => {
    expect(() => resolveToken(tokens, "--missing")).toThrow("Missing token");
    expect(() => resolveToken(readTokens(":root { --text: var(--missing); }"), "--text")).toThrow("Missing token");
  });

  it("rejects cyclic aliases", () => {
    expect(() => resolveToken(readTokens(":root { --a: var(--b); --b: var(--a); }"), "--a")).toThrow("Circular token reference");
  });

  it.each(["red", "#FFF", "#GGGGGG", "rgb(0 0 0)", "#FFFFFF80", ""])("rejects unsupported color input %s", (color) => {
    expect(() => contrastRatio(color, "#FFFFFF")).toThrow("Unsupported color input");
  });

  it("rejects invalid token names and unsupported reference syntax", () => {
    expect(() => resolveToken(tokens, "text-primary")).toThrow("Invalid token name");
    expect(() => resolveToken(readTokens(":root { --a: var(--b, #FFFFFF); }"), "--a")).toThrow("Unsupported token reference");
  });

  it.each([NaN, Infinity, 0, 22])("rejects invalid contrast threshold %s", (minimum) => {
    expect(() => requireContrast(tokens, "--text-primary", "--surface-canvas", minimum)).toThrow("Invalid contrast threshold");
  });

  it("rejects missing, incomplete, and incorrectly assigned semantic mappings", () => {
    for (const replacement of [undefined, "var(--brand-caramel)", "var(--missing)"]) {
      const fixture = new Map(tokens);
      if (replacement === undefined) fixture.delete("--color-danger-foreground");
      else fixture.set("--color-danger-foreground", replacement);
      expect(() => requireMappings(fixture, mappings)).toThrow("semantic mapping");
    }
    const incomplete = new Map(tokens);
    incomplete.delete("--status-warning-surface");
    expect(() => requireMappings(incomplete, mappings)).toThrow("Missing token");
  });
});
