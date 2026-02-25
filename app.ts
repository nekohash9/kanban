
class HTMLDragDropElement extends HTMLElement {
	static observedAttributes = ['unescapable']; // TODO: think about a new name for attribute "unescapable"

	unescapable: boolean;

	constructor() {
		super();

		this.addEventListener('mousedown', this.evMouseDown);
		this.addEventListener('mouseup', this.evMouseUp);

		this.unescapable = false;
	}

	isDragging(): boolean {
		return HTMLDragDropElement.currentDragging == this;
	}

	private evMouseDown(_e: MouseEvent) {
		if (HTMLDragDropElement.currentDragging != undefined) return;
		console.log("Starting dragging!");

		HTMLDragDropElement.currentDragging = this;
	}

	private evMouseUp(_e: MouseEvent) {
		if (HTMLDragDropElement.currentDragging == undefined) return;
		console.log("Stopping dragging!");

		HTMLDragDropElement.currentDragging = undefined;
	}

	private onDragging(x: number, y: number) {
		if (this.unescapable) {
			const HW = this.offsetWidth / 2;
			const HH = this.offsetHeight / 2;
			x = Math.max(0, x - HW);
			y = Math.max(0, y - HH);
			x = Math.min(window.screen.width, x + HW);
			y = Math.min(window.screen.height, y + HH);
		}

		this.style.left = x - this.offsetWidth / 2 + 'px';
		this.style.top = y - this.offsetHeight / 2 + 'px';
	}

	connectedCallback() {
		this.style.position = 'absolute';
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		switch (name) {
			case 'unescapable':
				this.unescapable = (newValue === 'true');
				break;
		}
	}

	static #evMouseMove(e: MouseEvent) {
		if (HTMLDragDropElement.currentDragging == undefined) return;
		HTMLDragDropElement.currentDragging.onDragging(e.pageX, e.pageY);
	}

	static currentDragging?: HTMLDragDropElement;

	static {
		document.addEventListener('mousemove', HTMLDragDropElement.#evMouseMove);
	}
}

window.customElements.define('drag-drop', HTMLDragDropElement);
