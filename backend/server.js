const express = require('express')
const connectDB = require('./config/db')
const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false, limit: '10mb' }))

app.get('/', (req, res) => res.send('API Running'))

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/admin', require('./routes/api/admin'))
// products route ********
app.use('/api/products', require('./routes/api/products'))
// Kasuni's route
app.use('/api/orders', require('./routes/api/orders'))
app.use('/api/deliverys', require('./routes/api/deliverys'))
// Liyanagolla's route
app.use('/api/store', require('./routes/api/store'))
// Malitha's route
app.use(require('./routes/api/ports'))
app.use(require('./routes/api/adminRoute'))
// Hasith's route
app.use(require('./routes/api/suppliers'))
app.use(require('./routes/api/SupplierPro'))
// Buddheesha's route
app.use('/api/employee', require('./routes/api/employees'))
app.use('/api/salary', require('./routes/api/salaries'))
// Gihan's route
app.use('/api/faq', require('./routes/api/faq'))
// Dumindu's route
app.use('/api/add', require('./routes/api/add'))
app.use('/postMessages', require('./routes/api/postMessageController'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
