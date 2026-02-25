
class HTMLDragDropElement extends HTMLElement {
	constructor() {
		super();

		this.addEventListener('mousedown', this.evMouseDown);
		this.addEventListener('mouseup', this.evMouseUp);

		//this.style.position = 'absolute';
	}

	isDragging(): boolean {
		return HTMLDragDropElement.currentDragging == this;
	}

	private evMouseDown(e: MouseEvent) {
		if (HTMLDragDropElement.currentDragging != undefined) return;
		console.log("Starting dragging!");

		HTMLDragDropElement.currentDragging = this;
	}

	private evMouseUp(e: MouseEvent) {
		if (HTMLDragDropElement.currentDragging == undefined) return;
		console.log("Stopping dragging!");

		HTMLDragDropElement.currentDragging = undefined;
	}

	private onDraggign(x: number, y: number) {
		this.style.left = x - this.offsetWidth / 2 + 'px';
		this.style.top = y - this.offsetHeight / 2 + 'px';
	}

	static #evMouseMove(e: MouseEvent) {
		if (HTMLDragDropElement.currentDragging == undefined) return;
		HTMLDragDropElement.currentDragging.onDraggign(e.pageX, e.pageY);
	}

	static currentDragging?: HTMLDragDropElement;

	static {
		document.addEventListener('mousemove', HTMLDragDropElement.#evMouseMove);
	}
}

window.customElements.define('drag-drop', HTMLDragDropElement);
