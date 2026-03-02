const content: HTMLElement = document.getElementById('content');
let lists: HTMLElement[] = [];


content.childNodes.forEach((child: ChildNode, _key, _parent) => {
	if (child.nodeType == 1) {
		lists.push(child as HTMLElement);
	}
});

document.getElementById('btn_add_list').addEventListener('click', (_e) => { addNewList() });
document.getElementById('btn_add_task').addEventListener('click', (_e) => { addNewTask(0) });

function addNewList() {
	let list: HTMLDivElement = document.createElement('div');
	let title: HTMLLabelElement = document.createElement('label');

	title.contentEditable = 'plaintext-only';
	title.textContent = 'Title';

	list.appendChild(title);
	content.appendChild(list);

	lists.push(list);
	addNewTask(lists.length - 1);
}

function addNewTask(list_id: number = 0) {
	const list: HTMLElement = lists[list_id];
	let task: HTMLElement;

	console.log(list);

	if (list == undefined) return;

	task = document.createElement('div');
	task.textContent = 'New TASK!'
	list.appendChild(task);
}

// Moving cards

let draggingCard: HTMLElement | null = null;

document.querySelectorAll('.kanban-card').forEach(
	(el: HTMLElement) => {
		el.draggable = true;
	}
)

document.querySelectorAll('.kanban-list').forEach(
	(el: HTMLElement) => {
		el.addEventListener('dragstart', (e: DragEvent) => {
			if (draggingCard != null) return;

			const target: HTMLElement = e.target as HTMLElement;

			if (target && target.classList.contains('kanban-card')) {
				target.classList.add('dragging');
				draggingCard = target;
			}
		});
		el.addEventListener('dragend', (e: DragEvent) => {
			const target: HTMLElement = e.target as HTMLElement;
			if (target == draggingCard) {
				target.classList.remove('dragging');
				draggingCard = null;
			}
		});

		el.addEventListener('dragover', (e: DragEvent) => {
			e.preventDefault();
			const afterElement: HTMLElement = getCardAfter(el, e.pageY);

			document.querySelectorAll('.kanban-card')
				.forEach(
					el => el.classList.remove('over')
				);


			if (afterElement && draggingCard) {
				el.insertBefore(draggingCard, afterElement);
			} else if (draggingCard) {
				el.appendChild(draggingCard);
			}
		});
	}
)

type _SearchElem = {
	offset: number;
	element?: HTMLElement;
};

const _NullElem: _SearchElem = {
	offset: Number.NEGATIVE_INFINITY,
	element: null,
}

function getCardAfter(cont: HTMLElement, y: number): HTMLElement | null {
	const items: HTMLElement[] = Array.prototype.slice.call(cont.querySelectorAll<HTMLElement>
		('.kanban-card:not(.dragging')) as HTMLElement[];

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

document.addEventListener('click', hideMenu);
document.addEventListener('contextmenu', rightClick);

function hideMenu(_e: Event) {
	contextMenu.style.display = 'none';
}

function rightClick(e: MouseEvent) {
	e.preventDefault();

	contextMenu.style.display = 'block';
	contextMenu.style.left = e.pageX + 'px';
	contextMenu.style.top = e.pageY + 'px';
}
