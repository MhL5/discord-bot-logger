import { getColors } from "@/app/theme/utils";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopyButton() {
  const [mounted, setMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleClick() {
    try {
      const colors = getColors();
      await navigator.clipboard.writeText(colors);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return (
    <>
      {mounted && (
        <Button
          onClick={handleClick}
          className="fixed top-4 right-4 z-50"
          size="lg"
          disabled={isCopied}
        >
          <CardHeader className="flex-row gap-2 items-center justify-center">
            <CardTitle>{isCopied ? "Copied!" : "Copy Colors"}</CardTitle>
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </CardHeader>
        </Button>
      )}
    </>
  );
}
