// calling require functions from JOSE
const { generateKeyPair, exportJWK } = require('jose');


// generating private JWK
(async () => {
    const {privateKey} = await generateKeyPair('RS256')
    const jwk = await exportJWK(privateKey)
    console.log(JSON.stringify(jwk))
})()


