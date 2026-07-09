import { chromium } from "playwright";
import fs from "fs";
import path from "path";

export async function generateMarketingCard(
  title: string,
  value: string,
  outputPath: string
): Promise<string> {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
    body {
      font-family: 'Outfit', sans-serif;
    }
  </style>
</head>
<body class="bg-slate-950 text-white flex items-center justify-center w-[1080px] h-[1080px] overflow-hidden relative">
  <!-- Glowing background elements -->
  <div class="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] top-[-100px] left-[-100px]"></div>
  <div class="absolute w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px] bottom-[-150px] right-[-150px]"></div>
  
  <!-- Content Card -->
  <div class="w-[900px] h-[900px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[48px] p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl">
    
    <!-- Header Branding -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span class="text-2xl font-black text-slate-950">⚡</span>
        </div>
        <span class="text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">CHATURBO</span>
      </div>
      <div class="bg-slate-800/80 px-5 py-2.5 rounded-full border border-slate-700/50">
        <span class="text-sm font-semibold tracking-wide text-cyan-400 uppercase">Lead Rescue SaaS</span>
      </div>
    </div>

    <!-- Center Stat Block -->
    <div class="my-auto flex flex-col items-center text-center">
      <span class="text-lg font-bold tracking-[0.25em] text-cyan-400 uppercase mb-4">Chaturbo Industry Report</span>
      <h1 class="text-[140px] font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-300 to-violet-400 drop-shadow-sm select-none">
        ${value}
      </h1>
      <p class="text-4xl font-extrabold text-slate-100 max-w-[700px] mt-6 leading-tight">
        ${title}
      </p>
      <div class="w-24 h-1.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full mt-8"></div>
    </div>

    <!-- Bottom Footer Call to Action -->
    <div class="flex items-end justify-between border-t border-slate-800/80 pt-10">
      <div>
        <p class="text-slate-400 text-lg">Never miss another customer call</p>
        <p class="text-white text-xl font-bold mt-1">Get instant qualified SMS responses 24/7</p>
      </div>
      <div class="text-right">
        <p class="text-slate-400 text-lg">Learn more at</p>
        <p class="text-cyan-400 text-2xl font-black tracking-wide">chaturbo.com</p>
      </div>
    </div>

  </div>
</body>
</html>
  `;

  // Start Playwright headless browser
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.setContent(htmlContent);
    // Wait for external Google Font load
    await page.waitForTimeout(1000); 
    await page.screenshot({ path: outputPath, type: "png" });
    return outputPath;
  } finally {
    await browser.close();
  }
}
