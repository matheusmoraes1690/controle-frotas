16:50:18.124 Running build in Portland, USA (West) – pdx1
16:50:18.125 Build machine configuration: 2 cores, 8 GB
16:50:18.258 Cloning github.com/matheusmoraes1690/controle-frotas (Branch: main, Commit: 3a0926e)
16:50:18.806 Cloning completed: 548.000ms
16:50:18.897 Restored build cache from previous deployment (ef3zNY5pGyfqYzMUsbiNq8NBQMhd)
16:50:19.576 Running "vercel build"
16:50:20.060 Vercel CLI 50.1.3
16:50:20.707 Installing dependencies...
16:50:22.305 
16:50:22.306 added 9 packages, and changed 2 packages in 1s
16:50:22.306 
16:50:22.306 65 packages are looking for funding
16:50:22.307   run `npm fund` for details
16:50:22.339 Running "npm run build"
16:50:22.431 
16:50:22.432 > rest-express@1.0.0 build
16:50:22.433 > tsx script/build.ts
16:50:22.433 
16:50:23.663 building client...
16:50:23.766 [36mvite v5.4.20 [32mbuilding for production...[36m[39m
16:50:24.028 transforming...
16:50:25.848 
16:50:25.848 A PostCSS plugin did not pass the `from` option to `postcss.parse`. This may cause imported assets to be incorrectly transformed. If you've recently added a PostCSS plugin that raised this warning, please contact the package author to fix the issue.
16:50:32.932 [32m✓[39m 3524 modules transformed.
16:50:33.437 rendering chunks...
16:50:33.879 computing gzip size...
16:50:33.922 [2m../dist/public/[22m[32mindex.html                          [39m[1m[2m  2.18 kB[22m[1m[22m[2m │ gzip:   0.85 kB[22m
16:50:33.922 [2m../dist/public/[22m[2massets/[22m[35mleaflet-Dgihpmma.css         [39m[1m[2m 15.04 kB[22m[1m[22m[2m │ gzip:   6.38 kB[22m
16:50:33.922 [2m../dist/public/[22m[2massets/[22m[35mindex-DnJ--3bS.css           [39m[1m[2m 85.92 kB[22m[1m[22m[2m │ gzip:  13.88 kB[22m
16:50:33.923 [2m../dist/public/[22m[2massets/[22m[36mlabel-CQmCaiWE.js            [39m[1m[2m  0.48 kB[22m[1m[22m[2m │ gzip:   0.34 kB[22m
16:50:33.923 [2m../dist/public/[22m[2massets/[22m[36minput-D1c0UQGG.js            [39m[1m[2m  0.61 kB[22m[1m[22m[2m │ gzip:   0.42 kB[22m
16:50:33.923 [2m../dist/public/[22m[2massets/[22m[36mskeleton-Bfx6NcXR.js         [39m[1m[2m  1.09 kB[22m[1m[22m[2m │ gzip:   0.53 kB[22m
16:50:33.923 [2m../dist/public/[22m[2massets/[22m[36mtabs-B2O-KuRa.js             [39m[1m[2m  1.35 kB[22m[1m[22m[2m │ gzip:   0.56 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mscroll-area-DkOt3Jdf.js      [39m[1m[2m  1.54 kB[22m[1m[22m[2m │ gzip:   0.55 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mnot-found-BFJJGTCf.js        [39m[1m[2m  1.58 kB[22m[1m[22m[2m │ gzip:   0.58 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mcard-CaO9kDeq.js             [39m[1m[2m  1.73 kB[22m[1m[22m[2m │ gzip:   0.51 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mdialog-CYhfTQPI.js           [39m[1m[2m  3.46 kB[22m[1m[22m[2m │ gzip:   1.01 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mselect-B7IJdfoz.js           [39m[1m[2m  5.27 kB[22m[1m[22m[2m │ gzip:   1.33 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mrouter-BU4Y7SqT.js           [39m[1m[2m  6.19 kB[22m[1m[22m[2m │ gzip:   3.04 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mforgot-password-DHwXm_gA.js  [39m[1m[2m  6.21 kB[22m[1m[22m[2m │ gzip:   1.77 kB[22m
16:50:33.924 [2m../dist/public/[22m[2massets/[22m[36mreset-password-CLRSltHH.js   [39m[1m[2m  7.03 kB[22m[1m[22m[2m │ gzip:   1.76 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36malerts-D67RLTF5.js           [39m[1m[2m 13.32 kB[22m[1m[22m[2m │ gzip:   2.81 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mlogin-DefCz7Ks.js            [39m[1m[2m 16.32 kB[22m[1m[22m[2m │ gzip:   2.64 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mlucide-Bbg6ZQM6.js           [39m[1m[2m 20.95 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mhistory-DlRGvNXv.js          [39m[1m[2m 22.66 kB[22m[1m[22m[2m │ gzip:   4.13 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mreports-DZRDalwM.js          [39m[1m[2m 23.88 kB[22m[1m[22m[2m │ gzip:   3.65 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mdate-fns-Duqrn5Bu.js         [39m[1m[2m 29.11 kB[22m[1m[22m[2m │ gzip:   7.87 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mpopover-DxtjEdaW.js          [39m[1m[2m 33.95 kB[22m[1m[22m[2m │ gzip:  10.78 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mgeofences-BPjYLTuj.js        [39m[1m[2m 36.79 kB[22m[1m[22m[2m │ gzip:   5.85 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mreact-query-Be5BKFnD.js      [39m[1m[2m 39.70 kB[22m[1m[22m[2m │ gzip:  12.07 kB[22m
16:50:33.925 [2m../dist/public/[22m[2massets/[22m[36mvehicles-BVueV92Z.js         [39m[1m[2m 41.30 kB[22m[1m[22m[2m │ gzip:   5.89 kB[22m
16:50:33.926 [2m../dist/public/[22m[2massets/[22m[36mdashboard-Cx30zU9D.js        [39m[1m[2m 47.90 kB[22m[1m[22m[2m │ gzip:   8.04 kB[22m
16:50:33.926 [2m../dist/public/[22m[2massets/[22m[36mradix-ui-BCrVCFlV.js         [39m[1m[2m107.49 kB[22m[1m[22m[2m │ gzip:  33.99 kB[22m
16:50:33.926 [2m../dist/public/[22m[2massets/[22m[36mleaflet-BWwBGnAB.js          [39m[1m[2m156.06 kB[22m[1m[22m[2m │ gzip:  45.60 kB[22m
16:50:33.926 [2m../dist/public/[22m[2massets/[22m[36mindex-DhMMKgLM.js            [39m[1m[2m228.80 kB[22m[1m[22m[2m │ gzip:  60.37 kB[22m
16:50:33.926 [2m../dist/public/[22m[2massets/[22m[36mreact-vendor-CkkVRgNk.js     [39m[1m[2m363.88 kB[22m[1m[22m[2m │ gzip: 112.99 kB[22m
16:50:33.926 [2m../dist/public/[22m[2massets/[22m[36mrecharts-Mnzdm-YV.js         [39m[1m[2m385.87 kB[22m[1m[22m[2m │ gzip: 107.71 kB[22m
16:50:33.928 [32m✓ built in 9.94s[39m
16:50:33.929 building server...
16:50:34.078 
16:50:34.079   dist/index.cjs  961.6kb
16:50:34.079 
16:50:34.080 ⚡ Done in 139ms
16:50:34.255 Build Completed in /vercel/output [14s]
16:50:34.399 Deploying outputs...
16:50:36.499 Deployment completed
16:50:37.410 Creating build cache...
16:50:50.098 Created build cache: 12.683s
16:50:50.098 Uploading build cache [79.29 MB]
16:50:51.002 Build cache uploaded: 908.114ms// Carrega variáveis de ambiente PRIMEIRO (antes de qualquer outro import)
import 'dotenv/config';

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { registerAuthRoutes } from "./auth-routes";
import { registerTrackingRoutes } from "./tracking-routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { fileURLToPath } from "url";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

export const setupServer = async () => {
  // Aguarda inicialização do storage
  const { initPromise } = await import('./storage');
  await initPromise;
  
  // Registra rotas de autenticação (apenas se Supabase configurado)
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    registerAuthRoutes(app);
    log('Auth routes registered (Supabase configured)');
  }
  
  // Registra rotas de rastreamento (requer TRACKING_API_KEY)
  if (process.env.TRACKING_API_KEY) {
    registerTrackingRoutes(app);
    log('Tracking routes registered');
  } else {
    log('Tracking routes disabled (TRACKING_API_KEY not set)');
  }
  
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    serveStatic(app);
  } else if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }
  
  return app;
};

// Check if direct execution
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url) || process.argv[1].endsWith('index.ts');

if (isMainModule) {
  (async () => {
    await setupServer();

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);
    const listenOptions: { port: number; host: string; reusePort?: boolean } = {
      port,
      host: "0.0.0.0",
    };

    // reusePort não é suportado no Windows
    if (process.platform !== "win32") {
      listenOptions.reusePort = true;
    }

    httpServer.listen(listenOptions, () => {
      log(`serving on port ${port}`);
    });
  })();
}

export { app, httpServer };
