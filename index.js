const express = require('express')
require('dotenv').config()
const { Provider } = require('oidc-provider')
const CustomMemoryAdapter = require("./oidc-provider-src/custom-memory-adapter");
const app = express()
const PORT = process.env.PORT
const ISSUER_BASE_URL = process.env.ISSUER_BASE_URL
const JwksPrivateKey = JSON.parse(process.env.JWKS_PRIVATE_KEY)


// configuration of oidc provider (authorization server)
const configuration = {
    cookies: {
        keys: [process.env.COOKIE_KEY_VALUE]
    },
    renderError: async (ctx, out, err) => {
        ctx.type = `json`
        ctx.body = JSON.stringify(err)
    },
    pkce: {
        required: () => false
    },
    adapter: CustomMemoryAdapter,
    jwks: {
        keys: [JwksPrivateKey]
    },
    // clients: [
    //     {
    //         "client_id": "CLIENT_ID",
    //     }

    // ]
}


// home page
app.get('/', (req,res) => {
    console.log('server is running')
    res.send(`<p>Hello world!</p> <p><a href="/.well-known/openid-configuration">Discovery</a></p> <p><a href="/oidc/jwks">JWKS</a></p>`)
})


// new instance of Provider object from oidc-provider
const provider = new Provider(ISSUER_BASE_URL, configuration)
app.use('/', provider.callback())


// setting Pragma and Cache control headers on response
app.use((req,res,next) => {
    res.set({
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store'
    })
    next()
    console.log(req.method + " " + req.url)
})


// error feedback
provider.on("authorization.error", (ctx, error) => {
    console.log(ctx)
    console.log(error)
})

provider.on("grant.error", (ctx, error) => {
    console.log(ctx)
    console.log(error)
})


// express default error
app.use((error, req, res, next) => {
    res.send(`<pre>${JSON.stringify(error, null, 2)}</pre>`);
});



app.listen(PORT)

