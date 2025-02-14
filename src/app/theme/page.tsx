"use client";

import { cssColorVars } from "@/app/theme/constants";
import { getInitialColor, hexToHSL, hslToHex } from "@/app/theme/utils";
import { useEffect, useState } from "react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-dvh p-4 bg-background">
      <div className="grid p-4 grid-cols-1 w-fit mr-auto gap-5">
        {mounted && (
          <>
            {cssColorVars.map((cssVarName, i) => {
              return (
                <ColorInput
                  cssVarName={cssVarName}
                  key={`Page-${cssVarName}-${i}`}
                />
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}

function ColorInput({ cssVarName }: { cssVarName: string }) {
  const [color, setColor] = useState(() => {
    return hslToHex(getInitialColor({ cssVarName }));
  });
  const [hslColor, setHslColor] = useState(() => {
    return getInitialColor({ cssVarName });
  });

  useEffect(() => {
    setHslColor(hexToHSL(color));

    document.documentElement.style.setProperty(`--${cssVarName}`, color);
  }, [color, cssVarName]);

  return (
    <div className="flex flex-col items-start justify-start gap-1 border-2 border-black px-5 rounded-lg py-3">
      <input
        type="color"
        id="color-input-1234"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
        }}
        className="w-full h-10 border"
      />

      <div
        className="font-bold text-base"
        // eslint-disable-next-line react/jsx-no-comment-textnodes
      >
        /*{" "}
        <span
          style={{
            backgroundColor: `${color}`,
          }}
        >
          {color}
        </span>{" "}
        */
      </div>
      <div className="flex items-center justify-start gap-2 w-full">
        <div className="py-2 rounded-md font-bold text-base">{cssVarName}:</div>
        <div
          className="px-1.5 py-1 rounded-md"
          style={{
            backgroundColor: `${hslColor}`,
          }}
        >
          {hslColor}
        </div>
      </div>

      <div className="flex items-center justify-start gap-2 w-full">
        <div className="py-2 rounded-md font-bold text-base">
          --{cssVarName}:
        </div>
        <div
          className="px-1.5 py-1 rounded-md"
          style={{
            backgroundColor: `${hslColor}`,
          }}
        >
          {hslColor.replaceAll(",", " ")}
        </div>
      </div>
    </div>
  );
}
