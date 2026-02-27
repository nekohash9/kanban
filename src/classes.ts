class HTMLDraggableElement extends HTMLElement {
	constructor() {
		super();
		this.addEventListener('mousedown', this.evOnMouseDown);
		this.addEventListener('mouseup', this.evOnMouseUp);
	}

	connectedCallback() {
		this.style.position = 'absolute';
		this.style.userSelect = 'none';
	}

	static #drugging?: HTMLDraggableElement;
	static #offsetX: number = 0;
	static #offsetY: number = 0;

	private evOnMouseDown(e: MouseEvent) {
		if (HTMLDraggableElement.#drugging != undefined) return;
		HTMLDraggableElement.#drugging = this;
		HTMLDraggableElement.#offsetX = (this.offsetLeft) - e.pageX;
		HTMLDraggableElement.#offsetY = (this.offsetTop) - e.pageY;
	}

	private evOnMouseUp(e: MouseEvent) {
		if (HTMLDraggableElement.#drugging == undefined) return;
		HTMLDraggableElement.#drugging = undefined;
	}

	private processDrag(x: number, y: number) {
		this.style.left = x + 'px';
		this.style.top = y + 'px';
	}

	private static evMouseMove(e: MouseEvent) {
		HTMLDraggableElement.#drugging?.processDrag(e.pageX + HTMLDraggableElement.#offsetX, e.pageY + HTMLDraggableElement.#offsetY)
	}

	static {
		document.addEventListener('mousemove', HTMLDraggableElement.evMouseMove);
	}

}

window.customElements.define('draggable-element', HTMLDraggableElement);

