import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import publicRoutes from './routes/public.js';
import metaRoutes from './routes/meta.js';
import { ensureDataFile } from './store/plannerStore.js';
import { corsOrigin } from './config/cors.js';

const app = express();
const PORT = process.env.PORT || 3001;

await ensureDataFile();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/meta', metaRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
