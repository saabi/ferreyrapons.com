/**
 * Created by ushi on 11/04/16.
 */
import * as THREE from 'three';
//import * as OrbitControls from 'OrbitControls';

const backgroundPolygonShader = `
      uniform float time;
      uniform vec3 mouse;

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
        float t2 = clamp((time-timeOffset)/10.0,0.0,1.0);
 
        vT = t/life;

        vec3 mid1 = vec3(x0+vx*100.*t, vy*100.*t, 0.0);

        float prox = 2.0-smoothstep(0.0, 20.0, distance(mouse,mid1));

        fPos *= t2*prox;
        fPos *= (1.0-vT)*size;
        fPos = rotate(fPos, time*5.0*vx);
        //fPos = lookAt(normalize(mid1-cameraPosition), fPos);
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
      uniform vec3 mouse;
      uniform sampler2D face;
      uniform sampler2D icons;
      uniform float transitionTime;
      uniform float oldIdx;
      uniform float newIdx;

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
      vec2 calcIconUVs(float idx, vec2 coord) {
        float idx2 = mod(idx,6.0)+2.0;
        vec2 offset = vec2(mod(idx2,2.0),0.0);
        offset.y = floor(idx2/2.0);
        vec2 iuv = coord;
        iuv += offset;
        iuv /= vec2(2.0,4.0);
        return iuv;
      }
      vec4 color = vec4(177.0/255.0,126.0/255.0,44.0/255.0,1.0);
      vec4 getIcon(float idx, vec2 coord) {
        vec4 c = texture2D(icons, calcIconUVs(idx, coord))*color;
        c.w = 1.0 - c.w;
        return c;
      }

      vec3 process(float idx, vec3 fPos) {
        float x0 = (rand(vec2(idx,4.0)))*width;
        float y0 = (rand(vec2(idx,5.0)))*height;
        float vx = (rand(vec2(idx,0.0))-0.5)*0.1;
        float vy = (rand(vec2(idx,1.0))-0.5)*0.1;
        float t = clamp((time-idx/250.0)/5.0,0.0,1.0);
        float trans = smoothstep(transitionTime, transitionTime+1.0, time);
 
        vec3 mid1 = vec3(mod(x0+vx*100.*time,width)-width/2.0, mod(y0+vy*100.*time,height)-height/2.0, 0.0);
        vec2 coord = vec2(mid1.x, mid1.y);
        coord /= vec2(width, height);
        coord += vec2(0.5, 0.5);
        coord += vec2(sin(time/1.6+coord.x*3.1415)/25.0,cos(time/2.0+coord.y*3.1415)/20.0);

        vec4 newColor, oldColor;
        newColor = (newIdx>=0.0) ? getIcon(newIdx, coord) : texture2D(face, coord);
        if (trans < 1.0) {
          oldColor = (oldIdx>=0.0) ? getIcon(oldIdx, coord) : texture2D(face, coord);
          vFaceColor = mix(oldColor, newColor, trans);
        } else {
          vFaceColor = newColor;
        }
        float a = 1.0 - pow(vFaceColor.w, 1.0/1.2);

        float prox = 7.0-smoothstep(0.0, 20.0, distance(mouse,mid1))*6.0;
  
        //fPos = lookAt(normalize(mid1-cameraPosition), fPos);
        fPos *= a*t*prox;
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
    let xmx = -1;
    let xmn = 1;
    let ymx = -1;
    let ymn = 1;
    while (a1 < TWOPI) {
        let x = Math.sin(a1);
        let y = Math.cos(a1)
        geo.vertices.push(new THREE.Vector3(i*2.2 + cx + x, cy + y, 0 ));
        xmx =Math.max(xmx,x);
        xmn =Math.min(xmn,x);
        ymx =Math.max(ymx,y);
        ymn =Math.min(ymn,y);
        a1 += pa;
    }
    let min = new THREE.Vector2(xmn,ymn);
    min.addScalar(1);
    min.divideScalar(2);
    let scale = new THREE.Vector2(xmx,ymx);
    scale.addScalar(1);
    scale.divideScalar(2);
    scale.sub(min);
    let side = 1;
    while (side < sides-1) {
        let baseVertex = i*(sides);
        let face = new THREE.Face3(baseVertex, baseVertex + side, baseVertex + side+1);
        let v = geo.vertices;
        let uvs = [
            new THREE.Vector2((v[baseVertex].x-cx-i*2.2)/2+0.5, (v[baseVertex].y-cy)/2+0.5),
            new THREE.Vector2((v[baseVertex+side].x-cx-i*2.2)/2+0.5, (v[baseVertex+side].y-cy)/2+0.5),
            new THREE.Vector2((v[baseVertex+side+1].x-cx-i*2.2)/2+0.5, (v[baseVertex+side+1].y-cy)/2+0.5)
        ];
        for (let uvi = 0; uvi < uvs.length; uvi++) {
            let uv = uvs[uvi];
            uv.sub(min);
            uv.divide(scale);
        }
        geo.faceVertexUvs[0].push(uvs);
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
        renderer.domElement.style.position = 'fixed';
        renderer.setClearColor( 0x000318 );
        document.body.insertBefore(renderer.domElement, document.body.firstChild);

        let camera = new THREE.PerspectiveCamera(45,1,4,40000);
        camera.setLens(35);

        let radius = 100;

        let scene = new THREE.Scene();
        camera.position.z = radius;
        scene.add(camera);

        const hashes = {
            aboutme: 1,
            experience: 5,
            projects: 3,
            skills: 2,
            portfolio: 4,
            education:0
        };
        function getHashIdx() {
            if (location.hash === '')
                return -1;
            else
                return hashes[location.hash.substring(1, location.hash.length)];
        }

        let backgroundUniforms = {
            time : { type: "f", value: 0.0 },
            mouse : {type: 'v3', value: new THREE.Vector3()}
        };

        let foregroundUniforms = {
            time : { type: "f", value: 0.0 },
            face: { type: 't', value: null },
            icons: { type: 't', value: null },
            width : { type: "f", value: 68.0 },
            height : { type: "f", value: 70.0 },
            size : { type: "f", value: 1.0 },
            transitionTime : { type: "f", value: 0 },
            oldIdx : { type: "f", value: getHashIdx() },
            newIdx : { type: "f", value: getHashIdx() },
            mouse : {type: 'v3', value: new THREE.Vector3(),
            }
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

        function resize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            let height = (camera.fov*Math.PI/180)*radius/2;
            bp.position.x = -height*1.2 * camera.aspect;
            bp.position.y = -height*1.2;
            fp.position.x = (height * camera.aspect - foregroundUniforms.width.value/2)*1.05;
            fp.position.y = 0;
        };
        window.addEventListener('resize', resize);

        resize();

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
        let target = new THREE.Vector3();
        let mouse = new THREE.Vector3();
        window.onmousemove = function (ev) {
            mouse.x = (ev.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(ev.clientY / renderer.domElement.clientHeight) * 2 + 1;
            mouse.z = 0.5;
            mouse.unproject(camera);
            let dir = mouse.sub( camera.position ).normalize();
            let distance = - camera.position.z / dir.z;
            target = camera.position.clone().add( dir.multiplyScalar( distance ) );
        };

        window.onhashchange = function (ev) {
            foregroundUniforms.oldIdx.value = foregroundUniforms.newIdx.value ;
            foregroundUniforms.newIdx.value = getHashIdx();
            foregroundUniforms.transitionTime.value = renderTime-timeLoaded;
        };
        let controls = new OrbitControls.OrbitControls(camera);
        /*
        let control = {
            'Animation': 5,
            'Books': 1
        };
         let gui = new dat.GUI();
         gui.add(control, 'Animation', 0, 100).step(1);
         gui.add(control, 'Books', 1, books.length).step(1);
         */

        let animate = function(t:number) {
            requestAnimationFrame(animate/*, renderer.domElement*/);
            t = t/1000;
            renderTime = t;
            backgroundUniforms.time.value = t;
            foregroundUniforms.time.value = t-timeLoaded;
            backgroundUniforms.mouse.value.copy(target);
            foregroundUniforms.mouse.value.copy(target);
            bp.worldToLocal(backgroundUniforms.mouse.value);
            fp.worldToLocal(foregroundUniforms.mouse.value);
            renderer.render(scene, camera);
        };
        animate(0);
    };
}
