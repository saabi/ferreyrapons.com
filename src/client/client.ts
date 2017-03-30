/**
 * Created by ushi on 22/03/16.
 */

import {WebGLSupport} from "webgl";

const header = <HTMLElement>document.querySelector('body > header');
const h1 = <HTMLElement>document.querySelector('body > header > h1');
const h2 = <HTMLElement>document.querySelector('body > header > h2');
const cv = <HTMLElement>document.querySelector('#cv');
const h1fs = parseInt(window.getComputedStyle(h1).fontSize) / h1.offsetWidth;
const h2fs = parseInt(window.getComputedStyle(h2).fontSize) / h2.offsetWidth;
h1.style.fontSize = 0.95 * header.offsetWidth * h1fs + 'px';
h2.style.fontSize = 0.95 * header.offsetWidth * h2fs + 'px';

function resize() {
    h1.style.fontSize = 0.95 * header.offsetWidth * h1fs + 'px';
    h2.style.fontSize = 0.95 * header.offsetWidth * h2fs + 'px';
    cv.style.top = header.offsetTop + header.offsetHeight + 16 + 'px';
    cv.style.width = header.offsetWidth + 'px';
}

window.addEventListener('resize', resize);
resize();

const modal = document.createElement('div');
modal.style.position = 'fixed';
modal.style.width = '100%';
modal.style.height = '100%';
document.body.insertBefore(modal, document.body.firstChild);
modal.onclick = function(ev) {
    location.hash = '';
};

let webgl = new WebGLSupport();

let gui = new dat.GUI();
gui.add(webgl, 'gradient');
gui.add(webgl, 'feedback');
gui.add(webgl, 'scale', 0.8, 1.2);
gui.add(webgl, 'rotateZ', -0.2, 0.2);
gui.add(webgl, 'fade', 0, 1);
gui.add(webgl, 'blending', ['No', 'Normal', 'Additive', 'Substractive', 'Multiply', 'Custom']);
gui.add(webgl, 'equation', ['Add','Subtract','ReverseSubtract','Min','Max']);
gui.add(webgl, 'source', ['Zero','One','SrcColor','OneMinusSrcColor','SrcAlpha','OneMinusSrcAlpha','DstAlpha','OneMinusDstAlpha','DstColor','OneMinusDstColor','SrcAlphaSaturate']);
gui.add(webgl, 'destination', ['Zero','One','SrcColor','OneMinusSrcColor','SrcAlpha','OneMinusSrcAlpha','DstAlpha','OneMinusDstAlpha','DstColor','OneMinusDstColor']);

