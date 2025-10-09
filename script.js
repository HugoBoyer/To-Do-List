const addbtn = document.getElementById("addBtn")
const taskList = document.querySelector(".taskList")
const taskOption = document.querySelector(".taskOption")
const todoContainer = document.getElementById("todo-container")
const taskForm = document.getElementById("taskForm")
let selectedTask = null
const maDiv = document.createElement("div")
const spanDeleteModal = document.getElementById("deleteModal")
const modeSelector = document.getElementById("modeSelector")


maDiv.classList.add("edit")
maDiv.setAttribute("contenteditable", "true");


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

    taskOption.appendChild(maDiv)
    div.appendChild(spanUrgency)
    div.appendChild(li)
    div.appendChild(deleteDiv)
    
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

    if(mode === "edit") {
        maDiv.setAttribute("contenteditable", "true");  
        maDiv.innerHTML = selectedTask ? selectedTask.dataset.content : "";
    }

    else if(mode === "checkbox") {
        maDiv.removeAttribute("contenteditable", "true");  
        
        maDiv.innerHTML = `
      <label><input type="checkbox"> Étape 1</label><br>
      <label><input type="checkbox"> Étape 2</label><br>
      <label><input type="checkbox"> Étape 3</label>
    `;
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

