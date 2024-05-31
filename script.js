const addBtn = document.querySelector("#adicionar-button");
const addText = document.querySelector("#adicionar-text");
const pesquisarBtn = document.querySelector("#pesquisar-button");
const pesquisarText = document.querySelector("#pesquisar");
const filtroLista = document.querySelector("#filtro");
const todoList = document.querySelector("#todo-list");
const cancelButton = document.querySelector("#cancelar-button");
let tarefasData = localStorage.getItem("tarefas");
let editingBlock;

if (tarefasData) {
    carregarTarefas();
}

addBtn.addEventListener("click", () => {
    const val = addText.value;
    if (val) {
        if (addBtn.classList.contains("editing")) {
            editingBlock.getElementsByClassName("tarefa-text")[0].innerText = val;
            editMode(false);
            saveData();
        } else {
            adicionarTarefa(val, "afazer");
        }
        addText.value = "";
    }
})

pesquisarBtn.addEventListener("click", () => {
    pesquisarText.value = "";
    filtrarTarefas();
})

pesquisarText.addEventListener("input", filtrarTarefas);

filtroLista.addEventListener("input", filtrarTarefas);

cancelButton.addEventListener("click", () => {
    editMode(false);
    editingBlock = null;
})

function adicionarTarefa(nome, status) {
    const newBlock = criarDiv("tarefa", "div");
    const newText = criarDiv("tarefa-text", "p");
    
    const buttonsBlock = criarDiv("buttonsBlock", "div");

    const feitoBtn = criarDiv("check", "button", "button");
    const editBtn = criarDiv("edit", "button", "button");
    const delBtn = criarDiv("del", "button", "button");

    newText.innerHTML = nome;

    newBlock.appendChild(newText);
    newBlock.appendChild(buttonsBlock);
    newBlock.classList.add(status);

    buttonsBlock.appendChild(feitoBtn);
    buttonsBlock.appendChild(editBtn);
    buttonsBlock.appendChild(delBtn);

    todoList.appendChild(newBlock);
    loadBtnFunctions(buttonsBlock);

    saveData();
    filtrarTarefas();
}

function filtrarTarefas() {
    const text = pesquisarText.value;
    const category = filtroLista.value;

    let filteredWords = Array.from(todoList.children).filter((box) => box.textContent.substring(0, text.length).toLowerCase() == text.toLowerCase());

    if (category == "feitos") {
        filteredWords = filteredWords.filter((box) => box.classList.contains("feitos"));
    } else if (category == "afazer") {
        filteredWords = filteredWords.filter((box) => box.classList.contains("afazer"));
        console.log(filteredWords);
    }

    Array.from(todoList.children).forEach((v) => {
        if (!filteredWords[v]) {
            v.style.display = "none";
        }
    })

    filteredWords.forEach((box) => {box.style.display = "flex"});
}

function criarDiv(nome, element, type) {
    const btn = document.createElement(element);

    if (type) {btn.type = type;}
    btn.classList.add(nome);
    return btn;
}

function loadBtnFunctions(btn) {
    const feitoBtn = btn.getElementsByClassName("check")[0];
    const editBtn = btn.getElementsByClassName("edit")[0];
    const delBtn = btn.getElementsByClassName("del")[0];
    const block = btn.parentElement;

    feitoBtn.onclick = () => {
        if (block.classList.contains("feitos")) {
            block.classList.add("afazer");
            block.classList.remove("feitos");
        } else {
            block.classList.remove("afazer");
            block.classList.add("feitos");
        }
        saveData();
    }

    editBtn.onclick = () => {
        editMode(true, block.textContent);
        editingBlock = block;
    }

    delBtn.onclick = () => {
        block.remove();
        saveData();
    }
}

function carregarTarefas() {
    const data = JSON.parse(tarefasData);
    data.forEach((val) => {
        adicionarTarefa(val.text, val.status)
    })
}

function saveData() {
    const tarefas = todoList.getElementsByClassName("tarefa");
    tarefasData = [];

    Array.from(tarefas).forEach((tarefa) => {
        tarefasData[tarefasData.length] = {
            "text": tarefa.textContent,
            "status": tarefa.classList[1]
        }
    })

    console.log(tarefasData);
    localStorage.setItem("tarefas", JSON.stringify(tarefasData));
}

function editMode(bool, text) {
    const title = document.querySelector("label[for~='adicionar-text'");
    if (bool) {
        adjustSection(false);
        title.innerText = "Editar";
        addText.setAttribute("placeholder", text);
        addBtn.classList.add("editing");
    } else {
        adjustSection(true);
        title.innerText = "Adicione sua tarefa";
        addText.setAttribute("placeholder", "O que você vai fazer?");
        addBtn.classList.remove("editing");
    }
}

function adjustSection(bool) {
    const section = document.querySelector("#pesquisa-filtro");
    if (bool) {
        section.style.display = "block";
        cancelButton.style.display = "none";
        return;
    }
    section.style.display = "none"
    cancelButton.style.display = "block";
}