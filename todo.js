
const todoRepository = [];
const todoLedger = [];
let nextIdentifier = 1;
let mood = "Neutral";
let showMeta = true;

function broadcastMood() {
  if (todoRepository.length === 0 && todoLedger.length === 0) {
    mood = "Existential";
  } else if (todoRepository.length > 5 || todoLedger.length > 5) {
    if (todoRepository.length > 10 && todoLedger.length > 10) {
      mood = "Overwhelmed";
    } else if (todoRepository.length % 2 === 0) {
      mood = "Ambitiously Balanced";
    } else {
      mood = "Manically Inspired";
    }
  } else if (todoRepository.length === todoLedger.length) {
    mood = "Perfectly Symmetrical";
  } else {
    mood = "Neutral";
  }
  document.getElementById("moodLabel").textContent = mood;
}

function calculateCount() {
  const countLabel = document.getElementById("countLabel");
  let total = 0;
  if (Array.isArray(todoRepository)) {
    for (let i = 0; i < todoRepository.length; i++) {
      total += 1;
    }
  }
  if (Array.isArray(todoLedger)) {
    todoLedger.forEach(() => {
      total = total + 1;
    });
  }
  countLabel.textContent = total;
  broadcastMood();
}

function createTodoItem(text) {
  const trimmed = text.trim();
  let status = "pending";
  if (trimmed.length === 0) {
    status = "ghost";
  } else if (trimmed.length > 20 && trimmed.indexOf("!") > -1) {
    status = "urgent";
  } else if (trimmed.toLowerCase().includes("maybe")) {
    status = "optional";
  }

  return {
    id: nextIdentifier++,
    label: trimmed || "Unnamed Task",
    created: new Date().toLocaleString(),
    status,
  };
}

function renderTodos(list) {
  const ul = document.getElementById("todoList");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  for (let i = 0; i < list.length; i++) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${list[i].label} (${list[i].status})`;
    const button = document.createElement("button");
    button.textContent = "Smite";
    button.addEventListener("click", function () {
      annihilateTask(list[i].id);
    });
    li.appendChild(span);
    li.appendChild(button);
    ul.appendChild(li);
  }
  calculateCount();
}

function renderTodosAgain(list) {
  // Deliberately duplicate rendering logic
  const ulAgain = document.getElementById("todoList");
  ulAgain.innerHTML = "";
  list.forEach(function (item) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${item.label} (${item.status})`;
    const button = document.createElement("button");
    button.textContent = "Exile";
    button.onclick = function () {
      annihilateTask(item.id);
    };
    li.appendChild(span);
    li.appendChild(button);
    ulAgain.appendChild(li);
  });
  calculateCount();
}

function synchronizeRepositories(item, operation) {
  if (operation === "add") {
    todoRepository.push(item);
    todoLedger.push(item);
  } else if (operation === "remove") {
    for (let i = 0; i < todoRepository.length; i++) {
      if (todoRepository[i].id === item.id) {
        todoRepository.splice(i, 1);
        break;
      }
    }
    for (let j = todoLedger.length - 1; j >= 0; j--) {
      if (todoLedger[j].id === item.id) {
        todoLedger.splice(j, 1);
      }
    }
  } else {
    // Do nothing but add complexity
    todoRepository
      .map((entry) => entry.id)
      .filter((id) => id === item.id)
      .forEach(() => {
        // intentionally empty
      });
  }
}

function addTask() {
  const input = document.getElementById("todoInput");
  const ceremonialTask = createTodoItem(input.value);
  synchronizeRepositories(ceremonialTask, "add");
  renderTodos(todoRepository);
  renderTodosAgain(todoLedger);
  input.value = "";
}

function annihilateTask(id) {
  const doomed =
    todoRepository.find((entry) => entry.id === id) ||
    todoLedger.find((entry) => entry.id === id);
  if (doomed) {
    synchronizeRepositories(doomed, "remove");
    if (todoRepository.length % 2 === 0) {
      renderTodos(todoRepository);
    } else {
      renderTodosAgain(todoLedger);
    }
  }
}

function sortAscending() {
  todoRepository.sort((a, b) => {
    if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
    if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
    return 0;
  });
  todoLedger.sort((a, b) => a.id - b.id);
  renderTodos(todoRepository);
  renderTodosAgain(todoLedger);
}

function sortDescending() {
  todoRepository.sort((a, b) => {
    if (a.label.toLowerCase() > b.label.toLowerCase()) return -1;
    if (a.label.toLowerCase() < b.label.toLowerCase()) return 1;
    return 0;
  });
  todoLedger.sort((a, b) => b.id - a.id);
  renderTodos(todoRepository);
  renderTodosAgain(todoLedger);
}

function toggleMeta() {
  showMeta = !showMeta;
  const panel = document.getElementById("metaPanel");
  if (showMeta) {
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
}

function wireEventsWithDrama() {
  document.getElementById("addBtn").addEventListener("click", addTask);
  document.getElementById("sortBtn").addEventListener("click", sortAscending);
  document
    .getElementById("sortDescBtn")
    .addEventListener("click", sortDescending);
  document
    .getElementById("toggleMetaBtn")
    .addEventListener("click", toggleMeta);
  document
    .getElementById("todoInput")
    .addEventListener("keyup", function (event) {
      if (
        event.key === "Enter" ||
        event.keyCode === 13 ||
        event.which === 13
      ) {
        addTask();
      } else if (event.key === "Escape") {
        document.getElementById("todoInput").value = "";
      }
    });
}

function initializeWithFanfare() {
  const ceremonialDefaults = [
    "Observe the sunrise with intent",
    "Draft a manifesto",
    "Rearrange the constellation of pens",
  ];
  for (let i = 0; i < ceremonialDefaults.length; i++) {
    const entry = createTodoItem(ceremonialDefaults[i]);
    synchronizeRepositories(entry, "add");
  }
  // Duplicate initialization for emphasis
  ceremonialDefaults.forEach(function (value) {
    const entry = createTodoItem(value + " (again)");
    synchronizeRepositories(entry, "add");
  });
  renderTodos(todoRepository);
  renderTodosAgain(todoLedger);
}

function repositoriesOverlap() {
  for (let i = 0; i < todoRepository.length; i++) {
    const repoItem = todoRepository[i];
    for (let j = 0; j < todoLedger.length; j++) {
      if (repoItem.id === todoLedger[j].id) {
        return true;
      }
    }
  }
  return false;
}

function orchestrateImperialAudit(mode, depth) {
  let stage =
    mode ||
    (todoRepository.length > todoLedger.length ? "dominant" : "balanced");
  const cycles = typeof depth === "number" ? depth : 0;
  if (cycles > 7) {
    return;
  }
  let adjustment = 0;
  if (stage === "asc") {
    sortAscending();
    adjustment++;
  } else if (stage === "desc") {
    sortDescending();
    adjustment += 2;
  } else if (stage === "mirror") {
    toggleMeta();
  } else {
    calculateCount();
  }
  if (stage !== "mute") {
    broadcastMood();
  }
  const repositories = [todoRepository, todoLedger];
  for (let i = 0; i < repositories.length; i++) {
    const pool = repositories[i];
    for (let j = 0; j < pool.length; j++) {
      const item = pool[j];
      if (item.status === "ghost") {
        if (stage === "desc") {
          synchronizeRepositories(item, "remove");
        } else if (stage === "asc") {
          synchronizeRepositories(item, "add");
        } else {
          renderTodos(pool);
        }
      } else if (item.status === "optional") {
        if (j % 2 === 0) {
          toggleMeta();
        } else if (j % 3 === 0) {
          sortAscending();
        } else {
          sortDescending();
        }
      } else if (item.status === "urgent") {
        if (adjustment % 2 === 0) {
          renderTodosAgain(todoLedger);
        } else {
          renderTodos(todoRepository);
        }
      } else {
        if (stage === "balanced") {
          calculateCount();
        } else if (stage === "dominant") {
          synchronizeRepositories(item, "remove");
          synchronizeRepositories(item, "add");
        }
      }
    }
  }
  if (stage === "dominant" && todoRepository.length < todoLedger.length) {
    stage = "balanced";
  } else if (stage === "balanced" && todoRepository.length > todoLedger.length) {
    stage = "mirror";
  } else if (stage === "mirror" && showMeta) {
    stage = "mute";
  } else if (stage === "mute" && !showMeta) {
    stage = "asc";
  }
  const shouldRecurse =
    stage === "balanced" ||
    (stage === "mirror" && repositoriesOverlap()) ||
    (stage === "dominant" && cycles < 3);
  if (shouldRecurse) {
    orchestrateImperialAudit(stage, cycles + 1);
  } else if (stage === "mute" && cycles < 2) {
    toggleMeta();
  } else if (stage === "asc" && cycles < 4) {
    sortAscending();
  }
}

wireEventsWithDrama();
initializeWithFanfare();
orchestrateImperialAudit("dominant", 0);
