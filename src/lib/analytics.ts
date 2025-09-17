// Analytics and User Tracking
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

class Analytics {
  private isEnabled: boolean = false;
  private userId: string | null = null;
  private sessionId: string = this.generateSessionId();

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private initializeAnalytics() {
    if (typeof window !== 'undefined' && this.isEnabled) {
      // Initialize Google Analytics if available
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID';
      if (typeof gtag !== 'undefined' && gaId !== 'GA_MEASUREMENT_ID') {
        try {
          gtag('config', gaId, {
            page_title: 'BingoBest',
            page_location: window.location.href,
          });
        } catch (error) {
          console.warn('Failed to initialize Google Analytics:', error);
        }
      }
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
    if (this.isEnabled && typeof gtag !== 'undefined') {
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID';
      if (gaId !== 'GA_MEASUREMENT_ID') {
        try {
          gtag('config', gaId, {
            user_id: userId,
          });
        } catch (error) {
          console.warn('Failed to set user ID in Google Analytics:', error);
        }
      }
    }
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      userId: this.userId || undefined,
    };

    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID';
      if (gaId !== 'GA_MEASUREMENT_ID') {
        try {
          gtag('event', event, {
            event_category: properties?.category || 'General',
            event_label: properties?.label || '',
            value: properties?.value || 0,
            custom_map: properties,
          });
        } catch (error) {
          console.warn('Failed to send event to Google Analytics:', error);
        }
      }
    }

    // Send to custom analytics endpoint
    this.sendToCustomAnalytics(analyticsEvent);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent) {
    try {
      // In a real app, you'd send this to your analytics service
      // For now, we'll just log it
      console.log('Custom Analytics:', event);
      
      // Example: Send to Supabase
      // await supabase.from('analytics_events').insert(event);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Game-specific tracking methods
  trackGameStart(roomId: string, roomName: string) {
    this.track('game_start', {
      category: 'Game',
      roomId,
      roomName,
      label: 'Game Started',
    });
  }

  trackGameEnd(roomId: string, roomName: string, duration: number, won: boolean) {
    this.track('game_end', {
      category: 'Game',
      roomId,
      roomName,
      duration,
      won,
      label: won ? 'Game Won' : 'Game Lost',
    });
  }

  trackBingoWin(winType: string, prize: number) {
    this.track('bingo_win', {
      category: 'Game',
      winType,
      prize,
      label: `${winType} Win`,
      value: prize,
    });
  }

  trackPayment(amount: number, method: string) {
    this.track('payment', {
      category: 'Ecommerce',
      amount,
      method,
      label: 'Payment Processed',
      value: amount,
    });
  }

  trackPowerUpPurchase(powerUpId: string, cost: number) {
    this.track('powerup_purchase', {
      category: 'Ecommerce',
      powerUpId,
      cost,
      label: 'Power-Up Purchased',
      value: cost,
    });
  }

  trackPageView(page: string) {
    this.track('page_view', {
      category: 'Navigation',
      page,
      label: 'Page Viewed',
    });
  }

  trackUserAction(action: string, details?: Record<string, any>) {
    this.track('user_action', {
      category: 'User',
      action,
      ...details,
      label: `User ${action}`,
    });
  }

  trackError(error: string, context?: string) {
    this.track('error', {
      category: 'Error',
      error,
      context,
      label: 'Error Occurred',
    });
  }

  trackAchievement(achievementId: string, achievementName: string) {
    this.track('achievement', {
      category: 'Achievement',
      achievementId,
      achievementName,
      label: 'Achievement Unlocked',
    });
  }

  trackTournamentJoin(tournamentId: string, entryFee: number) {
    this.track('tournament_join', {
      category: 'Tournament',
      tournamentId,
      entryFee,
      label: 'Tournament Joined',
      value: entryFee,
    });
  }

  trackSocialAction(action: string, targetUserId?: string) {
    this.track('social_action', {
      category: 'Social',
      action,
      targetUserId,
      label: `Social ${action}`,
    });
  }
}

// Lazy initialization to avoid circular dependencies
let _analytics: Analytics | null = null;

export const getAnalytics = () => {
  if (!_analytics) {
    _analytics = new Analytics();
  }
  return _analytics;
};

// For backward compatibility
export const analytics = new Proxy({} as Analytics, {
  get(target, prop) {
    return getAnalytics()[prop as keyof Analytics];
  }
});

// Export individual tracking functions for convenience
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties);
};

export const trackGameStart = (roomId: string, roomName: string) => {
  analytics.trackGameStart(roomId, roomName);
};

export const trackGameEnd = (roomId: string, roomName: string, duration: number, won: boolean) => {
  analytics.trackGameEnd(roomId, roomName, duration, won);
};

export const trackBingoWin = (winType: string, prize: number) => {
  analytics.trackBingoWin(winType, prize);
};

export const trackPayment = (amount: number, method: string) => {
  analytics.trackPayment(amount, method);
};

export const trackPageView = (page: string) => {
  analytics.trackPageView(page);
};

export const trackUserAction = (action: string, details?: Record<string, any>) => {
  analytics.trackUserAction(action, details);
};

export const trackError = (error: string, context?: string) => {
  analytics.trackError(error, context);
};

export default analytics;
