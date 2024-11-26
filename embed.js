// AI Coach Widget Embed Script
window.__aicoach = window.__aicoach || {};
window.__aicoach.id = "plc-coach";

(function() {
  // Create and inject the widget script
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://my-coach.netlify.app/main.js';
  script.crossOrigin = 'anonymous';
  script.setAttribute('nonce', window.__aicoach.nonce || '');
  
  // Create and inject the widget styles
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://my-coach.netlify.app/style.css';
  link.crossOrigin = 'anonymous';
  
  // Create widget container
  var container = document.createElement('div');
  container.id = 'ai-coach-widget';
  
  // Add elements to the document
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s);
  document.head.appendChild(link);
  document.body.appendChild(container);
})();