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