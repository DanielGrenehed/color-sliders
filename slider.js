import {remap, squish} from './math.js';
import {createChild} from './element_util.js';

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

function mapSlider(slider, callback) {
	let picker = slider.getElementsByClassName("slider-picker");
	picker = picker.length < 1 ? createChild(slider, "slider-picker") : picker[0];
	let vertical = slider.classList.contains("vslider");
	
	slider.setValue = (v) => {
		let size = vertical ? slider.clientHeight - picker.offsetHeight : slider.clientWidth - picker.offsetWidth;
		let pos = vertical ? remap(0,1,size,0,squish(0,1,v)) : remap(0,1,0,size,squish(0,1,v)); 
		if (vertical) {
			picker.style.top = pos + "px";
		} else {
			picker.style.left = pos + "px";
		}
	}

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

	slider.addEventListener("touchstart", touch_callback);
	slider.addEventListener("touchend", touch_callback);
	slider.addEventListener("touchcancel", touch_callback);
	slider.addEventListener("touchmove", touch_callback);
	slider.addEventListener("mousedown", mouse_callback);
	slider.addEventListener("mousemove", mouse_callback);
	slider.addEventListener("click", mouse_callback);
	return slider;
}

export {mapSlider};
