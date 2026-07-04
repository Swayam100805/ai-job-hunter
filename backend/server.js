import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import resumeRouter from './routes/resume.js'
import linkedinRouter from './routes/linkedin.js'
import portfolioRouter from './routes/portfolio.js'
import jobmatcherRouter from './routes/jobmatcher.js'
import coverletterRouter from './routes/coverletter.js'
import interviewRouter from './routes/interview.js' 

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'AI Job Hunter backend running' })
})

app.use('/api/resume', resumeRouter)
app.use('/api/linkedin', linkedinRouter) 
app.use('/api/portfolio', portfolioRouter)  
app.use('/api/jobmatcher', jobmatcherRouter)     
app.use('/api/coverletter', coverletterRouter)
app.use('/api/interview', interviewRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`))