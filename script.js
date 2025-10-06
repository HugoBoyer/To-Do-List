const addbtn = document.getElementById("addBtn")
const taskList = document.querySelector(".taskList")
const taskOption = document.querySelector(".taskOption")


addbtn.addEventListener("click", () => {
    const taskText = prompt("Quel est le nom de la tâche ?")
     if(taskText && taskText.trim() !== "") {
        addTask(taskText)
     }  
})

taskList.addEventListener("click",() => {
    const maDiv = document.createElement("div")
    maDiv.classList.add("edit")
    maDiv.setAttribute("contenteditable", "true");
    taskOption.appendChild(maDiv)
})


function addTask(task) {
    // creer <div>
    const div = document.createElement("div");
    div.classList.add("task-item"); // optionnel pour le style

    // creer <li>
    const li = document.createElement("li");
    li.textContent = task;

    const deleteDiv = document.createElement("div")
        deleteDiv.textContent = "X"
        deleteDiv.classList.add("delete"); // optionnel pour le style
        
    deleteDiv.addEventListener("click", () => {
        div.remove()
    })

    
    div.appendChild(li)
    div.appendChild(deleteDiv)
    taskList.appendChild(div)
}

function DeleteTask() {



}
