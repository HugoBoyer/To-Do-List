const addbtn = document.getElementById("addBtn")
const taskList = document.querySelector(".taskList")



addbtn.addEventListener("click", () => {
    const taskText = prompt("Quel est le nom de la tâche ?")
     if(taskText && taskText.trim() !== "") {
        addTask(taskText)
     }
    
})


function addTask(task) {
    // creer <li>
    const li = document.createElement("li");
    li.textContent = task;

      li.addEventListener("click", () => {
      li.classList.toggle("done");
  });

  taskList.appendChild(li)
}
