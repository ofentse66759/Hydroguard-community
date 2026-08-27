/**
 * HydroGuard Font Size Control
 * Manages adjustable font sizes with local storage persistence
 */

// Font size levels (in rem units, where 1 rem = 16px base)
const FONT_SIZE_LEVELS = {
  small: { scale: 0.85, label: 'Small' },
  normal: { scale: 1.0, label: 'Normal' },
  large: { scale: 1.15, label: 'Large' },
  xlarge: { scale: 1.3, label: 'Extra Large' },
  xxlarge: { scale: 1.5, label: 'Extra Extra Large' }
};

const FONT_SIZE_KEY = 'hydroguard_font_size';
let currentFontSizeLevel = localStorage.getItem(FONT_SIZE_KEY) || 'normal';

/**
 * Initialize font size on page load
 */
function initFontSize() {
  const savedLevel = localStorage.getItem(FONT_SIZE_KEY) || 'normal';
  setFontSize(savedLevel);
  updateFontSizeUI();
}

/**
 * Set the font size for the entire application
 * @param {string} level - The font size level (small, normal, large, xlarge, xxlarge)
 */
function setFontSize(level) {
  if (!FONT_SIZE_LEVELS[level]) {
    console.warn(`Invalid font size level: ${level}. Using normal.`);
    level = 'normal';
  }

  const scale = FONT_SIZE_LEVELS[level].scale;
  const root = document.documentElement;
  
  // Set CSS variable for dynamic font scaling
  root.style.setProperty('--font-scale', scale);
  
  // Alternative: set base font size
  root.style.fontSize = (16 * scale) + 'px';

  // Store preference
  currentFontSizeLevel = level;
  localStorage.setItem(FONT_SIZE_KEY, level);

  // Update UI indicators
  updateFontSizeUI();
}

/**
 * Cycle through font sizes (triggered by button click)
 */
function increaseFontSize() {
  const levels = Object.keys(FONT_SIZE_LEVELS);
  const currentIndex = levels.indexOf(currentFontSizeLevel);
  const nextIndex = (currentIndex + 1) % levels.length;
  const nextLevel = levels[nextIndex];
  
  setFontSize(nextLevel);
  showFontSizeNotification(FONT_SIZE_LEVELS[nextLevel].label);
}

/**
 * Decrease font size
 */
function decreaseFontSize() {
  const levels = Object.keys(FONT_SIZE_LEVELS);
  const currentIndex = levels.indexOf(currentFontSizeLevel);
  const prevIndex = currentIndex === 0 ? levels.length - 1 : currentIndex - 1;
  const prevLevel = levels[prevIndex];
  
  setFontSize(prevLevel);
  showFontSizeNotification(FONT_SIZE_LEVELS[prevLevel].label);
}

/**
 * Update UI to reflect current font size
 */
function updateFontSizeUI() {
  const buttons = document.querySelectorAll('[data-font-size-btn]');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.fontSizeBtn === currentFontSizeLevel) {
      btn.classList.add('active');
    }
  });

  // Update button title
  const fontBtn = document.getElementById('fontSizeToggleBtn');
  if (fontBtn) {
    fontBtn.title = `Font Size: ${FONT_SIZE_LEVELS[currentFontSizeLevel].label}`;
  }
}

/**
 * Show a temporary notification for font size change
 */
function showFontSizeNotification(label) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg z-40 animate-slide-up';
  notification.innerHTML = `<i class="fa-solid fa-text-height mr-2"></i>Font Size: ${label}`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

/**
 * Create a font size control menu
 */
function createFontSizeMenu() {
  const menu = document.createElement('div');
  menu.id = 'fontSizeMenu';
  menu.className = 'fixed inset-0 modal-backdrop z-50 hidden flex items-center justify-center p-4';
  menu.onclick = (e) => {
    if (e.target === menu) closeFontSizeMenu();
  };

  menu.innerHTML = `
    <div class="bg-stone-800 rounded-2xl border border-stone-700 max-w-sm w-full" onclick="event.stopPropagation()">
      <div class="p-5 border-b border-stone-700 flex items-center justify-between">
        <h3 class="text-lg font-bold"><i class="fa-solid fa-text-height text-amber-400 mr-2"></i>Font Size</h3>
        <button onclick="closeFontSizeMenu()" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark text-2xl"></i></button>
      </div>
      <div class="p-5 space-y-3">
        <p class="text-sm text-stone-300 mb-4">Choose your preferred text size:</p>
        ${Object.entries(FONT_SIZE_LEVELS).map(([key, value]) => `
          <button onclick="setFontSize('${key}'); closeFontSizeMenu()" 
                  class="w-full px-4 py-3 rounded-lg border transition text-left font-medium
                         ${currentFontSizeLevel === key 
                           ? 'bg-amber-600 border-amber-500 text-white' 
                           : 'bg-stone-900 border-stone-600 text-stone-300 hover:border-stone-500 hover:bg-stone-800'}
                         flex items-center justify-between"
                  data-font-size-btn="${key}">
            <span>${value.label}</span>
            <span class="text-xs text-stone-500" style="font-size: ${16 * value.scale}px;">Aa</span>
          </button>
        `).join('')}
      </div>
      <div class="p-4 border-t border-stone-700 bg-stone-900/50">
        <p class="text-xs text-stone-500 text-center">
          <i class="fa-solid fa-info-circle mr-1"></i>
          Your preference is saved automatically
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(menu);
}

/**
 * Toggle font size menu
 */
function toggleFontSizeMenu() {
  const menu = document.getElementById('fontSizeMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

/**
 * Close font size menu
 */
function closeFontSizeMenu() {
  const menu = document.getElementById('fontSizeMenu');
  if (menu) {
    menu.classList.add('hidden');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initFontSize();
  createFontSizeMenu();
});
