import app from './app.js';
import { config } from './config/index.js';

async function main() {
  try {
    app.listen(config.server.port, () => {
      console.log(`Server started on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

main();
