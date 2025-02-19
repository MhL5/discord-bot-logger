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
      <CopyButton className="fixed bottom-4 right-4 z-50" />

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
            <div>
              <div className="flex flex-col  starting:opacity-0 transition-all duration-300 p-4 bg-gray-500 text-gray-100  w-fit mr-auto gap-5 rounded-sm mb-8">
                {cssVars.map((cssVarName, i) => {
                  return (
                    <ColorInput
                      cssVarName={cssVarName}
                      key={`Page-${cssVarName}-${i}`}
                    />
                  );
                })}
                <CopyButton />
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
    <>
      <div className="flex items-center justify-start gap-2">
        {cssVarName}:{" "}
        <label
          htmlFor={`${cssVarName}--`}
          className="p-4 rounded-[5px] shrink-0"
          style={{
            background: `${color}`,
          }}
        />
        <input
          type="color"
          value={color}
          id={`${cssVarName}--`}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          className="hidden"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          className="bg-gray-900 w-fit py-1 rounded-[5px] text-sm px-2"
        />
      </div>
    </>
  );
}
