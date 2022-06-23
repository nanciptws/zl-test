const express = require('express')
const next = require('next')

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const {create} = require("bablic");
const path = require("path");

app.prepare().then(() => {
    const server = express()
    const bodyParser = require('body-parser')

    //Engine & other
    server.set('view engine', 'ejs');
    server.set('views', __dirname+'/pages/views');
    server.use(bodyParser.urlencoded({extended:false}))
    
    server.use(create({
        siteId: '619fb9fe741d110001169c77',
        rootUrl: 'https://zoleo-bc-ptg-git-bablic1506-zoleo.vercel.app',
        subDir: true,
        folders: {"fr-ca": "fr", "de-ca":"de"}
    }));

    server.get('/bablic', (req, res) => {
        res.render(path.join(__dirname,'/pages/views','bablic'))
    });

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, () => {
        console.log("--------------------------------------------------------------------------------------------------");
        console.log(`>>>> JS Ready on http://localhost:${port}`)
    })
})