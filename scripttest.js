
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

 //creer <div pour editer la tache>
 const editTache = document.createElement("span")
    editTache.textContent = "✏️"
  // Créer le formulaire avec template literal
   editTache.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // Récupérer l'urgence actuelle
    const currentUrgency = spanUrgency.classList.contains('low') ? '1' : 
                           spanUrgency.classList.contains('medium') ? '2' : '3';
    
    // Créer le formulaire avec template literal
    const editFormHTML = `
        <form class="edit-task-form" style="position: absolute; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 300px;">
            <h2>Modifier le nom de la tâche</h2>
            <input type="text" value="${li.textContent}" placeholder="Nom de la tâche" required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <select required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="1" ${currentUrgency === '1' ? 'selected' : ''}>⚪ Faible</option>
                <option value="2" ${currentUrgency === '2' ? 'selected' : ''}>🟡 Moyenne</option>
                <option value="3" ${currentUrgency === '3' ? 'selected' : ''}>🔴 Urgente</option>
            </select>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn-cancel" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Annuler</button>
                <button type="submit" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Enregistrer</button>
            </div>
        </form>
    `;
    
    // Créer un div temporaire et insérer le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editFormHTML;
    const editForm = tempDiv.firstElementChild;
    
    // Ajouter au body et positionner
    document.body.appendChild(editForm);
    const rect = div.getBoundingClientRect();
    editForm.style.top = `${rect.top + window.scrollY}px`;
    editForm.style.left = `${rect.right + window.scrollX + 10}px`;
    
    const inputName = editForm.querySelector('input');
    const selectUrgency = editForm.querySelector('select');
    inputName.focus();
    
    // Soumission
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        li.textContent = inputName.value.trim() || "Tâche sans nom";
        
        const urgencyColors = { "1": "low", "2": "medium", "3": "high" };
        spanUrgency.className = urgencyColors[selectUrgency.value];
        
        editForm.remove();
    });
    
    // Annuler
    editForm.querySelector('.btn-cancel').addEventListener("click", () => editForm.remove());
    
    // Fermer si clic dehors
    setTimeout(() => {
        document.addEventListener("click", function closeForm(e) {
            if (!editForm.contains(e.target) && e.target !== editTache) {
                editForm.remove();
                document.removeEventListener("click", closeForm);
            }
            });
        }, 0);
    });
    
    
    /*
    editTache.classList.add("modalEdit"); // optionnel pour le style
    
    editTache.addEventListener("click", (e) => {
        //creation de l'input d'édition


        const inputEdit = document.createElement("input")
        inputEdit.type = "text"
        inputEdit.value = li.textContent
        

        //Remplacer le texte par l'input 
        li.textContent = ""
        li.appendChild(inputEdit)
       inputEdit.focus()
        
       inputEdit.addEventListener("keydown", (e) => {
           if(e.key === "Enter"){
            li.textContent = inputEdit.value.trim() || "Tâche sans nom"
        }
       })
     
    })*/

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
    div.appendChild(editTache)
    div.appendChild(li)
    div.appendChild(spanUrgency)
    taskList.appendChild(div)
}


function DeleteTask(taskElement, blockElement) {
    taskElement.remove()
    blockElement.remove()
}

