const content: HTMLElement = document.getElementById("content");
let lists: HTMLElement[] = [];

const saved: ListData[] = BoardStore.load();
if (saved.length > 0) {
  renderBoard(saved);
} else {
  content.childNodes.forEach((child: ChildNode, _key, _parent) => {
    if (child.nodeType == 1) {
      lists.push(child as HTMLElement);
    }
  });
  document.querySelectorAll<HTMLElement>(".kanban-list").forEach(setupListDragEvents);
}



content.childNodes.forEach((child: ChildNode, _key, _parent) => {
  if (child.nodeType == 1) {
    lists.push(child as HTMLElement);
  }
});

document.getElementById("btn_add_list").addEventListener("click", (_e) => {
  addNewList();
});
document.getElementById("btn_add_task").addEventListener("click", (_e) => {
  addNewTask(0);
});

function addNewList() {
  let el: HTMLDivElement = document.createElement("div");
  let title: HTMLLabelElement = document.createElement("label");

  el.classList.add("kanban-list");
  el.id = crypto.randomUUID();

  title.contentEditable = "plaintext-only";
  title.textContent = "Title";

  el.appendChild(title);
  content.appendChild(el);

  lists.push(el);
  setupListDragEvents(el);
  addNewTask(lists.length - 1);
  saveBoard();
}

function addNewTask(list_id: number = 0) {
  const el: HTMLElement = lists[list_id];
  if (lists[list_id] === undefined) return;

  let task: HTMLElement = document.createElement("div");
  task.classList.add("kanban-card");
  task.id = crypto.randomUUID();
  task.draggable = true;
  task.textContent = "New TASK!";
  el.appendChild(task);
  console.log(el);
  saveBoard();
}

// Draggable elements

let draggingCard: HTMLElement | null = null;

document.querySelectorAll(".kanban-card").forEach((el: HTMLElement) => {
  el.draggable = true;
});

function setupListDragEvents(el: HTMLElement) {
  el.addEventListener("dragstart", (e: DragEvent) => {
    if (draggingCard != null) return;
    const target: HTMLElement = e.target as HTMLElement;
    if (target && target.classList.contains("kanban-card")) {
      target.classList.add("dragging");
      draggingCard = target;
    }
  });

  el.addEventListener("dragend", (e: DragEvent) => {
    const target: HTMLElement = e.target as HTMLElement;
    if (target == draggingCard) {
      target.classList.remove("dragging");
      draggingCard = null;
    }
  });

  el.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();

    if (!draggingCard) return;

    const afterElement = getCardAfter(el, e.clientY);

    if (afterElement) {
      el.insertBefore(draggingCard, afterElement);
    } else {
      el.appendChild(draggingCard);
    }
  });
}

document
  .querySelectorAll<HTMLElement>(".kanban-list")
  .forEach(setupListDragEvents);

type _SearchElem = {
  offset: number;
  element?: HTMLElement;
};

const _NullElem: _SearchElem = {
  offset: Number.NEGATIVE_INFINITY,
  element: null,
};

function getCardAfter(cont: HTMLElement, y: number): HTMLElement | null {
  const items: HTMLElement[] = Array.prototype.slice.call(
    cont.querySelectorAll<HTMLElement>(".kanban-card:not(.dragging)"),
  ) as HTMLElement[];

  return items.reduce((closest: _SearchElem, child: HTMLElement) => {
    const bbox: DOMRect = child.getBoundingClientRect();
    const offset: number = y - bbox.top - bbox.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, _NullElem).element;
}

// Context menu

const contextMenu: HTMLElement = document.getElementById("contextMenu");

document.addEventListener("click", hideMenu);
document.addEventListener("contextmenu", rightClick);

function hideMenu(_e: Event) {
  contextMenu.style.display = "none";
}

function rightClick(e: MouseEvent) {
  e.preventDefault();

  contextMenu.style.display = "block";
  contextMenu.style.left = e.pageX + "px";
  contextMenu.style.top = e.pageY + "px";
}

function serializeBoard(): ListData[] {
  return lists.map((list: HTMLElement) => {
    const titleEl = list.querySelector("label");
    const title: string = titleEl?.textContent ?? "Title";
    const cards: CardData[] = Array.prototype.slice
      .call(list.querySelectorAll(".kanban-card"))
      .map((card: HTMLElement) => ({
        id: card.id,
        text: card.textContent,
      }));
    return { id: list.id, title, cards };
  });
}
function renderBoard(data: ListData[]) {
  content.innerHTML = "";
  lists = [];
  data.forEach((listData: ListData) => {
    const listEL: HTMLDivElement = document.createElement("div");
    listEL.classList.add("kanban-list");
    
    const title: HTMLLabelElement = document.createElement("label");
    title.contentEditable = "plaintext-only";
    title.textContent = listData.title;
    title.addEventListener("blur", saveBoard);
    listEL.appendChild(title);

    listData.cards.forEach((cardData: CardData) => {
      const card: HTMLElement = document.createElement("div");
      card.classList.add("kanban-card");
      card.draggable = true;
      card.id = cardData.id;
      card.textContent = cardData.text;
      listEL.appendChild(card);
    });

    content.appendChild(listEL);
    lists.push(listEL);
    setupListDragEvents(listEL);
  });
}
function saveBoard() {
  BoardStore.save(serializeBoard());
}
