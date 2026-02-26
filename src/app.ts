class HTMLWindowElement extends HTMLElement {
	constructor() {
		super();
		this.addEventListener('mousedown', this.evOnMouseDown);
		this.addEventListener('mouseup', this.evOnMouseUp);
	}

	connectedCallback() {
		this.style.position = 'absolute';
		this.style.userSelect = 'none';
	}

	static #drugging?: HTMLWindowElement;
	static #offsetX: number = 0;
	static #offsetY: number = 0;

	private evOnMouseDown(e: MouseEvent) {
		if (HTMLWindowElement.#drugging != undefined) return;
		console.log("dragging...");
		HTMLWindowElement.#drugging = this;
		HTMLWindowElement.#offsetX = (this.offsetLeft) - e.pageX;
		HTMLWindowElement.#offsetY = (this.offsetTop) - e.pageY;
	}

	private evOnMouseUp(e: MouseEvent) {
		if (HTMLWindowElement.#drugging == undefined) return;
		HTMLWindowElement.#drugging = undefined;
		console.log("dragged!");

	}

	private processDrag(x: number, y: number) {
		this.style.left = x + 'px';
		this.style.top = y + 'px';
	}

	private static evMouseMove(e: MouseEvent) {
		HTMLWindowElement.#drugging?.processDrag(e.pageX + HTMLWindowElement.#offsetX, e.pageY + HTMLWindowElement.#offsetY)
	}

	static {
		document.addEventListener('mousemove', HTMLWindowElement.evMouseMove);
	}

}

window.customElements.define('draggable-window', HTMLWindowElement);

