const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
//flash messagings
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
//database
const mongo = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect('mongodb://admin:adminpass@ds145659.mlab.com:45659/heroku_9xzsm75k')
//mongoose.connect('mongodb://127.0.0.1:27017/loginapp')

const routes = require('./routes/index')
const users = require('./routes/users')

const app = express()

app.set('views', path.join(__dirname, 'views'))
//default layout file will be called 'layout'
app.engine('handlebars', exphbs({defaultLayout:'layout'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root
        
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

app.use('/', routes)
app.use('/users', users)

app.listen(process.env.PORT || 5000, () => {
    console.log('Server started.')
})
