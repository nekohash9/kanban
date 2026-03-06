class HTMLDraggableElement extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("mousedown", this.evOnMouseDown);
    this.addEventListener("mouseup", this.evOnMouseUp);
  }

  connectedCallback() {
    this.style.position = "absolute";
    this.style.userSelect = "none";
  }

  static #dragging?: HTMLDraggableElement;
  static #offsetX: number = 0;
  static #offsetY: number = 0;

  private evOnMouseDown(e: MouseEvent) {
    if (HTMLDraggableElement.#dragging != undefined) return;
    HTMLDraggableElement.#dragging = this;
    HTMLDraggableElement.#offsetX = this.offsetLeft - e.pageX;
    HTMLDraggableElement.#offsetY = this.offsetTop - e.pageY;
  }

  private evOnMouseUp(_e: MouseEvent) {
    HTMLDraggableElement.#dragging = undefined;
  }

  private processDrag(x: number, y: number) {
    this.style.left = x + "px";
    this.style.top = y + "px";
  }

  private static evMouseMove(e: MouseEvent) {
    HTMLDraggableElement.#dragging?.processDrag(
      e.pageX + HTMLDraggableElement.#offsetX,
      e.pageY + HTMLDraggableElement.#offsetY,
    );
  }

  static {
    document.addEventListener("mousemove", HTMLDraggableElement.evMouseMove);
  }
}

window.customElements.define("draggable-element", HTMLDraggableElement);

interface CardData {
  id: string;
  text: string;
}

interface ListData {
  id: string;
  title: string;
  cards: CardData[];
}

class BoardStore {
  private static STORAGE_KEY = "kanban-board-data";
  static save(data: ListData[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static load(): ListData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
