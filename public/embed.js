// AI Coach Widget Embed Script
window.__aicoach = window.__aicoach || {};
window.__aicoach.initialized = false;

(function() {
  // Only initialize once
  if (window.__aicoach.initialized) return;
  window.__aicoach.initialized = true;

  // Create widget container if it doesn't exist
  if (!document.getElementById('ai-coach-widget')) {
    var container = document.createElement('div');
    container.id = 'ai-coach-widget';
    document.body.appendChild(container);
  }

  // Load main script
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://my-coach.netlify.app/main.js';
  script.crossOrigin = 'anonymous';
  
  // Load styles
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://my-coach.netlify.app/style.css';
  link.crossOrigin = 'anonymous';
  
  // Add elements to document
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s);
  document.head.appendChild(link);
})();