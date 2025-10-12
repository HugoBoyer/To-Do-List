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



const namePrompt = prompt("Veuiller entrer votre nom")
if(namePrompt) {
    userName.textContent = namePrompt
}




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
        maDiv.innerHTML = li.dataset.content    
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



/* 
===============================

TEST

==============================
*/
modeSelector.addEventListener("change", () => {
    const mode = modeSelector.value

    if(selectedTask && maDiv.hasAttribute("contenteditable")) {
        selectedTask.dataset.content = maDiv.innerHTML
    }

    maDiv.innerHTML = ""

    if(mode === "edit") {
        maDiv.setAttribute("contenteditable", "true");  
        maDiv.innerHTML = selectedTask ? selectedTask.dataset.content : "";
    }

    else if(mode === "checkbox") {
        maDiv.removeAttribute("contenteditable", "true"); 
         const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const span = document.createElement("span");
        span.textContent = "Nouvelle étape";
        span.setAttribute("contenteditable", "true");

        label.appendChild(checkbox);
        label.appendChild(span);
        maDiv.appendChild(label);
        maDiv.appendChild(document.createElement("br"));

    }

    else if (mode === "kanban") {
    maDiv.removeAttribute("contenteditable");

    maDiv.innerHTML = `
      <div class="kanban">
        <div class="column" id="todo">À faire</div>
        <div class="column" id="doing">En cours</div>
        <div class="column" id="done">Fait</div>
      </div>
    `;
    }
})

if (!maDiv.hasAttribute("data-checkbox-listener")) {
  maDiv.setAttribute("data-checkbox-listener", "true");

    maDiv.addEventListener("click", (e) => {
        const currentMode = modeSelector.value;
        if(currentMode === "checkbox" && e.target === maDiv) {
            const label = document.createElement("label") 
    
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
    
            const editableTextSpan = document.createElement("span")
            editableTextSpan.textContent = "Nouvelle Etape";
            editableTextSpan.setAttribute("contenteditable", "true");                    
            
            label.appendChild(checkbox)
            label.appendChild(editableTextSpan)
            maDiv.appendChild(label)
            maDiv.appendChild(document.createElement("br"))
        } 
    })
}
