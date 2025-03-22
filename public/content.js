
// Content script for the Trading Signal Bot
console.log('Trading Signal Bot content script loaded');

// Track existing signal elements to remove them when needed
let signalElements = [];

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SIGNALS_GENERATED') {
    // Display signals on the chart
    displaySignalsOnChart(message.signals);
    sendResponse({ success: true });
  }
});

// Set up MutationObserver to detect chart changes
function setupChartObserver() {
  // Identify chart container based on the trading platform
  let chartContainer;
  
  if (window.location.hostname.includes('tradingview.com')) {
    chartContainer = document.querySelector('.chart-container');
  } else if (window.location.hostname.includes('binance.com')) {
    chartContainer = document.querySelector('.chart');
  }
  
  if (!chartContainer) {
    console.log('Chart container not found. Retrying in 2 seconds...');
    setTimeout(setupChartObserver, 2000);
    return;
  }
  
  // Create observer to watch for chart updates
  const observer = new MutationObserver((mutations) => {
    // Extract price data from the chart
    const priceData = extractPriceData();
    
    if (priceData && priceData.length > 0) {
      // Send price data to background script for analysis
      chrome.runtime.sendMessage({
        type: 'PRICE_DATA',
        data: priceData
      });
    }
  });
  
  // Configure and start the observer
  observer.observe(chartContainer, {
    childList: true,
    subtree: true,
    attributes: true
  });
  
  console.log('Chart observer set up successfully');
}

// Extract price data from the chart (platform specific)
function extractPriceData() {
  // This is a simplified example
  // In a real extension, this would parse the DOM to extract actual price data
  
  // Generate some random price data for demonstration
  const priceData = [];
  let basePrice = 45000 + Math.random() * 5000;
  
  for (let i = 0; i < 100; i++) {
    basePrice += (Math.random() - 0.5) * 100;
    priceData.push(basePrice);
  }
  
  return priceData;
}

// Display signals as overlays on the chart
function displaySignalsOnChart(signals) {
  // Remove existing signal elements
  signalElements.forEach(element => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
  
  signalElements = [];
  
  // Identify chart container based on the trading platform
  let chartContainer;
  
  if (window.location.hostname.includes('tradingview.com')) {
    chartContainer = document.querySelector('.chart-container');
  } else if (window.location.hostname.includes('binance.com')) {
    chartContainer = document.querySelector('.chart');
  }
  
  if (!chartContainer) {
    console.error('Chart container not found');
    return;
  }
  
  // Create and append signal elements
  signals.forEach(signal => {
    const signalElement = document.createElement('div');
    signalElement.textContent = signal.type === 'buy' ? '🚀 BUY' : '🛑 SELL';
    signalElement.style.position = 'absolute';
    signalElement.style.top = `${20 + Math.random() * 60}%`;
    signalElement.style.right = `${10 + Math.random() * 30}%`;
    signalElement.style.backgroundColor = signal.type === 'buy' ? 'rgba(52, 199, 89, 0.8)' : 'rgba(255, 59, 48, 0.8)';
    signalElement.style.color = 'white';
    signalElement.style.padding = '4px 8px';
    signalElement.style.borderRadius = '4px';
    signalElement.style.fontSize = '12px';
    signalElement.style.fontWeight = 'bold';
    signalElement.style.zIndex = '9999';
    signalElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    signalElement.style.animation = 'fadeIn 0.3s ease-out';
    
    // Add tooltip with signal details
    signalElement.title = `${signal.indicator}: ${signal.details}`;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    
    chartContainer.appendChild(signalElement);
    signalElements.push(signalElement);
  });
}

// Initialize when the page is fully loaded
window.addEventListener('load', () => {
  console.log('Page loaded, setting up Trading Signal Bot');
  setupChartObserver();
  
  // Initial price data extraction
  setTimeout(() => {
    const priceData = extractPriceData();
    
    if (priceData && priceData.length > 0) {
      chrome.runtime.sendMessage({
        type: 'PRICE_DATA',
        data: priceData
      });
    }
  }, 3000);
});
