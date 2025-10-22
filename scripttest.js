
// =========================
// 🔹 Données
// =========================
const notes = [];

// Charger toutes les tâches depuis localStorage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
}

// Sauvegarder toutes les tâches dans localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Sauvegarder une tâche spécifique
function saveTaskData(taskId, data) {
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...data };
    } else {
        tasks.push({ id: taskId, ...data });
    }
    
    saveTasks(tasks);
}


// Récupérer les données d'une tâche
function getTaskData(taskId) {
    const tasks = loadTasks();
    return tasks.find(t => t.id === taskId) || null;
}


// Supprimer une tâche du localStorage
function deleteTaskData(taskId) {
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    saveTasks(filtered);
}

// utilitaire pour attacher les événements à UN seul label
attachEventsToCheckbox = (label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    const deleteSpan = label.querySelector('span:first-child');
    const editableSpan = label.querySelector('.editableTextSpan')

    if(!checkbox || !deleteSpan || !editableSpan) return
        
    editableSpan.setAttribute("contenteditable", "true")

    const newDeleteSpan = deleteSpan.cloneNode(true);
    deleteSpan.replaceWith(newDeleteSpan);
    newDeleteSpan.addEventListener('click', () => {
        label.remove();
        editor.update();
    });

    // 2. Événement d'édition
    const newEditableSpan = editableSpan.cloneNode(true);
    editableSpan.replaceWith(newEditableSpan);
    newEditableSpan.addEventListener("input", () => {
        editor.update();
    });
    
    // 3. Événement de changement d'état (checked/unchecked)
    const newCheckbox = checkbox.cloneNode(true);
    checkbox.replaceWith(newCheckbox);
    newCheckbox.addEventListener("change", () => {
        if (newCheckbox.checked === true) {
            taskFinish.appendChild(label);
        } else {
            editor.element.appendChild(label);
        }
        editor.update();
    });

    // 💡 Bonus : Gérer l'état checked initial au chargement
    if (newCheckbox.checked || newCheckbox.hasAttribute('checked')) {
         newCheckbox.setAttribute('checked', 'checked');
    } else {
        newCheckbox.removeAttribute('checked');
    }
}

// Réattacher les événements aux checkboxes chargées
reattachCheckboxEvents = () => {
     // Gérer les checkboxes dans l'éditeur ET dans taskFinish
    const Alllabels = [
        ...editor.element.querySelectorAll("label"),
        ...taskFinish.querySelectorAll("label")
    ]

    Alllabels.forEach(label => {
        attachEventsToCheckbox(label)
    })
}
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
        //  SAUVEGARDER l'ancienne tâche avant de changer
        if (this.current && this.current !== taskElement) {
            this.update();
        }

        this.current = taskElement;
        const taskId = taskElement.dataset.id;

        // Charger depuis localStorage
        const savedData = getTaskData(taskId);

        if (savedData) {
            editorTitle.textContent = savedData.title || "Titre de la note";
            //  Charger le contenu directement
            this.element.innerHTML = savedData.content || "";


            if (savedData.finishedContent && savedData.finishedContent.trim() !== "") {
            taskFinish.innerHTML = savedData.finishedContent;
            } else {
                taskFinish.innerHTML = "";
                taskFinish.textContent = "Tâche Terminée";
            }
        } else {
             editorTitle.textContent = taskElement.dataset.title || "Titre de la note";
            this.element.innerHTML = taskElement.dataset.content || "";
            taskFinish.innerHTML = "";
            taskFinish.textContent = "Tâche Terminée";
        }


        const currentMode = modeSelector.value;
        
        if (currentMode === "checkbox") {
            this.element.removeAttribute("contenteditable");
            if (!editorWrapper.contains(editorFooter)) {
                editorWrapper.appendChild(editorFooter);
            }
        
            if (!document.getElementById("addCheckbox")) {
                addCheckboxButton();
            }
            reattachCheckboxEvents();
        } else {
            this.element.setAttribute("contenteditable", "true");
            const btn = document.getElementById("addCheckbox");
            if (btn) btn.remove();

        /*    if (editorWrapper.contains(editorFooter)) {
            editorFooter.remove();
        }*/
        }
    },

    update() {
         if (this.current) {
        const taskId = this.current.dataset.id;

        const labels = this.element.querySelectorAll('label');
        labels.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                checkbox.setAttribute('checked', 'checked');
            } else if (checkbox) {
                checkbox.removeAttribute('checked');
            }
        });
        
        // Faire pareil pour taskFinish
        const finishedLabels = taskFinish.querySelectorAll('label');
        finishedLabels.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.setAttribute('checked', 'checked'); // Toujours checked dans taskFinish
            }
        });

        const content = this.element.innerHTML;
        const title = editorTitle.textContent;
        const mode = modeSelector.value;

        const finishedContent = taskFinish.innerHTML;
        
        // Sauvegarder dans dataset (comme avant)
        this.current.dataset.content = content;
        this.current.dataset.title = title;
        
        //  Sauvegarder dans localStorage
        saveTaskData(taskId, {
            title: title,
            content: content,
            finishedContent: finishedContent, 
            mode: mode
        });
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
editorFooter.appendChild(taskFinish);
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
       // 🔹 Charger les tâches sauvegardées
    const savedTasks = loadTasks();
    savedTasks.forEach(task => {
        addTask(task.title, task.urgency, task.id, task.content, task.mode);
    });

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
// changer en selectionnant checkbox
function switchCheckbox() {
    editor.element.removeAttribute("contenteditable");

     if (!editorWrapper.contains(editorFooter)) {
        editorWrapper.appendChild(editorFooter);
    }

    if (!editorFooter.contains(taskFinish)) {
        editorFooter.appendChild(taskFinish); 
    }

    addCheckboxButton();

    const hasCheckboxes = editor.element.querySelector('input[type="checkbox"]');

    if (!hasCheckboxes) {
        const rawText = editor.element.textContent.trim();
        
        // Si l'éditeur contenait du texte simple, on le vide
        if (rawText !== "") {
            editor.element.innerHTML = ""; 
        }

    }
    
    // Si l'éditeur est vide après le nettoyage (ou était déjà vide)
    if (!hasCheckboxes && editor.element.innerHTML.trim() === "") {
        addCheckboxStep(editor.element);
    }
    reattachCheckboxEvents();

    editor.update(); // ✅ Déjà là, c'est bon
}

// changer en selectionnant edit
function switchEditMode() {
    // Supprimer le bouton ➕
    const btn = document.getElementById("addCheckbox");
    if (btn) btn.remove();

    editor.element.setAttribute("contenteditable", "true");

    if (editorFooter.contains(taskFinish)) {
        taskFinish.remove(); 
    }
    if (editorWrapper.contains(editorFooter)) {
        editorFooter.remove();
    }
    //  Détecter si l'éditeur contient des éléments spécifiques au mode checkbox
    const hasCheckboxElements = editor.element.querySelector('label');
    
    // Si des éléments de checkbox sont présents, on vide l'éditeur.
    if (hasCheckboxElements) {
        // Vider l'éditeur de tout le HTML complexe (labels, inputs, etc.)
        editor.element.innerHTML = ""; 
        
        // S'assurer qu'il y a un contenu vide qui permet de cliquer et de taper
        // Cela permet de commencer à écrire immédiatement sans erreur.
        editor.element.innerHTML = "<br>";
    }
    
    // 3. Vider la zone des tâches terminées (elle n'a pas de sens en mode Edit)
    taskFinish.innerHTML = "";
    taskFinish.textContent = "Tâche Terminée";

    editor.update(); // sauvegarder le changement de mode
}



// creer une checkbox
function addCheckboxStep(editorContainer) {
    console.log("🔵 addCheckboxStep appelée"); // DEBUG
    
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const editableTextSpan = document.createElement("span");
    editableTextSpan.textContent = "Nouvelle Étape";
    editableTextSpan.setAttribute("contenteditable", "true");
    editableTextSpan.classList.add("editableTextSpan")
    const deleteSpan = document.createElement("span")
    
    deleteSpan.textContent = "X"
    /*deleteSpan.addEventListener('click', () => {
        console.log("🟡 Delete cliqué"); // DEBUG
        label.remove()
        editor.update();
    })

    editableTextSpan.addEventListener("input", () => {
        console.log("🟢 Input modifié"); // DEBUG
        editor.update();
    });


    checkbox.addEventListener("change", () => { 
        console.log("🟣 Checkbox changée"); // DEBUG
        if(checkbox.checked === true) {
            taskFinish.appendChild(label)
        } else {
            editorContainer.appendChild(label);
        }
        editor.update();
    })*/

   
   
   label.appendChild(deleteSpan)
   label.appendChild(checkbox);
   label.appendChild(editableTextSpan);
   
   attachEventsToCheckbox(label);

   editorContainer.appendChild(label);

    // 🔹 Sauvegarder immédiatement après création
    console.log("🔴 Appel de editor.update()"); // DEBUG

    editor.update();
    
    console.log("✅ Checkbox créée et sauvegardée !"); 
}

//ajouter une checkbox
function addCheckboxButton() {
    // Si le bouton existe déjà, ne rien faire
    if (document.getElementById("addCheckbox")) {
        console.log("⚠️ Bouton ➕ existe déjà");
        return;
    }
    console.log("➕ Création du bouton");

    const butttonCheckbox = document.createElement("button")
    butttonCheckbox.id = "addCheckbox"
    butttonCheckbox.classList.add("addCheckboxBtn");
    butttonCheckbox.textContent = "➕"

    butttonCheckbox.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("🔵 Bouton ➕ cliqué !");
        console.log("🔵 editor.current =", editor.current);
        addCheckboxStep(editor.element)
    })
    editorFooter.appendChild(butttonCheckbox)
}

// Ajouter une tache
// Ajouter une tache
function addTask(taskName, urgency, taskId = null, savedContent = "", savedMode = "edit") {
    const div = document.createElement("div");
    div.classList.add("task-item");

    const li = document.createElement("li");
    li.textContent = taskName;

    // 🔹 Générer un ID vraiment unique
    const id = taskId || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    li.dataset.id = id;
    li.dataset.content = savedContent;
    li.dataset.title = taskName;

    // 🔹 Sauvegarder dans localStorage (seulement si nouvelle tâche)
    if (!taskId) {
        saveTaskData(id, {
            id: id, // 🔹 Important : sauvegarder aussi l'ID
            title: taskName,
            content: savedContent,
            urgency: urgency,
            mode: savedMode
        });
    }
    
    const deleteDivTask = document.createElement("span")
    deleteDivTask.textContent = "✖"    
    deleteDivTask.classList.add("delete");
    deleteDivTask.addEventListener("click", (e) => {
        e.stopPropagation();
        DeleteTask(li, div)
    })

    const editTache = document.createElement("span")
    editTache.textContent = "✏️"
    editTache.addEventListener("click", (e) => {
        e.stopPropagation();
        
        const currentUrgency = spanUrgency.classList.contains('low') ? '1' : 
                               spanUrgency.classList.contains('medium') ? '2' : '3';
        
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
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editFormHTML;
        const editForm = tempDiv.firstElementChild;
        
        document.body.appendChild(editForm);
        
        const inputName = editForm.querySelector('input');
        const selectUrgency = editForm.querySelector('select');
        inputName.focus();
        
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newName = inputName.value.trim() || "Tâche sans nom";
            li.textContent = newName;
            
            // 🔹 Mettre à jour aussi dans localStorage
            saveTaskData(id, { title: newName });
            
            const urgencyColors = { "1": "low", "2": "medium", "3": "high" };
            spanUrgency.className = urgencyColors[selectUrgency.value];
            
            // 🔹 Mettre à jour l'urgence dans localStorage
            saveTaskData(id, { urgency: selectUrgency.value });
            
            editForm.remove();
        });
        
        editForm.querySelector('.btn-cancel').addEventListener("click", () => editForm.remove());
        
        setTimeout(() => {
            document.addEventListener("click", function closeForm(e) {
                if (!editForm.contains(e.target) && e.target !== editTache) {
                    editForm.remove();
                    document.removeEventListener("click", closeForm);
                }
            });
        }, 0);
    });

    const spanUrgency = document.createElement("div")
    const urgencyColors = {
        "1": "low",
        "2": "medium",
        "3": "high"
    }
    spanUrgency.classList.add(urgencyColors[urgency]);

    div.addEventListener("click", () => {
        selectedTask = li;
        editorWrapper.style.display = "block";
        editor.show(li);
    })

    div.appendChild(deleteDivTask)
    div.appendChild(editTache)
    div.appendChild(li)
    div.appendChild(spanUrgency)
    taskList.appendChild(div)

    if (!taskId) { // Seulement pour les nouvelles tâches
        selectedTask = li;
        editorWrapper.style.display = "block";
        editor.show(li);
    }
}


function DeleteTask(taskElement, blockElement) {
    const taskId = taskElement.dataset.id;
    
        if (editor.current && editor.current.dataset.id === taskId) {
            editorWrapper.style.display = "none"
            editor.clear()
        }
    
    // 🔹 Supprimer du localStorage
    deleteTaskData(taskId);
    taskElement.remove()
    blockElement.remove()
}

