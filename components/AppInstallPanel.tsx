"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, ExternalLink, Share, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function AppInstallPanel() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const ua = window.navigator.userAgent.toLowerCase();

    setIsInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/.test(ua));
    setIsSecure(window.isSecureContext);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome !== "dismissed") {
      setInstallEvent(null);
    }
  }

  return (
    <section className="rounded-lg border border-oat bg-paper p-4 shadow-soft md:p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-night text-mint">
          <Smartphone className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-moss">Install app</p>
          <h2 className="text-2xl font-bold text-ink">Add QuoteGuard to your phone</h2>
        </div>
      </div>

      {isInstalled ? (
        <p className="mt-4 flex items-center gap-2 rounded-md bg-mint/35 p-3 text-sm font-bold text-moss">
          <CheckCircle2 className="h-4 w-4" />
          QuoteGuard is already installed on this device.
        </p>
      ) : installEvent ? (
        <button type="button" onClick={install} className="mt-4 inline-flex items-center gap-2 rounded-md bg-clay px-4 py-3 font-bold text-white">
          <Download className="h-4 w-4" />
          Install QuoteGuard
        </button>
      ) : (
        <div className="mt-4 space-y-3 text-sm leading-6 text-slateWarm">
          {!isSecure && (
            <p className="rounded-md bg-clay/10 p-3 font-bold text-clay">
              Install requires the deployed HTTPS site. It will not appear from an insecure URL.
            </p>
          )}
          {isIos ? (
            <div className="rounded-md bg-linen p-3">
              <p className="font-bold text-ink">iPhone / Safari</p>
              <p className="mt-1 flex gap-2">
                <Share className="mt-1 h-4 w-4 shrink-0 text-clay" />
                Tap Share, then choose Add to Home Screen.
              </p>
            </div>
          ) : (
            <div className="rounded-md bg-linen p-3">
              <p className="font-bold text-ink">Android / Chrome</p>
              <p className="mt-1 flex gap-2">
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-clay" />
                Open the browser menu and choose Install app or Add to Home screen.
              </p>
            </div>
          )}
          <p>
            Some browsers hide the install prompt until the site is loaded over HTTPS, the service worker is active, and the app is not already installed.
          </p>
        </div>
      )}
    </section>
  );
}
