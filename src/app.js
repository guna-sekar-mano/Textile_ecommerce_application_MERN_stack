import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes/index.js'
const app = express()
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'))
app.use(compression())
app.use('/uploads', express.static('uploads'))
app.use(cors({
  origin: ['http://localhost:5173','http://192.168.1.20:5173','http://localhost:5174','https://n0p2nzdt-5173.inc1.devtunnels.ms', 'http://192.168.1.67:5173'],
  credentials: true
}))
app.use('/', router)
app.get('/', (req, res) => res.send('Welcome to Extreme Culture server...'))
export default app
