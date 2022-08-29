//Pagina inicial
let thisUser = ""
let hasRegistered = false
function loadFirstPage(){
    const loginPage = document.createElement("div")
    loginPage.classList.add("first-page")
    loginPage.innerHTML = `
    <img src="./assets/logo.png" alt="">
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
    const refresh = setInterval(getParticipants, 5000)
    document.querySelector(".app").style.display = "grid"
    getMessages()
    const refreshMsg = setInterval(getMessages, 10000)

}
loadFirstPage()

//Carregar mensagens
let loadedMessages = {}
function getMessages(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promisse.then(printMessages)    
    promisse.catch(tratarErro)

}

//Registrar User + Manter status online
function registerParticipant(value){
    const dados = {
        name: ""+value
    }
    const requestUrl = hasRegistered == true ? 'status' : 'participants' 
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/'+requestUrl, dados)
    requisicao.catch(tratarErro)
}

//Pegar lista de Users Online
function getParticipants(){
    registerParticipant(thisUser)
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promisse.then(printParticipants)
    getMessages()
}
//Imprimir cada User de acordo com a Lista
function printParticipants(response){
    console.clear()
    for (let i = 0; i < response.data.length; i++) {
        console.log(response.data[i].name)
    }
}


//Carregar mensagens na tela
let lockview = false
function printMessages(response) {
    const messages = document.querySelector(".messages")
    const data = response.data
    messages.innerHTML = ""
    for (let i = 0; i < data.length; i++) {
        const msg = document.createElement("div")
        msg.id = data[i].type
        msg.innerHTML = data[i].type == "message" ? `
            <span class="time">${data[i].time} </span>
            <strong>${data[i].from}</strong>
             para <strong>${data[i].to}: 
            </strong>${data[i].text}
        `:
        data[i].type == "private_message" ?
        `
            <span class="time">${data[i].time} </span>
            <strong>${data[i].from}</strong>
             para <strong>${data[i].to}: 
            </strong>${data[i].text}
        `:
        `
            <span class="time">${data[i].time} </span>
            <strong>${data[i].from} 
            </strong>${data[i].text}
        `
        if (i == data.length-1 && lockview == true){
            msg.classList.add("lockintoview")
        }
        if(data[i].from == thisUser){
            messages.appendChild(msg)
        }
        else{
            if(data[i].type == "private_message" && data[i].to == thisUser){
                messages.appendChild(msg)
            }
            if(data[i].type == "message" || 
            data[i].type == "status"){
                messages.appendChild(msg)
            }
        }

    }
    document.querySelector(".lockintoview").scrollIntoView()
}

 
//Selecionar Destinatário
let receiver = ""
function selectReceiver(){
    return 
}

//Enviar mensagem
function sendMessage(){
    const input = document.querySelector(".bottombar input")
    const dados = {
        from: thisUser,
        to: receiver == "" ? "Todos" : receiver,
        text: input.value,
        type: receiver == "" ? "message" : "private_message" // ou "private_message" para o bônus
    }
    input.value = ""
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dados)
    requisicao.catch(tratarErro)
    getMessages()
}
//Mostrar Menu
let menuState = false
document.querySelector(".menu-btn").addEventListener("click", showMenu)
function showMenu(){
    if(menuState == false){
        document.querySelector(".shadow").style.visibility = "visible"
        document.querySelector(".shadow").style.opacity = 1
        document.querySelector(".menu").style.right=0
        menuState = !menuState
    }
    else{
        document.querySelector(".shadow").style.visibility = "hidden"
        document.querySelector(".shadow").style.opacity = 0
        document.querySelector(".menu").style.right= "-85%"
        menuState = !menuState
    }
}

function tratarErro(erro) {
  console.log("Status code: " + erro.response.status) // Ex: 404
	console.log("Mensagem de erro: " + erro.response.data) // Ex: Not Found
}