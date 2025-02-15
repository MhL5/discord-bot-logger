"use client";

import CopyButton from "@/app/theme/CopyButton";
import {
  cssVars,
  cssVarsInfo,
  getInitialColor,
  hexToHSL,
  hslToHex,
} from "@/app/theme/utils";
import { CardsDemo } from "@/components/cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-dvh p-4 bg-background" id="theme-page">
      <CopyButton />

      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-xl font-bold mb-5">
            Shadcn Theme Helper
          </CardTitle>
          <ul className="grid gap-3">
            {cssVarsInfo.map(({ description, label }, i) => {
              return (
                <li
                  className="flex items-center justify-start gap-3"
                  key={`${description}-${i}-${i}`}
                >
                  <CardTitle>{label}:</CardTitle>
                  <CardDescription>{description} </CardDescription>
                </li>
              );
            })}
          </ul>
        </CardHeader>
        <CardContent>
          {mounted && (
            <div className="flex flex-col  starting:opacity-0 transition-all duration-300 p-4  w-fit mr-auto gap-5">
              <div className="flex flex-wrap gap-8">
                {cssVars.map((cssVarName, i) => {
                  return (
                    <ColorInput
                      cssVarName={cssVarName}
                      key={`Page-${cssVarName}-${i}`}
                    />
                  );
                })}
              </div>
              <CardsDemo />
            </div>
          )}
        </CardContent>
      </Card>
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
    const tailwindVarFormat = hslColor
      .replaceAll("hsl(", "")
      .replaceAll(")", "")
      .replaceAll(",", "");

    document.documentElement.style.setProperty(
      `--${cssVarName}`,
      tailwindVarFormat
    );
  }, [hslColor, color, cssVarName]);

  return (
    <div className="flex flex-col items-start justify-start gap-1 border-2 h-fit border-black px-5 rounded-lg py-3">
      <input
        type="text"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
        }}
        className="w-full h-10 border"
      />
      <input
        type="color"
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
