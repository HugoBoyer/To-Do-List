
// =========================
// 🔹 Données
// =========================
const notes = [];

// =========================
// 🔹 Panneau d'édition (objet)
// =========================
const editor = {
    element: document.createElement("div"),
    current: null, // note selectionner

    init(parent) {
        this.element.id = "editor";
        this.element.classList.add("edit")
        this.element.setAttribute("contenteditable", "true");
        parent.appendChild(this.element);
    },

    show(note) {
        this.current = note;
        this.element.textContent = note.content || ""
    },

    update() {
        if (this.current) {
            this.current.content = this.element.textContent
        }
    },

    clear() {
        this.element.textContent = "";
        this.current = null;
    }
}

// =========================
// 🔹 Interface
// =========================
const addbtn = document.getElementById("addBtn")
const taskList = document.querySelector(".taskList")
const taskOption = document.querySelector(".taskOption")
const todoContainer = document.getElementById("todo-container")
const taskForm = document.getElementById("taskForm")
const spanDeleteModal = document.getElementById("deleteModal")
const modeSelector = document.getElementById("modeSelector")
const userName = document.getElementById("userName")

// =========================
// 🔹 Variables globales
// =========================
let selectedTask = null



const editorWrapper = document.createElement("div");
editorWrapper.classList.add("editor-wrapper");

const editorHeader = document.createElement("div");
editorHeader.classList.add("editor-header");

const editorTitle = document.createElement("div");
editorTitle.classList.add("editor-title");
editorTitle.setAttribute("contenteditable", "true");
editorTitle.textContent = "Titre de la note";

editorHeader.appendChild(editorTitle);
editorWrapper.appendChild(editorHeader);
// Initialisation du vrai éditeur (zone principale)
editor.init(editorWrapper);
editor.element.classList.add("editor-content");

// On assemble

taskOption.appendChild(editorWrapper);
// =========================
//  event Ajouter une tache
// =========================
addbtn.addEventListener("click", () => {
    taskForm.style.display = 
    taskForm.style.display === "none" ? "block" : "none";
     if(taskForm.style.display === "block") {
        document.getElementById("taskForm").focus()
     }  
})

// =========================
// 🔹 Bouton fermer le modal
// =========================
spanDeleteModal.addEventListener("click", () => {
    taskForm.style.display = "none"
})


// =========================
//  event envoie du formulaire
// =========================
taskForm.addEventListener('submit', (e) => { 
    e.preventDefault();
    const taskName = document.getElementById("taskName").value
    const urgency = document.getElementById("taskUrgency").value

    if(!taskName) return

    addTask(taskName, urgency)
    taskForm.reset()
    taskForm.style.display = "none";
})

// =========================
//  
// =========================



// =========================
//  event Editor
// =========================
editor.element.addEventListener("input", () => {
    editor.update()

    // si on veut aussi synchroniser dataset du DOM (optionnel)
    if(selectedTask){
        selectedTask.dataset.content = editor.element.textContent;
    }
})

// =========================
//  Selection de mode
// =========================
modeSelector.addEventListener("change", () => {
    const mode = modeSelector.value

    if (mode === "checkbox") {
            editor.element.removeAttribute("contenteditable");
            // 🆕 Ajouter le bouton pour créer des checkboxes seulement s'il existe deja          
            if(!document.getElementById("addCheckbox")) {
                addCheckboxButton();
            }

            // ✅ Ajouter une checkbox seulement si le contenu est vide
            if (editor.element.innerHTML.trim() === "") {
                addCheckboxStep(editor.element);
            }
        }
})

// =========================
//  function
// =========================

// creer une checkbox
function addCheckboxStep(editor) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const editableTextSpan = document.createElement("span");
    editableTextSpan.textContent = "Nouvelle Étape";
    editableTextSpan.setAttribute("contenteditable", "true");
    editableTextSpan.classList.add("editableTextSpan")

    editor.appendChild(document.createElement("br"));
    label.appendChild(checkbox);
    label.appendChild(editableTextSpan);
    editor.appendChild(label);
    editor.appendChild(document.createElement("br"));
    
    console.log("✅ Checkbox créée et ajoutée au DOM !"); // Debug
}

//ajouter une checkbox
function addCheckboxButton() {
    const butttonCheckbox = document.createElement("button")
    butttonCheckbox.id = "addCheckbox"
    butttonCheckbox.classList.add("addCheckboxBtn");
    butttonCheckbox.textContent = "➕"

    butttonCheckbox.addEventListener("click", () => {
        addCheckboxStep(editor.element)
    })
    editor.element.appendChild(butttonCheckbox)
}

// Ajouter une tache
function addTask(taskName, urgency) {
    // creer <div>
    const div = document.createElement("div");
    div.classList.add("task-item"); // optionnel pour le style

    // creer <li pour l'affichage des tache>
    const li = document.createElement("li");
    li.textContent = taskName;
    li.dataset.content = "";// stocke le contenu éditable
    
    //creation du rond d'urgence de tache
    const spanUrgency = document.createElement("div")
    const urgencyColors = {
        "1": "low",
        "2": "medium",
        "3": "high"
    }
    spanUrgency.classList.add(urgencyColors[urgency]);


    div.addEventListener("click", () => {
        selectedTask = li;
        editor.show({ content: li.dataset.content || ""});
        editor.current = { content: li.dataset.content || ""}
    })


    div.appendChild(li)
    div.appendChild(spanUrgency)
    taskList.appendChild(div)
}




