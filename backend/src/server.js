import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import wardsRoutes from './routes/wards.routes.js';
import roomsRoutes from './routes/rooms.routes.js';
import patientsRoutes from './routes/patients.routes.js';
import admissionsRoutes from './routes/admissions.routes.js';
import statsRoutes from './routes/stats.routes.js';
import nurseRoutes from './routes/nurse.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wards', wardsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/nurse', nurseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'VitalWatch Hospital API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`VitalWatch Express API Server running on port ${PORT}`);
  console.log(`Ready for Receptionist & Clinical telemetry requests.`);
});
