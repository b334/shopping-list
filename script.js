const form = document.getElementById('form-1');
const listItems = document.querySelector('ul.list-items');
const clearAllBtn = document.querySelector('button.clearbtn');
const inputItem = document.getElementById('input-item');
const outputBlock = document.getElementById('output-block');
const filterItem = document.getElementById('filter-item');
const userInterface = document.getElementById('user-interface');
const errMsgDiv = document.getElementById('message-div');
const submitBtn = document.querySelector('form > .submit');

let editMode = false;
let editListItem;

// Add event listeners
document.addEventListener('DOMContentLoaded', addLocalStorageItemsHandler);
form.addEventListener('submit', submitHandler);
listItems.addEventListener('click', removeItemHandler);
clearAllBtn.addEventListener('click', clearAllBtnHandler);
filterItem.addEventListener('input', filterItemHandler);

function addLocalStorageItemsHandler(e) {
  let itemsArray = getItemsFromLocalStorage();
  itemsArray.forEach((item) => {
    addInput(item);
  });
}

function getItemsFromLocalStorage() {
  let itemsArray;
  if (localStorage.getItem('itemsArray') === null) {
    itemsArray = [];
    localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
  } else {
    itemsArray = localStorage.getItem('itemsArray');
    itemsArray = JSON.parse(itemsArray);
  }
  return itemsArray;
}

function submitHandler(e) {
  e.preventDefault();
  let inputItemValue = inputItem.value.trim();
  if (!editMode) {
    if (inputItemValue !== '') {
      clearErrorMessage();
      addInputHandler(inputItemValue);
    } else {
      clearErrorMessage();
      errorMsgDisplay('Please enter the item.');
    }
  } else {
    editInputHandler(inputItemValue);
  }
}

function errorMsgDisplay(message) {
  if (!errMsgDiv.firstElementChild) {
    let errDiv = document.createElement('div');
    errDiv.id = 'error-msg';
    errDiv.appendChild(document.createTextNode(message));
    errMsgDiv.appendChild(errDiv);
  }
}

function clearErrorMessage() {
  if (errMsgDiv.firstElementChild) {
    errMsgDiv.firstElementChild.remove();
  }
}

function editInputHandler(inputItemValue) {
  if (inputItemValue !== '') {
    clearErrorMessage();
    const editListItemText = editListItem.textContent.trim();
    if (!checkDuplicate(inputItemValue) || inputItemValue === editListItemText) {
      // Local Storage edit
      let itemsArray = getItemsFromLocalStorage();
      let editItemIndex = itemsArray.indexOf(editListItemText);
      itemsArray.splice(editItemIndex, 1, inputItemValue);
      localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
      editMode = false;
      // UI edit
      editListItem.innerHTML = `${inputItemValue} <button class ="delete-btn"><i class="fa-sharp fa-solid fa-xmark delete"></i></button>`;
      editListItem.classList.remove('gray-color');
      inputItem.value = '';
      // change form button to default mode
      submitBtn.classList.remove('edit-btn');
      submitBtn.innerHTML = '<i class="fa-duotone fa-plus"></i> Add Item';
    } else {
      clearErrorMessage();
      errorMsgDisplay('The item already exists.');
    }
  } else {
    clearErrorMessage();
    errorMsgDisplay('Please enter new value for the item.');
  }
}

function addInputHandler(inputItemValue) {
  // add items only if there is no duplicate item name present in  the list
  if (!checkDuplicate(inputItemValue)) {
    let itemsArray = getItemsFromLocalStorage();
    itemsArray.push(inputItemValue);
    localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
    addInput(inputItemValue);
    inputItem.value = '';
  } else {
    clearErrorMessage();
    errorMsgDisplay('The item already exists.');
  }
}

function checkDuplicate(inputItemValue) {
  let result = false;
  const itemsArray = getItemsFromLocalStorage();
  itemsArray.forEach((item) => {
    if (item.toLowerCase() === inputItemValue.toLowerCase()) {
      result = true;
    }
  });
  return result;
}

function addInput(item) {
  const listItem = document.createElement('li');
  listItem.className = 'list-item';
  const text = document.createTextNode(item);
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '<i class="fa-sharp fa-solid fa-xmark delete"></i>';
  listItem.appendChild(text);
  listItem.appendChild(deleteBtn);
  listItems.appendChild(listItem);
  outputBlock.style.display = 'block';
}

function removeItemHandler(e) {
  let itemToDelete = e.target.parentElement.parentElement.textContent;
  if (e.target.classList.contains('delete')) {
    e.target.parentElement.parentElement.remove();
    let itemsArray = getItemsFromLocalStorage();
    let indexToDelete = itemsArray.indexOf(itemToDelete);
    itemsArray.splice(indexToDelete, 1);
    localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
  } else if (e.target.classList.contains('list-item')) {
    // Clear old error message
    clearErrorMessage();
    editMode = true;
    const listItem = e.target;
    // Make target item grey in colour and display it in input box
    listItem.classList.add('gray-color');
    inputItem.value = listItem.textContent;

    // Remove all the gray colors from old elements and set grey colour only on choosen list item
    let listItemsNodeList = document.querySelectorAll('ul.list-items > .list-item');
    listItemsNodeList.forEach((item) => {
      if (listItem !== item) {
        item.classList.remove('gray-color');
      }
    });

    // change form button to edit mode
    submitBtn.classList.add('edit-btn');
    submitBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Update Item`;
    editListItem = e.target;
  }
}

function clearAllBtnHandler() {
  clearList();
  let itemsArray = [];
  outputBlock.style.display = 'none';
  localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
}

function clearList() {
  while (listItems.firstChild) {
    listItems.firstChild.remove();
  }
}

function filterItemHandler(e) {
  let filterItemValue = e.target.value.toLowerCase();
  let filterArray;
  let itemsArray = getItemsFromLocalStorage();
  if (filterItemValue) {
    filterArray = itemsArray.filter((item) => item.toLowerCase().startsWith(filterItemValue));
  }
  if (filterArray) {
    clearList();
    addFilteredList(filterArray);
  } else {
    clearList();
    addFilteredList(itemsArray);
  }
}

function addFilteredList(array) {
  array.forEach((element) => {
    addInput(element);
  });
}
