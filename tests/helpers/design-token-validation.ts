import postcss from "postcss";

export type Tokens = Map<string, string>;

/** Parse CSS declarations, including Tailwind's CSS-first @theme blocks. */
export function readTokens(css: string): Tokens {
  const tokens: Tokens = new Map();
  postcss.parse(css).walkDecls((declaration) => {
    if (declaration.prop.startsWith("--") && !declaration.prop.includes("*")) {
      tokens.set(declaration.prop, declaration.value);
    }
  });
  return tokens;
}

export function resolveToken(tokens: Tokens, name: string, trail: string[] = []): string {
  if (!/^--[\w-]+$/.test(name)) throw new Error(`Invalid token name: ${name}`);
  if (trail.includes(name)) throw new Error(`Circular token reference: ${[...trail, name].join(" -> ")}`);
  const value = tokens.get(name);
  if (!value) throw new Error(`Missing token: ${name}`);
  const resolved = value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_match, reference: string) =>
    resolveToken(tokens, reference, [...trail, name]),
  );
  // This test helper intentionally supports plain aliases, not CSS fallback/calc evaluation.
  if (resolved.includes("var(")) throw new Error(`Unsupported token reference: ${name}`);
  return resolved;
}

function luminance(color: string): number {
  // The project color source uses opaque six-digit sRGB hex primitives.
  if (!/^#[\da-f]{6}$/i.test(color)) throw new Error(`Unsupported color input: ${color}`);
  const channels = [1, 3, 5].map((offset) => {
    const channel = parseInt(color.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function requireContrast(tokens: Tokens, foreground: string, background: string, minimum: number): number {
  if (!Number.isFinite(minimum) || minimum < 1 || minimum > 21) {
    throw new Error(`Invalid contrast threshold: ${minimum}`);
  }
  const ratio = contrastRatio(resolveToken(tokens, foreground), resolveToken(tokens, background));
  if (ratio < minimum) {
    throw new Error(`Insufficient contrast: ${foreground} / ${background} = ${ratio.toFixed(3)}:1; requires ${minimum}:1`);
  }
  return ratio;
}

export function requireMappings(tokens: Tokens, mappings: Record<string, string>): void {
  for (const [utility, semantic] of Object.entries(mappings)) {
    if (tokens.get(utility) !== `var(${semantic})`) {
      throw new Error(`Missing or incorrect semantic mapping: ${utility} -> ${semantic}`);
    }
    resolveToken(tokens, utility);
  }
}
