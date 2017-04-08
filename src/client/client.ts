/**
 * Created by ushi on 22/03/16.
 */

import {WebGLSupport} from "webgl";
/*
interface MyWindow extends Window {
    webgl: WebGLSupport;
}
declare var window: MyWindow;
*/
declare global {
    function resize() : void;
    interface Window {
        webgl: WebGLSupport;
    }
}

//replace SVG images by inline SVG
let menuImgs = document.body.querySelectorAll('#menu img');
for (let i=0; i<menuImgs.length; i++) {
    let img = menuImgs[i];
    let imgURL = (<HTMLImageElement>img).src;

    let req = new XMLHttpRequest();
    addLoadingTask();
    req.open("GET", imgURL, true);

    req.onreadystatechange = function() {
        if(req.readyState == 4) {
            img.outerHTML = req.responseText;
            closeLoadingTask();
        }
    };
    req.send();
};

const modal = document.createElement('div');
modal.style.position = 'fixed';
modal.style.width = '100%';
modal.style.height = '100%';
document.body.insertBefore(modal, document.body.firstChild);
modal.onclick = function(ev) {
    location.hash = '';
};

let webgl = new WebGLSupport();

function createGUI () {
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
}

window.webgl = webgl;

var tasks = 0;
function start() {
    //document.getElementById('loadingMessage').remove();
    var hidden = Array.prototype.slice.call( document.getElementsByClassName('hidden-while-loading') );
    for (var i in hidden) {
        hidden[i].classList.remove('hidden-while-loading');
    }
    resize();
    webgl.start();
}
function addLoadingTask() {
    tasks++;
}
function closeLoadingTask() {
    tasks--;
    if (tasks==0) {
        setTimeout(start, 100);
    }
}
window.addEventListener('load', start);
setTimeout(start, 100);
