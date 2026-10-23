// backend/config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the root .env file reliably regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
