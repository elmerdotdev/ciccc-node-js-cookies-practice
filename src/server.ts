import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { checkAuth } from './middleware/auth'
import dotenv from 'dotenv'
dotenv.config()

interface User {
  username: string,
  password: string
}

// Create server
const app = express()

// In-memory database
const users: User[] = [
  { username: 'admin', password: '12345' }
]

// Middleware
app.use(cookieParser(process.env.COOKIE_KEY))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../src/views'))

// Routes
// Home route
app.get('/', (req: Request, res: Response) => {
  res.render('index');
})

// Login route
app.get('/login', (req: Request, res:Response) => {
  res.render('login')
})

// Post login route
app.post('/login', (req: Request<{}, {}, User>, res: Response) => {
  const found = users.find(user => user.username === req.body.username && user.password === req.body.password)
  if (found) {
    res.cookie('authToken', 'authenticated', {
      maxAge: 2 * 60 * 1000,
      httpOnly: true,
      signed: true
    })
    res.redirect('/dashboard')
  } else {
    res.send('User not found')
  }
})

// Protected route
app.get('/dashboard', checkAuth, (req: Request, res: Response) => {
  res.render('dashboard')
})

// Logout
app.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('authToken')
  res.redirect('/login')
})

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send('Page not found')
})

// Start server
const PORT: number = Number(process.env.PORT || 3000)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})