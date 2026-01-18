// Security utilities to prevent client-side tampering

export const initializeSecurityMeasures = () => {
  if (typeof window === "undefined") return;

  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // Disable DevTools keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // F12
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I (Windows/Linux)
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C (Inspect element)
    if (e.ctrlKey && e.shiftKey && e.key === "C") {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
      e.preventDefault();
      return false;
    }
    // Cmd+Option+I (Mac)
    if (e.metaKey && e.altKey && e.key === "I") {
      e.preventDefault();
      return false;
    }
    // Cmd+Option+U (Mac - View Source)
    if (e.metaKey && e.altKey && e.key === "U") {
      e.preventDefault();
      return false;
    }
  });

  // Detect DevTools opening via console check
  let devToolsOpen = false;
  const threshold = 160;

  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold) {
      devToolsOpen = true;
      handleDevToolsDetected();
    } else if (window.outerWidth - window.innerWidth > threshold) {
      devToolsOpen = true;
      handleDevToolsDetected();
    }
  }, 500);

  // Disable console methods
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.error = noop;
  console.debug = noop;
  console.info = noop;
  console.table = noop;
  console.trace = noop;
  console.time = noop;
  console.timeEnd = noop;
};

const handleDevToolsDetected = () => {
  // Silently handle - don't alert as it's annoying
  // In production, you could send a log to your server
};

// Validate data server-side before accepting
export const validateScoreData = (score, metadata) => {
  // This should be called on the backend
  // Never trust client-side score values
  if (typeof score !== "number" || score < 0) {
    return false;
  }
  if (score > 999) {
    // Reasonable upper limit for Flappy Bird
    return false;
  }
  return true;
};

// Prevent localStorage tampering by adding checksums
export const setSecureLocalStorage = (key, value) => {
  const data = JSON.stringify(value);
  const checksum = generateChecksum(data);
  localStorage.setItem(key, JSON.stringify({ data: value, checksum }));
};

export const getSecureLocalStorage = (key) => {
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  try {
    const { data, checksum } = JSON.parse(stored);
    const calculatedChecksum = generateChecksum(JSON.stringify(data));

    if (checksum !== calculatedChecksum) {
      // Data was tampered with
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

// Simple checksum function
const generateChecksum = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

// Obfuscate sensitive data in DOM
export const obfuscateSensitiveData = (element) => {
  if (!element) return;
  element.setAttribute("data-sensitive", "true");
  element.style.userSelect = "none";
  element.style.webkitUserSelect = "none";
};
