/**
 * Searches for tasks based on the user's input in the search field.
 * If the search query is at least 3 characters long, the tasks are filtered.
 * If the input field is empty, all tasks are displayed.
 */
function searchTask() {
  let searchQuery = document.getElementById('searchInput').value.toLowerCase();
  
  if (searchQuery.length >= 3) {
    let filteredTasks = taskAllArray.map((task, index) => {
      let titleMatch = task.title.toLowerCase().includes(searchQuery);
      let descriptionMatch = task.description.toLowerCase().includes(searchQuery);
      if (titleMatch || descriptionMatch) {
        return { ...task, taskIndex: index };
      }
      return null;
    }).filter(task => task !== null);
    renderFilteredTasks(filteredTasks);
  } else {
    renderAllTasks();
  }
  if (searchQuery.length === 0) {
    renderAllTasks();
  }
}


/**
 * Renders the filtered tasks in their respective sections.
 * 
 * @param {Array<Object>} tasks - Array of task objects to be filtered and rendered.
 */
function renderFilteredTasks(tasks) {
  let toDoTasks = tasks.filter(task => task.section === 'toDo');
  let inProgressTasks = tasks.filter(task => task.section === 'inProgress');
  let awaitFeedbackTasks = tasks.filter(task => task.section === 'awaitFeedback');
  let doneTasks = tasks.filter(task => task.section === 'done');

  renderTasksInSection('toDo', toDoTasks);
  renderTasksInSection('inProgress', inProgressTasks);
  renderTasksInSection('awaitFeedback', awaitFeedbackTasks);
  renderTasksInSection('done', doneTasks);
}


/**
 * Renders a list of tasks in a specific section.
 * 
 * @param {string} sectionId - The ID of the HTML element where the tasks should be rendered.
 * @param {Array<Object>} tasks - Array of task objects to be rendered in the section.
 */
function renderTasksInSection(sectionId, tasks) {
  let container = document.getElementById(sectionId);
  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = `<div class="noTasks">No tasks in ${sectionId}</div>`;
  } else {
    tasks.forEach(task => {
      container.innerHTML += generateTasksHTML(task, task.taskIndex);
    });
  }
}