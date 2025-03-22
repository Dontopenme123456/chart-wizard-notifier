
// Background service worker for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Trading Signal Bot installed successfully');
  
  // Set default indicator settings
  chrome.storage.local.set({
    indicators: [
      {
        id: 'rsi',
        name: 'RSI Crossover',
        enabled: true,
        settings: { period: 14, overbought: 70, oversold: 30 }
      },
      {
        id: 'macd',
        name: 'MACD Signal',
        enabled: true,
        settings: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
      },
      {
        id: 'bollinger',
        name: 'Bollinger Bands',
        enabled: true,
        settings: { period: 20, stdDev: 2 }
      }
    ]
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PRICE_DATA') {
    // Process price data and generate signals
    processPriceData(message.data)
      .then(signals => {
        // Send signals back to content script
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'SIGNALS_GENERATED',
          signals: signals
        });
        
        // Store signals in local storage
        storeSignals(signals);
        
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error processing price data:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});

// Process price data and generate signals based on indicators
async function processPriceData(priceData) {
  // Get indicator settings from storage
  const data = await chrome.storage.local.get('indicators');
  const indicators = data.indicators || [];
  
  // Filter enabled indicators
  const enabledIndicators = indicators.filter(indicator => indicator.enabled);
  
  // Generate signals for each enabled indicator
  const signals = [];
  
  for (const indicator of enabledIndicators) {
    switch (indicator.id) {
      case 'rsi':
        const rsiSignal = calculateRSI(priceData, indicator.settings);
        if (rsiSignal) signals.push(rsiSignal);
        break;
      case 'macd':
        const macdSignal = calculateMACD(priceData, indicator.settings);
        if (macdSignal) signals.push(macdSignal);
        break;
      case 'bollinger':
        const bollingerSignal = calculateBollingerBands(priceData, indicator.settings);
        if (bollingerSignal) signals.push(bollingerSignal);
        break;
    }
  }
  
  return signals;
}

// Store signals in local storage
function storeSignals(signals) {
  chrome.storage.local.get('signalHistory', (data) => {
    const signalHistory = data.signalHistory || [];
    const updatedHistory = [...signals, ...signalHistory].slice(0, 100); // Keep only the latest 100 signals
    
    chrome.storage.local.set({ signalHistory: updatedHistory });
  });
}

// Simple indicator calculations (to be replaced with actual technical indicator logic)
function calculateRSI(priceData, settings) {
  // This would contain actual RSI calculation logic
  const { period, overbought, oversold } = settings;
  
  // This is just a simplified example
  const lastPrice = priceData[priceData.length - 1];
  const randomRSI = Math.random() * 100;
  
  if (randomRSI < oversold) {
    return {
      type: 'buy',
      indicator: 'RSI',
      value: randomRSI.toFixed(2),
      price: lastPrice,
      timestamp: new Date().toISOString(),
      details: `RSI ${randomRSI.toFixed(2)} below oversold level (${oversold})`
    };
  } else if (randomRSI > overbought) {
    return {
      type: 'sell',
      indicator: 'RSI',
      value: randomRSI.toFixed(2),
      price: lastPrice,
      timestamp: new Date().toISOString(),
      details: `RSI ${randomRSI.toFixed(2)} above overbought level (${overbought})`
    };
  }
  
  return null;
}

function calculateMACD(priceData, settings) {
  // This would contain actual MACD calculation logic
  const { fastPeriod, slowPeriod, signalPeriod } = settings;
  
  // Simplified example
  const lastPrice = priceData[priceData.length - 1];
  const randomValue = Math.random() * 2 - 1; // -1 to 1
  
  if (randomValue > 0.7) {
    return {
      type: 'buy',
      indicator: 'MACD',
      value: randomValue.toFixed(2),
      price: lastPrice,
      timestamp: new Date().toISOString(),
      details: `MACD crossed above signal line`
    };
  } else if (randomValue < -0.7) {
    return {
      type: 'sell',
      indicator: 'MACD',
      value: randomValue.toFixed(2),
      price: lastPrice,
      timestamp: new Date().toISOString(),
      details: `MACD crossed below signal line`
    };
  }
  
  return null;
}

function calculateBollingerBands(priceData, settings) {
  // This would contain actual Bollinger Bands calculation logic
  const { period, stdDev } = settings;
  
  // Simplified example
  const lastPrice = priceData[priceData.length - 1];
  const randomBand = Math.random() * 10 - 5; // -5 to 5
  
  if (randomBand > 4) {
    return {
      type: 'sell',
      indicator: 'Bollinger',
      value: randomBand.toFixed(2),
      price: lastPrice,
      timestamp: new Date().toISOString(),
      details: `Price touched upper Bollinger Band`
    };
  } else if (randomBand < -4) {
    return {
      type: 'buy',
      indicator: 'Bollinger',
      value: randomBand.toFixed(2),
      price: lastPrice,
      timestamp: new Date().toISOString(),
      details: `Price touched lower Bollinger Band`
    };
  }
  
  return null;
}
