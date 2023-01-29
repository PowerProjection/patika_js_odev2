document.querySelector('#ekleButton').addEventListener("click", submitHandler)

function submitHandler(e) {
    e.preventDefault();
    let str = document.querySelector('#inputField')
    let storageObject = {name:str.value, isDone:false}
    saveTodo(storageObject)
    str.value = "" //inputu temizle
}

function saveTodo(todoObject) {
    if (todoObject.name && todoObject.name[0] != " "){
        setStorageItems(todoObject) //localstorage ekleme
        
    } else {
        Toasty("Listeye boş ekleme yapamazsınız❗❗❗ (Boşluk karakteri ile başlamayınız.)","red")
    }
}

function todoDone(event) {
    const todos = JSON.parse(localStorage.getItem("todos"))
    let li, todotext, tick, strValue;
    const name = event.target.nodeName
    
    if(name == "DIV") {
        li = event.target.parentNode.classList;
        todotext = event.target.childNodes[0].classList;
        tick = event.target.previousElementSibling.childNodes[0];
        strValue = event.target.childNodes[0].textContent;

    } else if (name == "SPAN") {
        li = event.target.parentNode.parentNode.classList;
        todotext = event.target.classList;
        tick = event.target.parentNode.previousElementSibling.childNodes[0];
        strValue = event.target.textContent;
    } 

    
    // storage UPDATE true/false function start
    function setStorageIsDone(trueOrFalse) {
        const newList = []
        todos.forEach((e) => {
            // console.log(e)
            if(e.name === strValue) { 
                let trueFalse = trueOrFalse
                let item = {name:e.name, isDone: trueFalse}
                newList.push(item)
            } else {
                newList.push(e)
            }
        })
        localStorage.setItem("todos", JSON.stringify(newList))
    }
    // storage UPDATE true/false function end 

    li.contains("todoLiDone") ?
    li.remove("todoLiDone") & todotext.remove("todoTextDone") & (tick.style.display = 'none') & setStorageIsDone(false):
    li.add("todoLiDone") & todotext.add("todoTextDone") & (tick.style.display = 'block') & setStorageIsDone(true) //done

}

function getStorageItems() {
    let todos;
    if (!localStorage.getItem("todos")) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    return todos
}

function setStorageItems(newTodo) {
    let todos = getStorageItems()

    const exists = todos.some((e) => {return e.name === newTodo.name} )

    if(!exists) {
        todos.push(newTodo);
        localStorage.setItem("todos", JSON.stringify(todos));
        Toasty(`✅ '${newTodo.name}' başarıyla eklendi.`, '#35ff09')
        load();
    } else {
        Toasty(`'${newTodo.name}' zaten mevcut.❗❗❗`, 'red')
    }
    
}

function createTodoLiItem(strValue,isDone) {
    //li start
    const li = document.createElement("li")
    isDone ? li.classList.add("todoLi", "todoLiDone") : li.classList.add("todoLi")
    // li end

    //tick start
    const tickDiv = document.createElement("div")
    const tickSpan = document.createElement("span")
    tickDiv.classList.add("tick")
    tickSpan.textContent = "✅"
    isDone ? tickSpan.style.display = "block" : tickSpan.style.display = "none"
    tickDiv.append(tickSpan)
    //tick end

    //todotext start
    const textDiv = document.createElement("div")
    const textSpan = document.createElement("span")
    textDiv.classList.add("todoTextDiv")
    textDiv.onclick = function(event) { todoDone(event); };
    isDone ? textSpan.classList.add("todoText", "todoTextDone") : textSpan.classList.add("todoText")
    textSpan.textContent = strValue
    textDiv.append(textSpan)
    //todotext end
    
    //closeBtn start
    const closeBtnDiv = document.createElement("div")
    const closeBtnX = document.createElement("span")
    closeBtnDiv.onclick = function(event) { removeFromStorage(event); };
    closeBtnDiv.classList.add("closeDiv")
    closeBtnX.classList.add("closeBtn")
    closeBtnX.textContent = "✖"
    closeBtnDiv.append(closeBtnX)
    //closeBtn end

    li.append(tickDiv)
    li.append(textDiv)
    li.append(closeBtnDiv)
    const list = document.querySelector("#list")
    list.append(li)
}

function removeFromStorage(event) {
    // console.log("REMOVE: ", event)
    const li = event.target.parentNode.parentNode
    li.remove()
    let strValue = li.childNodes[1].childNodes[0].textContent
    
    //storage removal function
    const newList = []
    
    function setStorageIsDone() {
        const todos = JSON.parse(localStorage.getItem("todos"))
        todos.forEach((e) => {
            if(e.name != strValue) { 
                newList.push(e)
            } 
        })
        localStorage.setItem("todos", JSON.stringify(newList))
    }

    //storage removal function
    setStorageIsDone()
    Toasty(`✅ '${strValue}' başarıyla silindi.`, '#35ff09')
    load() //sildikten sonra listeyi yenile

}


function load() {
    const list = document.querySelector('#list')
    list.innerHTML = ""
    if (JSON.parse(localStorage.getItem("todos")) === null || JSON.parse(localStorage.getItem("todos")).length === 0 ) {
        let div = document.createElement("div")
        let p =  document.createElement("p")
        p.textContent = "Lütfen listeye yapılacak ekleyin..."
        p.style = "text-align: center;margin-top:10px; font-weight:bold;color: #909090"
        div.style = "display:flex; flex:1;justify-content:center;align-items:center"
        div.append(p)
        list.append(div)
        return -1
    }
    const storage = JSON.parse(localStorage.getItem("todos"))
    storage.forEach((e) => {
        createTodoLiItem(e.name, e.isDone)
    })
}


var option = {
    animation : true,
    delay : 2000,
    autohide : true,
};

function Toasty(mesaj,renk) {
    const body = document.querySelector('.toast-body')
    body.innerHTML = mesaj
    body.style = `background-color: ${renk}`
    const div = document.querySelector('#error_emptyTodo')
    div.classList.remove("d-none")
    var toastHTMLElement = div
    var toastElement = new bootstrap.Toast(toastHTMLElement, option)
    toastElement.show();
}


window.onload = (
    load())