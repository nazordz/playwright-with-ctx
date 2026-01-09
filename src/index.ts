import "dotenv/config";
import { chromium } from "playwright-extra";
import puppeteerStealth from "puppeteer-extra-plugin-stealth";
const stealth = puppeteerStealth();
stealth.enabledEvasions.delete('viewport');
stealth.enabledEvasions.delete('iframe.contentWindow');
import { PlaywrightBlocker } from "@ghostery/adblocker-playwright";

async function main() {
  chromium.use(stealth);

  const browser = await chromium.launch({
    channel: 'chrome',
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
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    locale: "en-US",
    permissions: ["notifications"],
    viewport: { width: 1366, height: 768 },
  }); 
  const page = await context.newPage(); 

  // initScript
 await context.addInitScript(`
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};

    Object.defineProperty(window, 'chrome', {
      value: undefined,
    });

    delete window.chrome?.loadTimes;
    delete window.chrome?.runtime;

    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      if (param === 37445) return 'Intel Inc.';
      if (param === 37446) return 'Intel Iris OpenGL Engine';
      return getParameter.call(this, param);
    };
  `);

  // ads blocker
  const blocker = await PlaywrightBlocker.fromLists(fetch, [
    "https://easylist.to/easylist/easylist.txt"
  ]);
  await blocker.enableBlockingInPage(page);
  await page.goto("https://www.instagram.com/");
}

main();
