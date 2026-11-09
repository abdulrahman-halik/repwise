// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [
    // Session Replay integration: records DOM events, console logs, network breadcrumbs
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
      maskAllInputs: true,
    }),
    // Structured console logging -> Sentry Logs
    Sentry.consoleLoggingIntegration({
      levels: ["log", "info", "warn", "error"],
    }),
  ],

  // Tracing & Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  tracePropagationTargets: ["localhost", /^\//],

  // Session Replay Sample Rates
  // replaysSessionSampleRate: samples general sessions (100% in dev, 10% in prod)
  replaysSessionSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  // replaysOnErrorSampleRate: 100% replay capture when an unhandled error occurs
  replaysOnErrorSampleRate: 1.0,

  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
