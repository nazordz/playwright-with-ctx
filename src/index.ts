import "dotenv/config";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

async function main() {
  chromium.use(stealth());

  const browser = await chromium.launch({
    
    headless: false,
    args: [
      "--disable-web-security",
      "--no-sandbox",
      "--autoplay-policy=user-gesture-required",
      "--disable-dev-shm-usage",
      "--disable-component-update",
      "--disable-features=ImprovedCookieControls,LazyFrameLoading,GlobalMediaControls,DestroyProfileOnBrowserClose,MediaRouter,DialMediaRouteProvider,AcceptCHFrame,AutoExpandDetailsElement,CertificateTransparencyComponentUpdater,AvoidUnnecessaryBeforeUnloadCheckSync,Translate",
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    storageState: './src/assets/context.json',
    locale: "en-US",
    permissions: ["notifications"],
    viewport: { width: 1366, height: 768 },
  }); 
  const page = await context.newPage(); 
  await page.goto("https://www.instagram.com/");
}

main();
