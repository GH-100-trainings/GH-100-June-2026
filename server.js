const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Only start listening when run directly, so tests can import the app.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`World Clock running at http://localhost:${PORT}`);
  });
}

module.exports = app;
