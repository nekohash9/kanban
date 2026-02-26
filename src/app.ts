
class HTMLDragDropElement extends HTMLElement {
	static observedAttributes = ['inescapable']; // TODO: think about a new name for attribute "inescapable"

	inescapable: boolean;

	constructor() {
		super();

		this.addEventListener('mousedown', this.evMouseDown);
		this.addEventListener('mouseup', this.evMouseUp);

		this.inescapable = false;
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
		const HW = this.offsetWidth / 2;
		const HH = this.offsetHeight / 2;

		if (this.inescapable) {
			x = Math.max(HW, x);
			y = Math.max(HH, y);

			x = Math.min(window.innerWidth - HW, x);
			y = Math.min(window.innerHeight - HH, y);
		}

		this.style.left = x - HW + 'px';
		this.style.top = y - HH + 'px';
	}

	connectedCallback() {
		this.style.position = 'absolute';
		this.style.userSelect = 'none';
		this.draggable = false;
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		switch (name) {
			case 'inescapable':
				this.inescapable = (newValue === 'true');
				break;
		}
	}

	static #evMouseMove(e: MouseEvent) {
		if (HTMLDragDropElement.currentDragging == undefined) return;

		if (e.buttons == 0) {
			HTMLDragDropElement.currentDragging = undefined;
			return;
		}

		HTMLDragDropElement.currentDragging.onDragging(e.pageX, e.pageY);
	}

	static currentDragging?: HTMLDragDropElement;

	static {
		document.addEventListener('mousemove', HTMLDragDropElement.#evMouseMove);
	}
}

window.customElements.define('drag-drop', HTMLDragDropElement);
