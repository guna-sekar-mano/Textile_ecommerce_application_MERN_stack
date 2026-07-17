import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes/index.js'
import qs from "qs";

const app = express()
app.use(express.json({ limit: '200mb' })); 
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(morgan('dev'))
app.use(compression())
app.set("query parser", str => qs.parse(str));

app.use('/uploads', express.static('uploads'))
app.use(cors({
  origin: ['http://localhost:5173','http://192.168.1.52:5173','http://localhost:5174', 'http://192.168.1.35:5173','http://3.109.65.19'],
  credentials: true
}))
app.use('/', router)
app.get('/app', (req, res) => res.send('Welcome to Extreme Culture server...'))
export default app
