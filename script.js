// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyCGTrvmgit2UBYE9tCAtg2itiTdVLgBt-A",
  authDomain: "faire-28d55.firebaseapp.com",
  projectId: "faire-28d55",
  storageBucket: "faire-28d55.appspot.com",
  messagingSenderId: "994974978244",
  appId: "1:994974978244:web:0ae17ec42e8d5eca46b991",
  measurementId: "G-HBFYFMV9T9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

var username = localStorage.getItem('username');
console.log(username);
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = []
let selectedListId = null
var docRef = db.collection("users").doc(username);

docRef.get().then(function (doc) {
  if (doc.exists) {
    lists = JSON.parse(doc.data().LOCAL_STORAGE_LIST_KEY)
    console.log("Document data:", doc.data());
    selectedListId = JSON.parse(doc.data().LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
  } else {
    // doc.data() will be undefined in this case
    // lists = []
    console.log("No such document!");
  }
  render()
}).catch(function (error) {
  console.log("Error getting document:", error);
});
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  // localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  // localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
  var data = { LOCAL_STORAGE_LIST_KEY: JSON.stringify(lists), LOCAL_STORAGE_SELECTED_LIST_ID_KEY: selectedListId }
  // data[username] = {LOCAL_STORAGE_LIST_KEY: JSON.stringify(lists),LOCAL_STORAGE_SELECTED_LIST_ID_KEY: selectedListId}
  db.collection("users").doc(username).set(data)

}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function logout()
{
  localStorage.removeItem('username');
  window.open("index.html", "_self");
}

document.getElementById('logout-button').onclick = logout;
//render()