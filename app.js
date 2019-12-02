var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');

const axios = require('axios');
var fs = require('fs');
var sha1 = require('sha1');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const url = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=a61426e21cf13a603f7a042ea03790025714eeaf'

const alphabet = 'zyxwvutsrqponmlkjihgfedcba'
const number = '0123456789'
let codi = []


axios.get(url).then( res => {  

    decifrar(res.data.cifrado, res.data.numero_casas)

    resumo = sha1(codi.toString().replace(/\,/g, ''));
    /* Site de conferencia:
    https://passwordsgenerator.net/sha1-hash-generator/
    do sha-1 */
    answer = {
        "numero_casas": res.data.numero_casas,
        "token": res.data.token,
        "cifrado": res.data.cifrado,
        "decifrado": codi.toString().replace(/\,/g, ''),
        "resumo_criptografico": resumo
    }  
    
    
    fs.writeFile('./public/answer.json',JSON.stringify(answer), (erro) => {
        if(erro) {
            throw erro
        }
    })


}).catch(err => {
    console.log(err)
})



function decifrar(frase, avancar) {
    
    for(f=0; f < frase.length; f++) {
        let letra = frase[f]

        switch (letra) {
        case '.':
        codi.push('.')
        break
        case ' ':
        codi.push(' ')
        break
        }

        for(n=0;n < number.length; n++){
        num = frase[f] === number[n]
        if(num){
            codi.push(number[n])
        }
        }
        

        for(a=0; a < alphabet.length; a++){
        teste = letra === alphabet[a]

        if (teste) {
            if(alphabet[a + avancar] === undefined){
            ind = (((a + avancar) - 25) - 1)
            codi.push(alphabet[ind])
        } else {
            codi.push(alphabet[a + avancar])
        }

            }
        }
    }
}

module.exports = app;

