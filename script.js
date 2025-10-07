const addbtn = document.getElementById("addBtn")
const taskList = document.querySelector(".taskList")
const taskOption = document.querySelector(".taskOption")
const todoContainer = document.getElementById("todo-container")
let selectedTask = null
const maDiv = document.createElement("div")
maDiv.classList.add("edit")
maDiv.setAttribute("contenteditable", "true");  

addbtn.addEventListener("click", () => {
    const taskText = prompt("Quel est le nom de la tâche ?")
     if(taskText && taskText.trim() !== "") {
        addTask(taskText)
     }  
})




function addTask(task) {
    // creer <div>
    const div = document.createElement("div");
    div.classList.add("task-item"); // optionnel pour le style

    // creer <li pour l'affichage des tache>
    const li = document.createElement("li");
    li.textContent = task;
    li.dataset.content = ""; // stocke le contenu éditable
    
    li.addEventListener("click",() => {
    if(selectedTask) {
        selectedTask.dataset.content = maDiv.innerHTML;
       
    } 
    selectedTask = li 
    maDiv.innerHTML = li.dataset.content    
    maDiv.focus();
})
                       

    //creer <div pour supprimer>
    const deleteDiv = document.createElement("div")
    deleteDiv.textContent = "X"
    deleteDiv.classList.add("delete"); // optionnel pour le style
        
    deleteDiv.addEventListener("click", () => {
        DeleteTask(div, maDiv)
    })

    taskOption.appendChild(maDiv)
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