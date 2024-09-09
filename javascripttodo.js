const inputTaskButton = document.querySelector('#inputTask');
let soundEffect = document.getElementById('sound');
let allCompletedTask = document.getElementById('allCompletedTask');
let completedNumber = document.getElementById('completedNumber');
let close = document.querySelector('.close');
let open = document.querySelector('.completed');
let errorMessage = document.getElementById('error-message');

// Event listeners for open/close completed tasks section
open.addEventListener('click', () => {
    document.querySelector('.taskC').classList.add('open');
});
close.addEventListener('click', () => {
    document.querySelector('.taskC').classList.add('hide');
    document.querySelector('.taskC').classList.remove('open');
});

// Main function to refresh task display
function funcy() {
    let localData = localStorage.getItem('taskSame');
    let complTa = localStorage.getItem('completedTask');

    if (complTa == null) {
        completedNumber.innerText = 0;
        completedNumber.style.color = "red";
        complete = [];
    } else {
        complete = JSON.parse(complTa);
        completedNumber.innerText = complete.length;
    }

    localData == null ? alltask = [] : alltask = JSON.parse(localData);

    let html = '';
    alltask.forEach((task, index) => {
        html += `
        <div id="tskbox">
            <div class="col d-flex justify-content-between align-items-center todoCard my-2 mx-3 p-4">
                <h5 class="card-number">${index + 1}</h5>
                <div>
                    <p class="card-text ncTask editTask" style="color:green; font-size:40px"><strong>${task.note}</strong></p>
                    <p class="card-text"><strong>Priority:</strong> ${task.priority}</p>
                    <p class="card-text"><strong>Completion Date:</strong> ${task.date}</p>
                </div>
                <div class="d-flex gap">
                    <i id="${index}" onclick="editTask(this.id)" class="btn btn-outline-success fa fa-pen d-flex align-items-center"></i>
                    <i id="${index}" onclick="deleteTask(this.id)" class="btn btn-outline-danger fa fa-close d-flex align-items-center"></i>
                    <i id="${index}" onclick="completedTaskFunc(this.id)" class="btn btn-outline-success fa fa-check d-flex align-items-center"></i>
                </div>
            </div>
        </div>
        `;
    });

    let pushNote = document.getElementById('pushNote');
    alltask.length !== 0 ? pushNote.innerHTML = html : pushNote.innerHTML = `List is empty📃`;

    let compTask = document.getElementById('pushComplete');
    let completedHtml = '';
    complete.forEach((task, index) => {
        completedHtml += `
        <div id="tskbox">
            <div class="col d-flex justify-content-between todoCard my-2 mx-3 p-4 py-5">
                <h5 class="card-number mb-0 mr-2">${index + 1}</h5>
                <div>
                    <p class="card-text mb-0">${task.note}</p>
                    <p class="card-text"><strong>Priority:</strong> ${task.priority}</p>
                    <p class="card-text"><strong>Completion Date:</strong> ${task.date}</p>
                </div>
                <i id="${index}" onclick="deleteCoomplete(this.id)" class="btn btn-outline-danger fa fa-close d-flex align-items-center"></i>
            </div>
        </div>
        `;
    });

    compTask.innerHTML = completedHtml || "<h3 style='color:red'>Ops, No task Completed📃</h3>";
}

// Add task event listener
inputTaskButton.addEventListener('click', () => {
    let addNote = document.getElementById('addNote');
    let priority = document.getElementById('priority').value;
    let completionDate = document.getElementById('completion-date').value;

    // Validate input
    if (addNote.value.trim() === '' || priority === '' || completionDate === '') {
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }

    // Retrieve existing tasks
    let localData = localStorage.getItem('taskSame');
    localData == null ? alltask = [] : alltask = JSON.parse(localData);

    // Create task object
    const task = {
        note: addNote.value,
        priority: priority,
        date: completionDate
    };

    // Add task to array and save to local storage
    alltask.push(task);
    localStorage.setItem('taskSame', JSON.stringify(alltask));

    // Clear input fields
    addNote.value = "";
    document.getElementById('priority').value = '';
    document.getElementById('completion-date').value = '';

    // Refresh task list
    funcy();
});

// Function to delete a task
function deleteTask(index) {
    let localData = localStorage.getItem('taskSame');
    if (localData == null) {
        alltask = [];
    } else {
        alltask = JSON.parse(localData);
    }
    alltask.splice(index, 1);
    localStorage.setItem('taskSame', JSON.stringify(alltask));
    funcy();
}

// Function to mark a task as completed
function completedTaskFunc(index) {
    let localData = localStorage.getItem('taskSame');
    let complTa = localStorage.getItem('completedTask');
    if (localData == null) {
        alltask = [];
    } else {
        alltask = JSON.parse(localData);
    }
    complTa == null ? complete = [] : complete = JSON.parse(complTa);

    complete.push(alltask.splice(index, 1)[0]);

    localStorage.setItem('taskSame', JSON.stringify(alltask));
    localStorage.setItem('completedTask', JSON.stringify(complete));
    funcy();
}

// Function to delete a completed task
function deleteCoomplete(index) {
    let complTa = localStorage.getItem('completedTask');
    complTa == null ? complete = [] : complete = JSON.parse(complTa);
    complete.splice(index, 1);
    localStorage.setItem('completedTask', JSON.stringify(complete));
    funcy();
}

// Function to edit a task with a single prompt
function editTask(index) {
    let editedData = prompt(`Edit your Task:
    Task Name: ${alltask[index].note}
    Task Priority (low, medium, high): ${alltask[index].priority}
    Task Completion Date (YYYY-MM-DD): ${alltask[index].date}`, `${alltask[index].note}, ${alltask[index].priority}, ${alltask[index].date}`);
    
    if (editedData === null) return; // Exit if the user cancels

    // Split the input string into its respective components
    let [editedNote, editedPriority, editedDate] = editedData.split(',');

    if (!editedNote || !editedPriority || !editedDate) {
        alert("All fields must be filled!");
        return;
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(editedPriority.trim().toLowerCase())) {
        alert("Invalid priority! Please use 'low', 'medium', or 'high'.");
        return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(editedDate.trim())) {
        alert("Invalid date format! Please use 'YYYY-MM-DD'.");
        return;
    }

    // Apply edits
    alltask[index].note = editedNote.trim();
    alltask[index].priority = editedPriority.trim().toLowerCase();
    alltask[index].date = editedDate.trim();
    localStorage.setItem('taskSame', JSON.stringify(alltask));
    funcy();
}

document.addEventListener('DOMContentLoaded', () => {
    funcy();
});
