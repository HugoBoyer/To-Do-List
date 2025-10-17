// =========================
// 🔹 Sélection des éléments
// =========================
const addbtn = document.getElementById("addBtn")
const taskList = document.querySelector(".taskList")
const taskOption = document.querySelector(".taskOption")
const todoContainer = document.getElementById("todo-container")
const taskForm = document.getElementById("taskForm")
const editor = document.createElement("div")
const spanDeleteModal = document.getElementById("deleteModal")
const modeSelector = document.getElementById("modeSelector")
const userName = document.getElementById("userName")


// =========================
// 🔹 Variables globales
// =========================
let selectedTask = null

// =========================
// 🔹 Configuration de l’éditeur
// =========================
editor.setAttribute("contenteditable","true")
editor.classList.add("edit")


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
//  event Editor
// =========================
editor.addEventListener("input", () => {
    if(selectedTask){
        selectedTask.dataset.content = editor.textContent;
    }
})


// =========================
//  function
// =========================
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


    div.addEventListener("click", () => {
        selectedTask = li;
        editor.textContent = li.dataset.content || "";
    })


    div.appendChild(li)
    div.appendChild(spanUrgency)
    taskList.appendChild(div)
    taskOption.appendChild(editor)
}




