export function hexToHSL(hex: string) {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find min and max values to get lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
}

export function hslToHex(hsl: string): string {
  // Extract H, S, and L values from the string
  const [h, s, l] = hsl
    .split(" ")
    .map((value) =>
      value.includes("%") ? parseFloat(value) / 100 : parseFloat(value)
    );

  // Convert HSL to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    b = x;
  }

  // Convert RGB to hex
  const toHex = (value: number) => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.padStart(2, "0");
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getInitialColor({ cssVarName }: { cssVarName: string }) {
  const computedStyle = getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue(`--${cssVarName}`).trim();
}

export const cssVars = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted-foreground",
  "destructive",
  "border",
];

export const cssVarsInfo = [
  {
    label: "Background",
    description: "Defines the background color of the application.",
  },
  {
    label: "Foreground",
    description: "Sets the foreground (text) color for general content.",
  },
  {
    label: "Primary",
    description:
      "The main brand color used for primary actions and highlights.",
  },
  {
    label: "Primary Foreground",
    description:
      "Text color that contrasts well against the primary background.",
  },
  {
    label: "Secondary",
    description: "A secondary color used for less prominent elements.",
  },
  {
    label: "Secondary Foreground",
    description:
      "Text color that contrasts well against the secondary background.",
  },
  {
    label: "Muted Foreground",
    description: "Used for subdued text, such as placeholder text or hints.",
  },
  {
    label: "Destructive",
    description: "Color used for destructive actions, like delete buttons.",
  },
  {
    label: "Border",
    description: "Defines the default border color for elements.",
  },
];
