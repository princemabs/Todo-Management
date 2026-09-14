import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import publicRoutes from './routes/public.js';
import metaRoutes from './routes/meta.js';
import { ensureDataFile, getPlannerDataPath, readPlanner } from './store/plannerStore.js';
import { corsOrigin, logCorsConfig } from './config/cors.js';
import healthRoutes from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 3001;

await ensureDataFile();
const bootData = await readPlanner();
console.log(`[planner] Loaded ${bootData.tasks.length} task(s) from ${getPlannerDataPath()}`);

app.set('trust proxy', 1);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api', healthRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Planner data: ${getPlannerDataPath()}`);
  logCorsConfig();
});
