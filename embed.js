// AI Coach Widget Embed Script
(function() {
  const container = document.createElement('div');
  container.id = 'ai-coach-widget';
  document.body.appendChild(container);

  const script = document.createElement('script');
  script.src = 'https://YOUR-NETLIFY-URL/main.js';
  script.async = true;
  document.body.appendChild(script);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://YOUR-NETLIFY-URL/style.css';
  document.head.appendChild(link);
})();