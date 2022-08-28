//Pagina inicial
let thisUser = ""
let hasRegistered = false
function loadFirstPage(){
    const loginPage = document.createElement("div")
    loginPage.classList.add("first-page")
    loginPage.innerHTML = `
    <img src="./assets/logo.jpg" alt="">
    <input type="text" name="nome" placeholder="Digite seu nome">
    <button >Entrar</button>
    `
    document.body.appendChild(loginPage)
    loginPage.querySelector("button").addEventListener("click", unloadFirstPage)
}
function unloadFirstPage(){
    const loginPage = document.querySelector(".first-page")
    const value = loginPage.querySelector("input").value
    thisUser = value
    registerParticipant(thisUser)
    hasRegistered = true
    loginPage.remove()
    const retime = setInterval(getParticipants, 5000)
}
loadFirstPage()


//Registrar User
function registerParticipant(value){
    const dados = {
        name: ""+value
    };
    const requestUrl = hasRegistered == true ? 'status' : 'participants' 
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/'+requestUrl, dados);
    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
}

//Pegar lista de Users Online
function getParticipants(){
    registerParticipant(thisUser)
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promisse.then(printParticipants)
}
//Imprimir cada User de acordo com a Lista
function printParticipants(response){
    console.clear()
    for (let i = 0; i < response.data.length; i++) {
        console.log(response.data[i].name)
    }
}

function tratarSucesso(resposta) {
    console.log(resposta.data)
 }

function tratarErro(erro) {
  console.log("Status code: " + erro.response.status); // Ex: 404
	console.log("Mensagem de erro: " + erro.response.data); // Ex: Not Found
}

// const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
//     promessa.then(processarResposta);

//     function processarResposta(resposta) {
// 	console.log(resposta.data);
//     }