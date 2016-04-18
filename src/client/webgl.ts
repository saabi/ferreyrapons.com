/**
 * Created by ushi on 11/04/16.
 */
import * as THREE from 'three';
import * as OrbitControls from 'OrbitControls';

const backgroundPolygonShader = `
      uniform float time;
      uniform vec3 camPos;

      varying float vIdx;
      varying float vT;
      varying vec2 vUv;

      highp float randhp(vec2 co) {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
      }

      float rand(vec2 co)
      {
        return fract(sin(mod(dot(co.xy,vec2(12.9898,78.233)),3.1415)) * 43758.5453);
      }

      vec3 rotate(vec3 pos, float angle) {
        angle = mod(angle, 6.283185307179586);
        float ca = cos(angle);
        float sa = sin(angle);
        vec3 pos1 = pos;
        pos1.x = ca*pos.x - sa*pos.y;
        pos1.y = sa*pos.x + ca*pos.y;
        return pos1;
      }

      vec3 lookAt(vec3 eye1, vec3 fPos) {
        vec3 up = vec3(0.0,1.0,0.0);
        vec3 za = eye1;
        vec3 xa = normalize(cross(up,za));
        vec3 ya = cross(za,xa);
        
        mat4 la = mat4(xa,0.0,ya,0.0,za,0.0,0.0,0.0,0.0,1.0);

        return (la*vec4(fPos,1.0)).xyz;
      }

      vec3 process(float idx, vec3 fPos) {
        float x0 = rand(vec2(idx, 4.0))*50.0;
        float vx = rand(vec2(idx, 0.0))*0.1;
        float vy = rand(vec2(idx, 1.0))*0.1;
        float life = rand(vec2(idx, 2.0))*10.0;
        float size = rand(vec2(idx, 5.0))*10.0;
        float timeOffset = rand(vec2(idx,3.0))*10.0;
        float t = mod(time+timeOffset, life);
        float t2 = (time-timeOffset)/10.0;
        if (t2<0.0) t2 = 0.0;
        if (t2>1.0) t2 = 1.0;
 
        vT = t/life;

        vec3 mid1 = vec3(x0+vx*100.*t, vy*100.*t, 0.0);

        fPos *= t2;
        fPos *= (1.0-vT)*size;
        fPos = rotate(fPos, time*5.0*vx);
        //fPos = lookAt(normalize(mid1-camPos), fPos);
        fPos += mid1;

        return fPos;      
      }

      void main() {
        float idx = floor(position.x/2.2);
        vec3 mid = vec3(idx*2.2 + 1.1, 0.0, 0.0);
        vec3 fPos = position-mid;

        fPos = process(idx, fPos);

        vec4 mvPosition = modelViewMatrix * vec4(fPos, 1.0);
        vec4 p = projectionMatrix * mvPosition;
        vIdx = idx;
        vUv = uv;
        gl_Position = p;
      }`;
const backgroundFragmentShader = `
      uniform float time;

      varying float vIdx;
      varying float vT;

      void main() {
        float a = (1.0-vT)*0.5;
        gl_FragColor = vec4(0.5,0.5,0.5,a);
      }`;
const foregroundPolygonShader = `
      uniform float time;
      uniform float width;
      uniform float height;
      uniform float size;
      uniform vec3 camPos;
      uniform sampler2D face;

      varying float vIdx;
      varying float vT;
      varying vec2 vUv;
      varying vec4 vFaceColor;

      highp float randhp(vec2 co) {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
      }

      float rand(vec2 co)
      {
        return fract(sin(mod(dot(co.xy,vec2(12.9898,78.233)),3.1415)) * 43758.5453);
      }

      vec3 rotate(vec3 pos, float angle) {
        angle = mod(angle, 6.283185307179586);
        float ca = cos(angle);
        float sa = sin(angle);
        vec3 pos1 = pos;
        pos1.x = ca*pos.x - sa*pos.y;
        pos1.y = sa*pos.x + ca*pos.y;
        return pos1;
      }

      vec3 lookAt(vec3 eye1, vec3 fPos) {
        vec3 up = vec3(0.0,1.0,0.0);
        vec3 za = eye1;
        vec3 xa = normalize(cross(up,za));
        vec3 ya = cross(za,xa);
        
        mat4 la = mat4(xa,0.0,ya,0.0,za,0.0,0.0,0.0,0.0,1.0);

        return (la*vec4(fPos,1.0)).xyz;
      }

      vec3 process(float idx, vec3 fPos) {
        float x0 = (rand(vec2(idx,4.0)))*width;
        float y0 = (rand(vec2(idx,5.0)))*height;
        float vx = (rand(vec2(idx,0.0))-0.5)*0.1;
        float vy = (rand(vec2(idx,1.0))-0.5)*0.1;
        float t = (time-idx/250.0)/5.0;
        if (t<0.0) t = 0.0;
        if (t>1.0) t = 1.0;

 
        vec3 mid1 = vec3(mod(x0+vx*100.*time,width)-width/2.0, mod(y0+vy*100.*time,height)-height/2.0, 0.0);
        vec2 coord = vec2(mid1.x, mid1.y);
        coord /= vec2(width, height);
        coord += vec2(0.5, 0.5);
        coord += vec2(sin(time/1.6+coord.x*3.1415)/25.0,cos(time/2.0+coord.y*3.1415)/20.0);
        vFaceColor = texture2D(face, coord);
        float a = 1.0 - pow(vFaceColor.w, 1.0/1.2);
  
        //fPos = lookAt(normalize(mid1-camPos), fPos);
        fPos *= a*t;
        fPos += mid1;

        return fPos;
      }

      void main() {
        float idx = floor(position.x/2.2);
        vec3 mid = vec3(idx*2.2 + 1.1, 0.0, 0.0);
        vec3 fPos = position-mid;

        fPos = process(idx, fPos);

        vec4 mvPosition = modelViewMatrix * vec4(fPos, 1.0);
        vec4 p = projectionMatrix * mvPosition;
        vIdx = idx;
        vUv = uv;
        gl_Position = p;
      }`;
const foregroundFragmentShader = `
      uniform float time;
      uniform sampler2D face;
      uniform sampler2D icons;

      varying vec2 vUv;
      varying float vIdx;
      varying float vT;
      varying vec4 vFaceColor;

      void main() {
        float idx = mod(vIdx,6.0)+2.0;
        vec2 offset = vec2(mod(idx,2.0),0.0);
        offset.y = floor(idx/2.0);
        vec2 uv = vUv;
        uv += offset;
        uv /= vec2(2.0,4.0);
        vec4 faceColor = vFaceColor;
        float a = faceColor.w;
        faceColor.w = 1.0;
        vec4 textureColor = texture2D(icons, uv) * faceColor;
        if ( textureColor.a < 0.5 ) discard;
        gl_FragColor = textureColor;
      }`;
function regularPolygon(geo:THREE.Geometry, sides:number, cx:number, cy:number, i:number) {
    const TWOPI = Math.PI *2;
    geo.vertices.push(new THREE.Vector3( cx + i*2.2, cy, 0 ));
    const pa = TWOPI/sides;
    let a1 = 0;
    while (a1 < TWOPI) {
        geo.vertices.push(new THREE.Vector3( i*2.2 + cx + Math.sin(a1), cy + Math.cos(a1), 0 ));
        a1 += pa;
    }
    let side = 0;
    while (side < sides) {
        let baseVertex = i*(sides+1);
        let face = new THREE.Face3(baseVertex, baseVertex + side+1, baseVertex + (side+1)%sides+1);
        geo.faces.push(face);
        side++;
    }
}
function regularPolygon2(geo:THREE.Geometry, sides:number, cx:number, cy:number, i:number) {
    const TWOPI = Math.PI *2;
    const pa = TWOPI/sides;
    let a1 = TWOPI/2/sides;
    while (a1 < TWOPI) {
        geo.vertices.push(new THREE.Vector3( i*2.2 + cx + Math.sin(a1), cy + Math.cos(a1), 0 ));
        a1 += pa;
    }
    let side = 1;
    while (side < sides-1) {
        let baseVertex = i*(sides);
        let face = new THREE.Face3(baseVertex, baseVertex + side, baseVertex + side+1);
        let v = geo.vertices;
        geo.faceVertexUvs[0].push([
            new THREE.Vector2((v[baseVertex].x-cx-i*2.2)/2+0.5, (v[baseVertex].y-cy)/2+0.5),
            new THREE.Vector2((v[baseVertex+side].x-cx-i*2.2)/2+0.5, (v[baseVertex+side].y-cy)/2+0.5),
            new THREE.Vector2((v[baseVertex+side+1].x-cx-i*2.2)/2+0.5, (v[baseVertex+side+1].y-cy)/2+0.5)
        ]);
        geo.faces.push(face);
        side++;
    }
}
function createPolygons (amount:number, sides: number, uniforms: any) {
    let geo = new THREE.Geometry();

    const cx = 1.1;
    const cy = 0;

    for (let i=0; i<amount; i++) {
        regularPolygon2(geo, sides, cx, cy, i);
    }
    return geo;
}

function createBackgroundPolygons(uniforms) {
    let geo = createPolygons(150, 5, uniforms);

    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms : uniforms,
        vertexShader : backgroundPolygonShader,
        fragmentShader : backgroundFragmentShader
    });
    shaderMaterial.transparent = true;
    shaderMaterial.opacity = 0.5;
    shaderMaterial.depthTest = false;
    shaderMaterial.side = THREE.DoubleSide;

    let polygons = new THREE.Mesh(
        geo,
        shaderMaterial
    );

    let top = new THREE.Object3D();
    top.add(polygons);
    return top;
}

function createForegroundPolygons(uniforms) {
    let geo = createPolygons(5000, 4, uniforms);
    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms : uniforms,
        vertexShader : foregroundPolygonShader,
        fragmentShader : foregroundFragmentShader
    });
    shaderMaterial.transparent = true;
    shaderMaterial.opacity = 0.5;
    shaderMaterial.depthTest = false;
    shaderMaterial.side = THREE.DoubleSide;

    let polygons = new THREE.Mesh(
        geo,
        shaderMaterial
    );

    let top = new THREE.Object3D();
    top.add(polygons);
    return top;
}
export class WebGLSupport {
    constructor() {
        let renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor( 0x000318 );
        document.body.appendChild(renderer.domElement);

        let camera = new THREE.PerspectiveCamera(45,1,4,40000);
        camera.setLens(35);

        let radius = 100;

        let scene = new THREE.Scene();
        camera.position.z = radius;
        scene.add(camera);
        
        let backgroundUniforms = {
            time : { type: "f", value: 0.0 },
        };
        // instantiate a loader
        var loader = new THREE.TextureLoader();

        let foregroundUniforms = {
            time : { type: "f", value: 0.0 },
            face: { type: 't', value: null },
            icons: { type: 't', value: null },
            width : { type: "f", value: 68.0 },
            height : { type: "f", value: 70.0 },
            size : { type: "f", value: 1.0 }
        };
        let fp = createForegroundPolygons(foregroundUniforms);
        let bp = createBackgroundPolygons(backgroundUniforms);

        scene.add(bp);

        let loader = new THREE.TextureLoader()
        let loaded = 0;
        let renderTime = 0;
        let timeLoaded = 0;
        loader.load('/img/udgy-thick6.png', function ( texture ) {
                foregroundUniforms.face.value = texture;
                loaded++;
                startFG();
            });
        loader.load('/img/icons.png', function ( texture ) {
                foregroundUniforms.icons.value = texture;
                loaded++;
                startFG();
            });
        function startFG() {
            if (loaded === 2) {
                timeLoaded = renderTime;
                scene.add(fp);
            }
        }

        //camera.position.y = 40;
        //camera.lookAt(scene.position);

        window.onresize = function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            let height = (camera.fov*Math.PI/180)*radius/2;
            bp.position.x = -height*1.2 * camera.aspect;
            bp.position.y = -height*1.2;
            fp.position.x = (height * camera.aspect - foregroundUniforms.width.value/2)*1.05;
            fp.position.y = 0;
        };
        window.onresize(null);

/*
        let down = false;
        let sx = 0, sy = 0;
        window.onmousedown = function (ev){
            if (ev.target == renderer.domElement) {
                down = true;
                sx = ev.clientX;
                sy = ev.clientY;
            }
        };
        let wheelHandler = function(ev:WheelEvent) {
            let ds = (ev.detail < 0 || ev.wheelDelta > 0) ? (1/1.25) : 1.25;
            let fov = camera.fov * ds;
            fov = Math.min(120, Math.max(1, fov));
            camera.fov = fov;
            camera.updateProjectionMatrix();
            ev.preventDefault();
        };
        window.addEventListener('DOMMouseScroll', wheelHandler, false);
        window.addEventListener('mousewheel', wheelHandler, false);
        window.onmouseup = function(){ down = false; };
        window.onmousemove = function(ev) {
            if (down) {
                let dx = ev.clientX - sx;
                let dy = ev.clientY - sy;
                //camera.rotation.y += dx/500 * (camera.fov/45);
                //camera.rotation.x += dy/500 * (camera.fov/45);
                camera.position.y = 40;
                camera.lookAt(scene.position);
                //camera.
                sx += dx;
                sy += dy;
            }
        };
*/


        let controls = new OrbitControls.OrbitControls(camera);
        /*
        let control = {
            'Animation': 5,
            'Books': 1
        };
        */
        /*
         let gui = new dat.GUI();
         gui.add(control, 'Animation', 0, 100).step(1);
         gui.add(control, 'Books', 1, books.length).step(1);
         */
        /*
        let letterCountTitle = document.createElement('p');
        letterCountTitle.innerHTML = 'Look around by dragging, zoom with the mouse wheel<br><br>Letter count: ';
        let s = letterCountTitle.style;
        s.position = 'fixed';
        s.left = s.top = '10px';
        document.body.appendChild(letterCountTitle);

        let letterCountElement = document.createElement('span');
        letterCountTitle.appendChild(letterCountElement);
        */
        let animate = function(t:number) {
            requestAnimationFrame(animate/*, renderer.domElement*/);
            t = t/1000;
            renderTime = t;
            backgroundUniforms.time.value = t;
            foregroundUniforms.time.value = t-timeLoaded;

            renderer.render(scene, camera);
        };
        animate(0);
    };
}
