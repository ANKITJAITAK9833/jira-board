const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updateOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
   localStorage.setItem(`${arrayName}Items` , JSON.stringify(listArrays[index]));
  });
}

// Filter Arrays to remove empty items
function filterArrays(array){
const filteredArray = array.filter(item=>item!=null);
return filteredArray;
}
// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {

  // Check localStorage once
  if(!updateOnLoad){
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index)=>{
  createItemEl( backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArrays(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArrays(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArrays(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArrays(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad=true;
  updateSavedColumns();
}

// Update item - Delete if necessary, or update Array Value
function updateItem(id, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if(!dragging) {
  if (!selectedColumnEl[id].textContent) {
    delete selectedArray[id];
  } else {
    selectedArray[id] = selectedColumnEl[id].textContent;
  }
  updateDOM();
  }
}


// Add to columnlist,reset the textbox
function addToColumn(column){
const itemText = addItems[column].textContent;
const selectedArray = listArrays[column];
selectedArray.push(itemText);
addItems[column].textContent='';
updateDOM();
}

// Show add input box
function showInputBox(column){
addBtns[column].style.visibility = 'hidden';
saveItemBtns[column].style.display = 'flex';
addItemContainers[column].style.display = 'flex';
}

// Hide add input box
function hideInputBox(column){
addBtns[column].style.visibility = "visible";
saveItemBtns[column].style.display = "none";
addItemContainers[column].style.display = "none";
addToColumn(column);
}

function rebuildArrays(){
 backlogListArray = Array.from(backlogList.children).map(
   (backlogItem) => backlogItem.textContent
 );

 progressListArray = Array.from(progressList.children).map(
   (progressListItem) => progressListItem.textContent
 );

 completeListArray = Array.from(completeList.children).map(
   (completeListItem) => completeListItem.textContent
 );

 onHoldListArray = Array.from(onHoldList.children).map(
   (onHoldListItem) => onHoldListItem.textContent
 );
  updateDOM();
}

// when item starts dragging
function drag(e){
  draggedItem = e.target;
  dragging = true;
}

// Column allows for items to drop
function allowDrop(e){
  e.preventDefault();
}

// When item enters column area
function dragEnter(column){
 listColumns[column].classList.add('over');
 currentColumn = column;
}

// Dropping item in column
function drop(e){
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach((colum)=>{
  colum.classList.remove("over");

  //  Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  });
  // Dragging complete
  dragging = false;
  rebuildArrays();
}
//  On Load
updateDOM();

