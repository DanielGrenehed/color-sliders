import {remap, squish} from './math.js';
import {createChild, createLabel} from './element_util.js';

function sliderInput(target, pos, callback) {
	if (target == undefined) {return;}
	let vertical = target.classList.contains("vslider");
	let pic = target.getElementsByClassName("slider-picker")[0];
	let size = vertical ? target.clientHeight - pic.offsetHeight : target.clientWidth - pic.offsetWidth;
	pos = Math.max(0, Math.min(size, pos));
	if (pic != undefined) {
		if (vertical) {
			pic.style.top = pos + "px";
		} else {
			pic.style.left = pos + "px";
		}
	}
	let val = vertical ? remap(0,size, 1, 0, pos) : remap(0, size, 0, 1, pos);
	callback(val);
}

function mapSlider(s, callback) {
	s.picker = s.getElementsByClassName("slider-picker");
	s.picker = s.picker.length < 1 ? createChild(s, "slider-picker") : s.picker[0];
	let vertical = s.classList.contains("vslider");
	
	
	let touch_callback = (evt) => {
		evt.preventDefault();
		if (evt.targetTouches.length > 0) {
			let target = evt.targetTouches[0].target;
			let pos;
			if (vertical) {
				pos = evt.targetTouches[0].pageY - target.getBoundingClientRect().top;
			} else {
				pos = evt.targetTouches[0].pageX - target.getBoundingClientRect().left;
			}
			sliderInput(target, pos, callback);
		}
	}

	let mouse_callback = (evt) => {
		evt.preventDefault();
		let pos, target = evt.originalTarget == undefined ? evt.srcElement : evt.originalTarget;
		if (evt.buttons == undefined || evt.buttons != 1) {return;}
		pos = vertical ? evt.layerY : evt.layerX;
		sliderInput(target, pos, callback)
	}

	s.addEventListener("touchstart", touch_callback);
	s.addEventListener("touchend", touch_callback);
	s.addEventListener("touchcancel", touch_callback);
	s.addEventListener("touchmove", touch_callback);
	s.addEventListener("mousedown", mouse_callback);
	s.addEventListener("mousemove", mouse_callback);
	s.addEventListener("click", mouse_callback);
	return s;
}

function createSlider(p, label, maxValue, callback, vertical=false) {
	let container = createLabel(p, label);
	container.classList.add("input-component");
	if (vertical) {
		container.classList.add("stacked");
	}

	let valueInput = document.createElement("div");
	valueInput.contentEditable = true;
	valueInput.classList.add("value-input");
	container.appendChild(valueInput);
	
	let slider = mapSlider(createChild(container, [(vertical ? "vslider" : "slider")]), (v) => {
		slider.value = v;
		valueInput.innerHTML = parseInt(remap(0,1,0,maxValue,v));
		callback(v);
	});

	slider.setValue = (v) => {
		let rv = squish(0,1,v);
		slider.value = v;
		let real =  remap(0,1,0,maxValue,rv);
		if (maxValue >= 100) { real = Math.round(real); }
		else {real = real.toFixed(2);}
		valueInput.innerHTML = real;
		let size = vertical ? slider.clientHeight - slider.picker.offsetHeight : slider.clientWidth - slider.picker.offsetWidth;
		let pos = vertical ? remap(0,1,size,0,rv) : remap(0,1,0,size,rv); 
		if (vertical) {
			slider.picker.style.top = pos + "px";
		} else {
			slider.picker.style.left = pos + "px";
		}
	}

	valueInput.addEventListener("keydown", (evt) => {
		if (evt.keyCode === 13) {
			evt.preventDefault();
			let v = parseInt(valueInput.innerHTML);
			if (v != undefined) {
				v = remap(0, maxValue, 0, 1, squish(0, maxValue, v));
				slider.setValue(v); 
				callback(v);
			}
		}
	});
	slider.setValue(0);
	return slider;
}
export {createSlider};
