require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dbConnect = require('./config/mongo')
const morganBody = require('morgan-body')
const {IncomingWebhook} = require('@slack/webhook')
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static("storage"))

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK)

const loggerStream = {
    write: message => {

        webhook.send({
            text: message
        })

        console.log('Capturando mensaje', message)

    }
}


morganBody(app, {

    noColors: true,
    stream: loggerStream,
    skip: function(req,res){
        return res.status < 400;
    }


})
const port = process.env.PORT || 3001;





//Routes

app.use('/api', require('./routes'))




app.listen(port, () => {
    console.log(`app listen in the port ${port}`)
})

dbConnect();