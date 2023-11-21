
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

export {addClasses, createChild, createLabel};
