import * as Sentry from "@sentry/nextjs";

type LogAttributes = Record<string, string | number | boolean | null | undefined>;

/**
 * Structured logger integrated with Sentry Logs.
 * Emits queryable structured log events with attributes into Sentry.
 */
export const logger = {
  trace(message: string, attributes?: LogAttributes) {
    if (Sentry.logger?.trace) {
      Sentry.logger.trace(message, attributes as Record<string, unknown>);
    } else {
      console.trace(message, attributes);
    }
  },

  debug(message: string, attributes?: LogAttributes) {
    if (Sentry.logger?.debug) {
      Sentry.logger.debug(message, attributes as Record<string, unknown>);
    } else {
      console.debug(message, attributes);
    }
  },

  info(message: string, attributes?: LogAttributes) {
    if (Sentry.logger?.info) {
      Sentry.logger.info(message, attributes as Record<string, unknown>);
    } else {
      console.info(message, attributes);
    }
  },

  warn(message: string, attributes?: LogAttributes) {
    if (Sentry.logger?.warn) {
      Sentry.logger.warn(message, attributes as Record<string, unknown>);
    } else {
      console.warn(message, attributes);
    }
  },

  error(message: string, attributes?: LogAttributes) {
    if (Sentry.logger?.error) {
      Sentry.logger.error(message, attributes as Record<string, unknown>);
    } else {
      console.error(message, attributes);
    }
  },

  fatal(message: string, attributes?: LogAttributes) {
    if (Sentry.logger?.fatal) {
      Sentry.logger.fatal(message, attributes as Record<string, unknown>);
    } else {
      console.error(`[FATAL] ${message}`, attributes);
    }
  },

  /**
   * Set global or transaction-wide attributes queryable across all logs and traces
   */
  setAttributes(attributes: Record<string, string | number | boolean>) {
    Sentry.setAttributes(attributes);
  },
};

