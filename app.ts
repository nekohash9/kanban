class DragElement {
	static dragging_current: DragElement | null;
	element: HTMLElement;
	constructor(dragging: boolean) {
		this.element = new HTMLElement();
	}
}