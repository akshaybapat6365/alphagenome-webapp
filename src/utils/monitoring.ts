export class ErrorMonitor {
  static logError(error: Error, context?: any) {
    console.error('AlphaGenome Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    })

    // In production, you would send this to a service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: context })
    }
  }

  static logEvent(event: string, data?: any) {
    console.log('AlphaGenome Event:', {
      event,
      data,
      timestamp: new Date().toISOString(),
    })

    // In production, you would send this to analytics
    if (process.env.NODE_ENV === 'production') {
      // Example: analytics.track(event, data)
    }
  }

  static logPerformance(metric: string, duration: number) {
    console.log('AlphaGenome Performance:', {
      metric,
      duration,
      timestamp: new Date().toISOString(),
    })

    // In production, you would send this to monitoring service
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: performance.mark(metric)
    }
  }
}