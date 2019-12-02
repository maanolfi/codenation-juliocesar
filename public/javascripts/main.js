
let conteudoApi = document.querySelector('#conteudoApi')
    
function lerDadosApi (){
    fetch('answer.json')
    .then( res => res.json(), {
        method: 'GET'
    })
    .then (data => {        
        conteudoApi.innerHTML = `${JSON.stringify(data)}`     
                
    })
}
    

