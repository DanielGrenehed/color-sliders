
function addClasses(e, classes) {
	if (typeof(classes) == "string") {
		e.classList.add(classes);
	} else {
		for (let i = 0; i < classes.length; i++) {
			e.classList.add(classes[i]);
		}
	}
}

function createChild(p, classes) {
	let child = document.createElement("div");
	addClasses(child, classes);
	p.appendChild(child);
	return child;
}

function createLabel(p, text, classes=[]) {
 	let container = document.createElement("div");
	container.classList.add("labeled");
	addClasses(container, classes);

	let label = document.createElement("div");
	label.classList.add("label");
	label.innerHTML = text;

	container.appendChild(label);
	p.appendChild(container);
	return container;
}

function createTabbedContainer(tabs, callback) {
	let container = document.createElement("div");
	container.classList.add("tabbed")
	let button_container = document.createElement("div");
	button_container.classList.add("tab-buttons");
	container.appendChild(button_container);
	
	container.buttons = {};
	container.tabs = {};

	let on_click = (tab) => {
		console.log(container);
		for (let i = 0; i < tabs.length; i++) {
			let t = tabs[i];
			console.log(t);
			console.log(container.tabs);
			container.buttons[t].classList.remove("active");
			container.tabs[t].classList.add("hidden");
		}
		container.buttons[tab].classList.add("active");
		container.tabs[tab].classList.remove("hidden");
		callback(tab);
	}

	console.log("after on_click");
	
	for (let i = 0; i < tabs.length; i++) {
		let tab_container = document.createElement("div");
		container.tabs[tabs[i]] = tab_container;
		container.appendChild(tab_container);

		let button = document.createElement("div");
		button.innerHTML = tabs[i];
		button.classList.add("tab-button");
		button.addEventListener("click", (evt) => {on_click(tabs[i]);});
		button_container.appendChild(button);
		container.buttons[tabs[i]] = button;
	}

	console.log(container.tabs);
	on_click(tabs[0]);
	return container;	
}

export {addClasses, createChild, createLabel, createTabbedContainer};
