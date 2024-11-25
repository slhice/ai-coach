// AI Coach Widget Embed Script
(function() {
  'use strict';

  // Configuration object
  window.__aicoach = window.__aicoach || {
    baseUrl: 'https://my-coach.netlify.app',
    containerId: 'ai-coach-widget'
  };

  function calculateWidgetDimensions() {
    var width, height;
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    // For mobile devices (width < 768px)
    if (screenWidth < 768) {
      width = screenWidth * 0.95; // 95% of screen width
      height = screenHeight * 0.8; // 80% of screen height
    }
    // For tablets (768px <= width < 1024px)
    else if (screenWidth < 1024) {
      width = screenWidth * 0.7; // 70% of screen width
      height = screenHeight * 0.8; // 80% of screen height
    }
    // For desktop (width >= 1024px)
    else {
      width = Math.min(800, screenWidth * 0.5); // Max 800px or 50% of screen width
      height = Math.min(800, screenHeight * 0.8); // Max 800px or 80% of screen height
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  function loadWidget() {
    // Check if widget is already initialized
    if (document.getElementById(window.__aicoach.containerId)) {
      return;
    }

    // Create widget container
    var container = document.createElement('div');
    container.id = window.__aicoach.containerId;
    document.body.appendChild(container);

    // Create widget iframe with error boundary
    try {
      var iframe = document.createElement('iframe');
      iframe.src = window.__aicoach.baseUrl;
      
      // Get initial dimensions
      var dimensions = calculateWidgetDimensions();
      
      iframe.style.cssText = [
        'position: fixed',
        'bottom: 20px',
        'right: 20px',
        'width: ' + dimensions.width + 'px',
        'height: ' + dimensions.height + 'px',
        'border: none',
        'border-radius: 12px',
        'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15)',
        'background: transparent',
        'z-index: 2147483647',
        'transition: width 0.3s ease, height 0.3s ease'
      ].join(';');

      // Add required attributes for security
      iframe.setAttribute('title', 'AI Coach Widget');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allow', 'microphone');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads');
      iframe.setAttribute('importance', 'high');
      iframe.setAttribute('crossorigin', 'anonymous');

      // Error handling
      iframe.onerror = function(e) {
        console.warn('AI Coach widget encountered an error:', e);
        showErrorMessage(container);
      };

      // Append iframe to container
      container.appendChild(iframe);

      // Handle window resize
      var resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          var newDimensions = calculateWidgetDimensions();
          iframe.style.width = newDimensions.width + 'px';
          iframe.style.height = newDimensions.height + 'px';
        }, 250);
      });

      // Setup message handling with error boundary
      window.addEventListener('message', function(event) {
        try {
          if (event.origin !== window.__aicoach.baseUrl) {
            return;
          }
          
          // Handle widget messages
          if (event.data && event.data.type === 'aicoach:resize') {
            var maxHeight = calculateWidgetDimensions().height;
            iframe.style.height = Math.min(event.data.height, maxHeight) + 'px';
          }
        } catch (err) {
          console.warn('AI Coach message handling error:', err);
        }
      }, false);

    } catch (err) {
      console.warn('AI Coach widget initialization error:', err);
      showErrorMessage(container);
    }
  }

  function showErrorMessage(container) {
    container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">AI Coach is temporarily unavailable. Please refresh the page.</div>';
  }

  // Load widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})();