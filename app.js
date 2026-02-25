var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _HTMLDragDropElement_evMouseMove;
class HTMLDragDropElement extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('mousedown', this.evMouseDown);
        this.addEventListener('mouseup', this.evMouseUp);
    }
    isDragging() {
        return _a.currentDragging == this;
    }
    evMouseDown(e) {
        if (_a.currentDragging != undefined)
            return;
        console.log("Starting dragging!");
        _a.currentDragging = this;
    }
    evMouseUp(e) {
        if (_a.currentDragging == undefined)
            return;
        console.log("Stopping dragging!");
        _a.currentDragging = undefined;
    }
    onDraggign(x, y) {
        this.style.left = x - this.offsetWidth / 2 + 'px';
        this.style.top = y - this.offsetHeight / 2 + 'px';
    }
}
_a = HTMLDragDropElement, _HTMLDragDropElement_evMouseMove = function _HTMLDragDropElement_evMouseMove(e) {
    if (_a.currentDragging == undefined)
        return;
    _a.currentDragging.onDraggign(e.pageX, e.pageY);
};
(() => {
    document.addEventListener('mousemove', __classPrivateFieldGet(_a, _a, "m", _HTMLDragDropElement_evMouseMove));
})();
window.customElements.define('drag-drop', HTMLDragDropElement);
//# sourceMappingURL=app.js.map