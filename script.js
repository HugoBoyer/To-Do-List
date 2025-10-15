const addbtn = document.getElementById("addBtn")
const taskList = document.querySelector(".taskList")
const taskOption = document.querySelector(".taskOption")
const todoContainer = document.getElementById("todo-container")
const taskForm = document.getElementById("taskForm")
let selectedTask = null
const maDiv = document.createElement("div")
const spanDeleteModal = document.getElementById("deleteModal")
const modeSelector = document.getElementById("modeSelector")

const userName = document.getElementById("userName")

maDiv.classList.add("edit")
maDiv.setAttribute("contenteditable", "true");

/*

const namePrompt = prompt("Veuiller entrer votre nom")
if(namePrompt) {
    userName.textContent = namePrompt
}

*/


addbtn.addEventListener("click", () => {
    taskForm.style.display = 
    taskForm.style.display === "none" ? "block" : "none";
     if(taskForm.style.display === "block") {
        document.getElementById("taskForm").focus()
     }  
})

spanDeleteModal.addEventListener("click", () => {
    taskForm.style.display = "none"
})

taskForm.addEventListener('submit', (e) => { 
    e.preventDefault();
    const taskName = document.getElementById("taskName").value
    const urgency = document.getElementById("taskUrgency").value

    if(!taskName) return
    addTask(taskName, urgency)
    taskForm.reset()
    taskForm.style.display = "none";
})


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
    spanUrgency.dataset.urgency = urgency
    const urgencyColors = {
        "1": "low",
        "2": "medium",
        "3": "high"
    }
    spanUrgency.classList.add(urgencyColors[urgency]);
    
    li.addEventListener("click",() => {
        if(selectedTask) {
            selectedTask.dataset.content = maDiv.innerHTML;
       
        } 
        selectedTask = li 
        resetMaDivStructure(); // ✅ reconstruit titre + contenu

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = li.dataset.content;

        const oldTitle = tempDiv.querySelector(".titre");
        if (oldTitle) {
            maDiv.querySelector(".titre").textContent = oldTitle.textContent;
        }

        const oldContent = tempDiv.querySelector(".contenu");
        if (oldContent) {
            maDiv.querySelector(".contenu").innerHTML = oldContent.innerHTML;
        }    
        maDiv.focus();
    })        
    
    
    //creer <div pour supprimer> 
    const deleteDiv = document.createElement("span")
    deleteDiv.textContent = "✖"    
    deleteDiv.classList.add("delete"); // optionnel pour le style
    deleteDiv.addEventListener("click", () => {
        DeleteTask(div, maDiv)
    })

    //creer <div pour editer la tache>
    const editTache = document.createElement("span")
    editTache.textContent = "🖊️"
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
     
    })

    taskOption.appendChild(maDiv)      
    div.appendChild(deleteDiv)
    div.appendChild(editTache)  
    div.appendChild(spanUrgency)
    div.appendChild(li)
    taskList.appendChild(div)
}



function DeleteTask(taskElement, blockElement) {
    taskElement.remove()
    blockElement.remove()
}

maDiv.addEventListener("input", () => {
    if (selectedTask) {
        selectedTask.dataset.content = maDiv.innerHTML;
    }
});



function resetMaDivStructure() {
    maDiv.innerHTML = ""

    const title  = document.createElement("h2")
    title.textContent = "Titre"
    title.setAttribute("contenteditable", "true")
    title.classList.add("titre")

    const contentDiv = document.createElement("div")
    contentDiv.classList.add("contenu");

    maDiv.appendChild(title)
    maDiv.appendChild(contentDiv)
}

/* 
===============================

Changement de mode Selectionner

==============================
*/

modeSelector.addEventListener("change", () => {
    const mode = modeSelector.value

    if(selectedTask) {
        selectedTask.dataset.content = maDiv.innerHTML
    }

    resetMaDivStructure()

    const contentDiv = maDiv.querySelector(".contenu");
    const title = maDiv.querySelector(".titre");

    // 🆕 Supprimer le bouton existant s'il y en a un
    const existingBtn = maDiv.querySelector(".addCheckboxBtn");
    if (existingBtn) existingBtn.remove();

    if (selectedTask) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = selectedTask.dataset.content;

        const oldTitle = tempDiv.querySelector(".titre");
        if (oldTitle) {
            title.textContent = oldTitle.textContent;
        }

        const savedContent = tempDiv.querySelector(".contenu");
        const oldContent = savedContent ? savedContent.innerHTML : "";

        if (mode === "edit") {
            contentDiv.setAttribute("contenteditable", "true");

            // ✅ Extraire uniquement le texte des checkboxes
            const temp = document.createElement("div");
            temp.innerHTML = oldContent;

            // Si on a des checkboxes, convertir en texte simple
            const labels = temp.querySelectorAll("label");
            if (labels.length > 0) {
                let plainText = "";
                labels.forEach(label => {
                    const span = label.querySelector("span");
                    if (span && span.textContent !== "Nouvelle Étape") {
                        plainText += span.textContent + "<br>";
                    }
                });
                contentDiv.innerHTML = plainText;
            } else {
                // Sinon, garder le contenu tel quel
                contentDiv.innerHTML = oldContent;
            }
        } 

        else if (mode === "checkbox") {
            contentDiv.removeAttribute("contenteditable");
            contentDiv.innerHTML = oldContent;

            // ✅ Ajouter une checkbox seulement si le contenu est vide
            if (contentDiv.innerHTML.trim() === "") {
                addCheckboxStep(contentDiv);
            }

            // 🆕 Ajouter le bouton pour créer des checkboxes
            addCheckboxButton();
        }
    } else {
        // 🧼 Pas de tâche sélectionnée : juste init la zone
        if (mode === "edit") {
            contentDiv.setAttribute("contenteditable", "true");
        } else if (mode === "checkbox") {
            contentDiv.removeAttribute("contenteditable");
            addCheckboxStep(contentDiv);
            // 🆕 Ajouter le bouton
            addCheckboxButton();
        }
    }
})

// 🆕 Fonction pour ajouter un bouton de création de checkbox
function addCheckboxButton() {
    const btn = document.createElement("button");
    btn.textContent = "➕ Ajouter une étape";
    btn.classList.add("addCheckboxBtn");
    btn.type = "button"; // Important pour éviter la soumission de form
    
    btn.addEventListener("click", (e) => {
        e.preventDefault(); // Empêcher tout comportement par défaut
        e.stopPropagation(); // Empêcher la propagation
        
        console.log("Bouton cliqué !"); // Debug
        
        // ✅ Récupérer contentDiv au moment du clic
        const contentDiv = maDiv.querySelector(".contenu");
        console.log("contentDiv trouvé:", contentDiv); // Debug
        
        if (contentDiv) {
            addCheckboxStep(contentDiv);
            console.log("Checkbox ajoutée !"); // Debug
        } else {
            console.log("❌ Pas de contentDiv trouvé !"); // Debug
        }
    });
    
    maDiv.appendChild(btn);
}


function addCheckboxStep(contentDiv) {
    console.log("addCheckboxStep appelée"); // Debug

    console.log("✅ Création de la checkbox..."); // Debug

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const editableTextSpan = document.createElement("span");
    editableTextSpan.textContent = "Nouvelle Étape";
    editableTextSpan.setAttribute("contenteditable", "true");

    label.appendChild(checkbox);
    label.appendChild(editableTextSpan);
    contentDiv.appendChild(label);
    contentDiv.appendChild(document.createElement("br"));
    
    console.log("✅ Checkbox créée et ajoutée au DOM !"); // Debug
    
    // Focus automatique sur le nouveau champ
    editableTextSpan.focus();
}