
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

    show(taskElement) {
        this.current = taskElement;
        editorTitle.textContent = taskElement.dataset.title || "Titre de la note";
        this.element.innerHTML = taskElement.dataset.content || ""; 
    
        if(modeSelector.value === "checkbox") {
            addCheckboxButton();
        }
    },

    update() {
        if (this.current) {
            this.current.dataset.content = this.element.innerHTML
            this.current.dataset.title = editorTitle.textContent;
            //this.current.textContent = editorTitle.textContent; // met à jour le nom visible dans la liste
        }
    },

    clear() {
        this.element.innerHTML = "";
        editorTitle.textContent = "Titre de la note";
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
let savedCheckboxes = [];


const editorWrapper = document.createElement("div");
editorWrapper.style.display = "none"
editorWrapper.classList.add("editor-wrapper");

const editorHeader = document.createElement("div");
editorHeader.classList.add("editor-header");

const editorFooter = document.createElement("div");
editorFooter.classList.add("editor-footer");

const taskFinish = document.createElement("div");
taskFinish.textContent = "Tache Terminer"
taskFinish.id = "finishedTask"

const editorTitle = document.createElement("div");
editorTitle.classList.add("editor-title");
editorTitle.setAttribute("contenteditable", "true");
editorTitle.textContent = "Titre de la note";

editorHeader.appendChild(editorTitle);
editorFooter.appendChild(taskFinish)
editorWrapper.appendChild(editorHeader);


// Initialisation du vrai éditeur (zone principale)
editor.init(editorWrapper);
editor.element.classList.add("editor-content");
editorWrapper.appendChild(editorFooter)
taskOption.appendChild(editorWrapper);


// =========================
//  event Au chargement de la page
// =========================
window.addEventListener("DOMContentLoaded", () => {
    const mode = modeSelector.value;
    if (mode === "checkbox") switchCheckbox();
    if (mode === "edit") switchEditMode();
});

// =========================
//  event met a jour le titre
// =========================
editor.element.addEventListener("input", () => {
    editor.update();
});

// 🔹 Quand on modifie le titre
editorTitle.addEventListener("input", () => {
    editor.update();
});
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
    editorWrapper.style.display = "block"
})

// =========================
//  event Editor
// =========================
editor.element.addEventListener("input", () => {
    editor.update()
})

// =========================
//  Selection de mode
// =========================
modeSelector.addEventListener("change", () => {
    const mode = modeSelector.value

    if (mode === "edit") {
        switchEditMode()
    }

    if (mode === "checkbox") {
            switchCheckbox()
        }
})

// =========================
//  function
// =========================

// changer en selectionnant checkbox
function switchCheckbox() {
    editor.element.removeAttribute("contenteditable");

    // Ajouter le bouton pour créer des checkboxes
    addCheckboxButton();

    // Vider uniquement les labels
    editor.element.querySelectorAll("label").forEach(label => label.remove());

    // Réinjecter les checkboxes sauvegardées
    savedCheckboxes.forEach(label => editor.element.appendChild(label))

    //  Ajouter une checkbox seulement si le contenu est vide
    if (editor.element.innerHTML.trim() === "") {
       addCheckboxStep(editor.element);
    }

    editor.update(); // mettre à jour dataset
}

// changer en selectionnant edit
function switchEditMode() {
    editorFooter.remove()
    editor.element.style.height = "auto"
    // Supprimer le bouton ➕ (optionnel)
    const btn = document.getElementById("addCheckbox");
    if(btn && modeSelector.value !== "checkbox") btn.remove();

    editor.element.setAttribute("contenteditable", "true");

    //enregistrement des label
    const saveLabel = Array.from(editor.element.querySelectorAll("label"));
    //suppression des label
    saveLabel.forEach(label => label.remove())

    editor.element.querySelectorAll("label").forEach(label => label.remove())



}



// creer une checkbox
function addCheckboxStep(editorContainer) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const editableTextSpan = document.createElement("span");
    editableTextSpan.textContent = "Nouvelle Étape";
    editableTextSpan.setAttribute("contenteditable", "true");
    editableTextSpan.classList.add("editableTextSpan")
    const deleteSpan = document.createElement("span")
    
    
    deleteSpan.textContent = "X"
    deleteSpan.addEventListener('click', () => {
        label.remove()
    })


    editableTextSpan.addEventListener("input", () => editorContainer.update());

    checkbox.addEventListener("change", () => { 
        if(checkbox.checked === true) {
            taskFinish.appendChild(label)
        } else {
            editorContainer.appendChild(label)
        }
        editor.update();
    })

    label.appendChild(deleteSpan)
    label.appendChild(checkbox);
    label.appendChild(editableTextSpan);
    editorContainer.appendChild(label);

    savedCheckboxes.push(label); // sauvegarde
    console.log("✅ Checkbox créée et ajoutée au DOM !"); // Debug
}


//ajouter une checkbox
function addCheckboxButton() {
    // Si le bouton existe déjà, ne rien faire
    if (document.getElementById("addCheckbox")) return;
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
    
    //creer <div pour supprimer> 
    const deleteDivTask = document.createElement("span")
    deleteDivTask.textContent = "✖"    
    deleteDivTask.classList.add("delete"); // optionnel pour le style
    deleteDivTask.addEventListener("click", () => {
        DeleteTask(li, div)
    })


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
        editor.show(li);
    })

    div.appendChild(deleteDivTask)
    div.appendChild(li)
    div.appendChild(spanUrgency)
    taskList.appendChild(div)
}


function DeleteTask(taskElement, blockElement) {
    taskElement.remove()
    blockElement.remove()
}

