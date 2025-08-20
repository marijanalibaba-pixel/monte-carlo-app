// client/src/hooks/usePWAInstall.ts
import { useEffect, useMemo, useState } from "react";

type InstallOutcome = "accepted" | "dismissed" | "unavailable";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isIOSDevice() {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
  const iOSUA = /iPad|iPhone|iPod/.test(ua);
  const iPadOS13Plus = /Macintosh/.test(ua) && "ontouchend" in document;
  return iOSUA || iPadOS13Plus;
}

function isSafariBrowser() {
  const isSafariUA =
    /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent) ||
    (navigator.vendor === "Apple Computer, Inc." && !("MSStream" in window));
  return isSafariUA;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  const isStandalone = useMemo(() => {
    const mm = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
    const iosStandalone = (navigator as any).standalone === true;
    return mm || iosStandalone;
  }, []);

  const isIOS = useMemo(() => isIOSDevice(), []);
  const isSafari = useMemo(() => isSafariBrowser(), []);

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", onBIP as any);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP as any);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function promptInstall(): Promise<InstallOutcome> {
    if (!deferredPrompt) return "unavailable";
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome;
    } catch {
      setDeferredPrompt(null);
      return "dismissed";
    }
  }

  const canInstall = !!deferredPrompt && !installed && !isStandalone;

  return { canInstall, promptInstall, isStandalone, isIOS, isSafari };
}

export type { InstallOutcome };
