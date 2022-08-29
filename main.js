//Pagina inicial
let thisUser = ""
let hasRegistered = false
function loadFirstPage(){
    const loginPage = document.createElement("div")
    loginPage.classList.add("first-page")
    loginPage.innerHTML = `
    <img src="./assets/logo.png" alt="">
    <input class="this-input" type="text" name="nome" placeholder="Digite seu nome">
    <button >Entrar</button>
    `
    document.body.appendChild(loginPage)
    loginPage.querySelector("button").addEventListener("click", tryLogin)
}
loadFirstPage()


function tryLogin(){
    const loginPage = document.querySelector(".first-page")
    const value = loginPage.querySelector("input").value
    thisUser = value
    registerParticipant()
    loadingIndication()

}
function loadingIndication(){
    document.querySelector(".this-input").remove()
    document.querySelector("button").remove()
    const create = document.createElement("img")
    create.classList.add("myloading")
    create.setAttribute("src", "./assets/loading.gif")
    document.querySelector(".first-page").appendChild(create)
}
//Tentar Registrar User
function registerParticipant(){
    const dados = {
        name: thisUser
    }
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados)
    requisicao.then(registerSuccess)
    requisicao.catch(loginErro)
}
//Manter status online
function iAmOnline(){
    const dados = {
        name: thisUser
    }
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dados)
    requisicao.catch(tratarErro)
}

function loginErro(erro) {
    if(erro.response.status == 400){
        alert("Já existe um user com o mesmo nome, tente outro.")
        window.location.reload()
    }
}
function registerSuccess(){
    hasRegistered = true
    document.querySelector(".first-page").remove()
    const refresh = setInterval(getParticipants, 10000)
    document.querySelector(".app").style.display = "grid"
    getMessages()
    const refreshMsg = setInterval(getMessages, 5000)
}

//Carregar mensagens
let loadedMessages = {}
function getMessages(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promisse.then(printMessages)    
    promisse.catch(tratarErro)

}

//Carregar mensagens na tela
let lockview = true
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
        if(i == data.length-1){
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
    if (lockview == true){
        document.querySelector(".lockintoview").scrollIntoView()
    }
}

//Controlador scrollIntoView
function swapLock(){
    const btn = document.querySelector(".btnlock")
    lockview = !lockview
    if(lockview == true){
        btn.innerHTML = `<ion-icon name="flash-outline"></ion-icon>`
    }
    else{
        btn.innerHTML = `<ion-icon name="flash-off-outline"></ion-icon>`
    }
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
        document.querySelector(".menu").style.right= "-70%"
        menuState = !menuState
    }
}

//Pegar lista de Users Online
function getParticipants(){
    iAmOnline()
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promisse.then(printParticipants)
    getMessages()
}
//Printar Users Online
function printParticipants(response){
    const userList = document.querySelector(".menu .list")
    userList.innerHTML = ""
    const printTodos = document.createElement("span")
    printTodos.innerHTML=`
    <div class="wrapper">
        <img class="all" src="./assets/menu.png" alt="">
        <h2>Todos</h2>
    </div>
    <ion-icon name="checkmark-sharp"></ion-icon>
    `
    printTodos.addEventListener("click", selectUser)
    userList.appendChild(printTodos)

    for (let i = 0; i < response.data.length; i++) {
        const create = document.createElement("span")
        create.classList.add("new")
        create.innerHTML = `
            <div class="wrapper">
                <img src="./assets/user.png">
                <div class="txt-overflow"><h2>${response.data[i].name}</h2></div>
            </div>
            <ion-icon class="check" name="checkmark-sharp"></ion-icon>
        `
        create.addEventListener("click", selectUser)
        userList.appendChild(create)
    }
}

function selectUser(){
    const userList = document.querySelectorAll(".menu .list span")
    for (let i = 0; i < userList.length; i++) {
        userList[i].querySelector("ion-icon").style.visibility = "hidden"
        if(userList[i].classList.contains("outlined")){
            userList[i].classList.remove("outlined")
        }
    }
    this.querySelector("ion-icon").style.visibility = "visible"
    this.classList.add("outlined")
}

function tratarErro(erro) {
  console.log("Status code: " + erro.response.status) // Ex: 404
    alert("você foi desconectado, algo inesperado aconteceu nos servidores/sua internet")
	window.location.reload() // Ex: Not Found
}