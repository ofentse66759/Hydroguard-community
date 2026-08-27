/**
 * POPIA Compliance & Data Privacy Module
 * Manages user consent, data collection preferences, and privacy-related features
 * Compliant with Protection of Personal Information Act (South Africa)
 */

// ===== POPIA CONFIGURATION =====
const POPIA_CONFIG = {
  storageKey: 'hydroguard_popia_consent',
  consentVersion: '1.0',
  requiredConsents: ['essential', 'analytics', 'marketing'],
  cookieExpiry: 365 // days
};

// ===== CONSENT MANAGEMENT =====
class POPIACompliance {
  constructor() {
    this.userConsent = this.loadConsent();
    this.initConsentBanner();
  }

  /**
   * Load stored user consent preferences
   */
  loadConsent() {
    const stored = localStorage.getItem(POPIA_CONFIG.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return this.getDefaultConsent();
      }
    }
    return this.getDefaultConsent();
  }

  /**
   * Get default consent configuration
   */
  getDefaultConsent() {
    return {
      version: POPIA_CONFIG.consentVersion,
      timestamp: new Date().toISOString(),
      consents: {
        essential: true,  // Always required for basic functionality
        analytics: false, // User opt-in for analytics
        marketing: false, // User opt-in for marketing
        location: false   // User opt-in for location data
      },
      dataMinimization: {
        phoneNumbersEncrypted: true,
        emailsEncrypted: true,
        locationDataNeverStored: true,
        dataRetentionDays: 90
      }
    };
  }

  /**
   * Save user consent preferences
   */
  saveConsent(consents) {
    this.userConsent = {
      version: POPIA_CONFIG.consentVersion,
      timestamp: new Date().toISOString(),
      consents: consents,
      dataMinimization: this.userConsent.dataMinimization
    };
    localStorage.setItem(POPIA_CONFIG.storageKey, JSON.stringify(this.userConsent));
  }

  /**
   * Check if user has given specific consent
   */
  hasConsent(type) {
    return this.userConsent.consents[type] === true;
  }

  /**
   * Initialize the consent banner
   */
  initConsentBanner() {
    // Only show banner if user hasn't made a choice yet
    const hasExplicitChoice = localStorage.getItem(POPIA_CONFIG.storageKey);
    if (!hasExplicitChoice) {
      this.showConsentBanner();
    }
  }

  /**
   * Display the consent management banner
   */
  showConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'popiaBanner';
    banner.className = 'fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-amber-500 z-40 shadow-2xl';
    banner.innerHTML = `
      <div class="max-w-6xl mx-auto p-4 space-y-4">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex-1 min-w-64">
            <h3 class="text-sm font-bold text-amber-400 mb-2">
              <i class="fa-solid fa-shield-halved mr-2"></i>Your Privacy Matters
            </h3>
            <p class="text-xs text-stone-300 mb-3">
              HydroGuard is POPIA-compliant and respects your privacy. We collect only essential data to provide flood alerts and emergency services. 
              Location data is <strong>never stored on our servers</strong> — it's used only in your browser to sort nearby safe zones when you explicitly request it.
            </p>
            <p class="text-xs text-stone-400">
              <i class="fa-solid fa-info-circle mr-1"></i>
              By using HydroGuard, you agree to our <a href="#" class="text-amber-400 hover:underline" onclick="showPrivacyPolicy()">Privacy Policy</a> and 
              <a href="#" class="text-amber-400 hover:underline" onclick="showTermsOfService()">Terms of Service</a>.
            </p>
          </div>
          <div class="flex gap-2 flex-wrap justify-end">
            <button onclick="popiaMgr.acceptAll()" class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap">
              Accept All
            </button>
            <button onclick="popiaMgr.acceptEssential()" class="bg-stone-700 hover:bg-stone-600 text-stone-300 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap">
              Essential Only
            </button>
            <button onclick="popiaMgr.showDetailedSettings()" class="bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap">
              Customize
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }

  /**
   * Accept all consents
   */
  acceptAll() {
    this.saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      location: true
    });
    this.hideConsentBanner();
    this.logConsent('all');
  }

  /**
   * Accept only essential consents
   */
  acceptEssential() {
    this.saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      location: false
    });
    this.hideConsentBanner();
    this.logConsent('essential');
  }

  /**
   * Show detailed consent settings
   */
  showDetailedSettings() {
    const modal = document.createElement('div');
    modal.id = 'popiaDetailedModal';
    modal.className = 'fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
      <div class="bg-stone-800 rounded-2xl border border-stone-700 max-w-2xl w-full max-h-96 overflow-y-auto" onclick="event.stopPropagation()">
        <div class="p-5 border-b border-stone-700 flex items-center justify-between sticky top-0 bg-stone-800">
          <h3 class="text-lg font-bold"><i class="fa-solid fa-cog text-amber-400 mr-2"></i>Privacy Settings</h3>
          <button onclick="document.getElementById('popiaDetailedModal').remove()" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark text-2xl"></i></button>
        </div>
        
        <div class="p-5 space-y-4">
          <div class="space-y-3">
            <!-- Essential -->
            <div class="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-semibold text-stone-200 flex items-center gap-2">
                  <input type="checkbox" checked disabled class="rounded">
                  Essential Services
                </label>
                <span class="text-xs text-amber-400">Required</span>
              </div>
              <p class="text-xs text-stone-400">Necessary for flood alerts, authentication, and emergency services. Always active.</p>
            </div>

            <!-- Analytics -->
            <div class="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-semibold text-stone-200 flex items-center gap-2">
                  <input type="checkbox" id="analyticsConsent" ${this.userConsent.consents.analytics ? 'checked' : ''} onchange="popiaMgr.updateConsent('analytics', this.checked)" class="rounded">
                  Analytics
                </label>
              </div>
              <p class="text-xs text-stone-400">Helps us improve the app. Data is anonymized and never shared with third parties.</p>
            </div>

            <!-- Marketing -->
            <div class="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-semibold text-stone-200 flex items-center gap-2">
                  <input type="checkbox" id="marketingConsent" ${this.userConsent.consents.marketing ? 'checked' : ''} onchange="popiaMgr.updateConsent('marketing', this.checked)" class="rounded">
                  Marketing Communications
                </label>
              </div>
              <p class="text-xs text-stone-400">Receive updates about new features and safety tips (you can unsubscribe anytime).</p>
            </div>

            <!-- Location -->
            <div class="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-semibold text-stone-200 flex items-center gap-2">
                  <input type="checkbox" id="locationConsent" ${this.userConsent.consents.location ? 'checked' : ''} onchange="popiaMgr.updateConsent('location', this.checked)" class="rounded">
                  Location Services (Browser-Only)
                </label>
              </div>
              <p class="text-xs text-stone-400">
                <i class="fa-solid fa-info-circle text-amber-400 mr-1"></i>
                Your location is <strong>never stored</strong> on our servers. We only use it in your browser to sort nearby safe zones when you tap "Use my location".
              </p>
            </div>
          </div>

          <div class="border-t border-stone-700 pt-4">
            <h4 class="text-xs font-bold text-stone-300 mb-2">Your Data Rights:</h4>
            <ul class="text-xs text-stone-400 space-y-1">
              <li>✓ Right to access: Request a copy of your data</li>
              <li>✓ Right to correction: Update inaccurate information</li>
              <li>✓ Right to deletion: Ask us to delete your data</li>
              <li>✓ Right to withdraw consent: Opt-out anytime</li>
            </ul>
            <p class="text-xs text-stone-500 mt-3">
              Contact: <a href="mailto:privacy@hydroguard.community" class="text-amber-400 hover:underline">privacy@hydroguard.community</a>
            </p>
          </div>
        </div>

        <div class="p-4 border-t border-stone-700 bg-stone-900/50 flex gap-2">
          <button onclick="popiaMgr.saveCustomConsent(); document.getElementById('popiaDetailedModal').remove()" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
            Save Preferences
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * Update individual consent preference
   */
  updateConsent(type, value) {
    const consents = { ...this.userConsent.consents };
    consents[type] = value;
    this.saveConsent(consents);
  }

  /**
   * Save custom consent preferences
   */
  saveCustomConsent() {
    const consents = {
      essential: true,
      analytics: document.getElementById('analyticsConsent')?.checked || false,
      marketing: document.getElementById('marketingConsent')?.checked || false,
      location: document.getElementById('locationConsent')?.checked || false
    };
    this.saveConsent(consents);
    this.hideConsentBanner();
    this.logConsent('custom');
  }

  /**
   * Hide the consent banner
   */
  hideConsentBanner() {
    const banner = document.getElementById('popiaBanner');
    if (banner) {
      banner.style.transition = 'opacity 0.3s ease-out';
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 300);
    }
  }

  /**
   * Log consent action for compliance audit trail
   */
  logConsent(type) {
    const log = {
      type: type,
      timestamp: new Date().toISOString(),
      version: POPIA_CONFIG.consentVersion
    };
    console.log('[POPIA] Consent logged:', log);
    // In production, send to backend for audit trail
  }
}

// ===== PRIVACY POLICY & TERMS =====
function showPrivacyPolicy() {
  alert(`HydroGuard Privacy Policy

1. DATA WE COLLECT:
   • Account info (name, phone, email - optional)
   • Flood reports (location, severity, description)
   • System usage (non-personally identifiable)
   • Location (browser-only, never stored)

2. HOW WE USE DATA:
   • To provide flood alerts & emergency services
   • To improve the app (analytics, with consent)
   • To prevent abuse (rate limiting, security)
   • NOT sold to third parties

3. DATA RETENTION:
   • Essential data: 90 days
   • Location: Immediate deletion (browser-only)
   • Deleted data can't be recovered

4. YOUR RIGHTS:
   • Access your data
   • Correct inaccuracies
   • Request deletion (Right to be Forgotten)
   • Withdraw consent anytime

5. CONTACT:
   Email: privacy@hydroguard.community
   Compliance Officer: [Your Name/Department]`);
}

function showTermsOfService() {
  alert(`HydroGuard Terms of Service

1. USE LICENSE:
   Permission is granted to use HydroGuard for lawful purposes.

2. DISCLAIMER:
   Flood alerts are predictive models, not guarantees. 
   Always follow official emergency alerts and evacuation orders.

3. USER RESPONSIBILITIES:
   • Provide accurate information
   • Use alerts responsibly
   • Report false information

4. LIABILITY:
   HydroGuard is provided "as-is" without warranties.
   We're not liable for damages from flood events or alert delays.

5. TERMINATION:
   We may suspend access for abuse or ToS violations.

6. MODIFICATIONS:
   We may update these terms anytime with notification.`);
}

// ===== INITIALIZATION =====
let popiaMgr;
document.addEventListener('DOMContentLoaded', () => {
  popiaMgr = new POPIACompliance();
});
