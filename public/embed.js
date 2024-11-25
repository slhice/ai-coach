// AI Coach Widget Embed Script
(function() {
  'use strict';

  // Configuration object
  window.__aicoach = window.__aicoach || {
    baseUrl: 'https://my-coach.netlify.app',
    containerId: 'ai-coach-widget'
  };

  function loadWidget() {
    // Check if widget is already initialized
    if (document.getElementById(window.__aicoach.containerId)) {
      return;
    }

    // Create widget container
    var container = document.createElement('div');
    container.id = window.__aicoach.containerId;
    document.body.appendChild(container);

    // Create widget iframe
    var iframe = document.createElement('iframe');
    iframe.src = window.__aicoach.baseUrl;
    iframe.style.cssText = [
      'position: fixed',
      'bottom: 20px',
      'right: 20px',
      'width: 400px',
      'height: 600px',
      'border: none',
      'border-radius: 10px',
      'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)',
      'background: transparent',
      'z-index: 2147483647'
    ].join(';');

    // Add required attributes for security
    iframe.setAttribute('title', 'AI Coach Widget');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allow', 'microphone');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads');

    // Error handling
    iframe.onerror = function() {
      console.error('Failed to load AI Coach widget');
      container.innerHTML = '<div style="padding: 20px; text-align: center;">Failed to load AI Coach. Please refresh the page.</div>';
    };

    // Append iframe to container
    container.appendChild(iframe);

    // Setup message handling
    window.addEventListener('message', function(event) {
      if (event.origin !== window.__aicoach.baseUrl) {
        return;
      }
      
      // Handle widget messages
      if (event.data.type === 'aicoach:resize') {
        iframe.style.height = event.data.height + 'px';
      }
    }, false);
  }

  // Load widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})();