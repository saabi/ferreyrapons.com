/**
 * Created by ushi on 11/04/16.
 */
import * as THREE from 'three';
//import * as OrbitControls from 'OrbitControls';

function parseCssRgb(input:string) : number {
    let m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (m) {
        return parseInt(m[1])*256*256+parseInt(m[2])*256+parseInt(m[3]);
    }
    return 0;
}
const backgroundPolygonShader = `
      uniform float time;
      uniform vec3 mouse;

      attribute float aIdx;

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

      vec3 process(float idx, vec3 fPos) {
        float x0 = rand(vec2(idx, 4.0))*50.0;
        float vx = rand(vec2(idx, 0.0))*0.1;
        float vy = rand(vec2(idx, 1.0))*0.1;
        float life = rand(vec2(idx, 2.0))*10.0;
        float size = rand(vec2(idx, 5.0))*20.0;
        float timeOffset = rand(vec2(idx,3.0))*10.0;
        float t = mod(time+timeOffset, life);
        float t2 = clamp((time-timeOffset)/10.0,0.0,1.0);
 
        vT = t/life;

        vec3 mid1 = vec3(x0+vx*100.*t, vy*100.*t, 0.0);

        float prox = 2.0-smoothstep(0.0, 20.0, distance(mouse,mid1));

        fPos *= t2*prox;
        fPos *= (1.0-vT)*size;
        fPos = rotate(fPos, time*5.0*vx);
        fPos += mid1;

        return fPos;      
      }

      void main() {
        float idx = aIdx;
        vec3 fPos = process(idx, position);

        vec4 mvPosition = modelViewMatrix * vec4(fPos, 1.0);
        vec4 p = projectionMatrix * mvPosition;
        vIdx = idx;
        vUv = uv;
        gl_Position = p;
      }`;
const backgroundFragmentShader = `
      uniform float time;
      uniform vec4 color;
      uniform int gradient;

      varying float vIdx;
      varying float vT;
      varying vec2 vUv;
      
      void main() {
        float a = (1.0-vT)*0.5;
        if(gradient==0) {
            gl_FragColor = color*vec4(1.0,1.0,1.0,a);
        }
        else {
            vec2 uv = vUv*2.0-1.0;
            a *= 1.0-length(uv);
            gl_FragColor = color*vec4(vUv.s,vUv.t,1.0,a);
        }
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
      uniform vec4 color;

      attribute float aIdx;

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

      vec2 calcIconUVs(float idx, vec2 coord) {
        float idx2 = mod(idx,6.0)+2.0;
        vec2 offset = vec2(mod(idx2,2.0),0.0);
        offset.y = floor(idx2/2.0);
        vec2 iuv = coord;
        iuv += offset;
        iuv /= vec2(2.0,4.0);
        return iuv;
      }
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
  
        fPos *= a*t*prox;
        fPos += mid1;

        return fPos;
      }

      void main() {
        float idx = aIdx;
        vec3 fPos = process(idx, position);

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

function createPolygons (amount:number, sides: number, cx=1.1, cy = 0) {
    let geo = new THREE.Geometry();

    for (let i=0; i<amount; i++) {
        regularPolygon2(geo, sides, cx, cy, i);
    }
    return geo;
}
function createInstancedPolygons(amount:number, sides: number) {
    let polygonGeo = createPolygons(1, sides, 0, 0);
    let geo = new THREE.InstancedBufferGeometry();
    geo.fromGeometry(polygonGeo);
    geo.maxInstancedCount = amount;

    let indexes = new THREE.InstancedBufferAttribute(new Float32Array(amount), 1, 1);
    for (let i=0; i<indexes.count; i++) {
        indexes.setX(i, i);
    }
    geo.addAttribute('aIdx', indexes);

    return geo;
}

function createBackgroundPolygons(uniforms:any) {
    let geo = createInstancedPolygons(150, 5);

    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms : uniforms,
        vertexShader : backgroundPolygonShader,
        fragmentShader : backgroundFragmentShader
    });
    shaderMaterial.transparent = true;
    shaderMaterial.opacity = 0.5;
    shaderMaterial.depthTest = false;
    shaderMaterial.side = THREE.DoubleSide;
    shaderMaterial.blending = THREE.CustomBlending;
    shaderMaterial.blendDst = THREE.OneFactor;

    let polygons = new THREE.Mesh(
        geo,
        shaderMaterial
    );

    polygons.frustumCulled = false;

    let top = new THREE.Object3D();
    top.add(polygons);
    return top;
}

function createForegroundPolygons(uniforms:any) {
    let geo = createInstancedPolygons(5000, 4);
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

    polygons.frustumCulled = false;

    let top = new THREE.Object3D();
    top.add(polygons);
    return top;
}
export class WebGLSupport {
    public camera: THREE.Camera;
    public scene: THREE.Scene;
    public sceneRT: THREE.Scene;

    public useRenderTarget = false;
    public gradient = false;
    public feedback = true;
    public scale = 1.01;
    public rotateZ = 0.01;
    public fade = 0.96;
    public blending = 'Custom';
    public equation = 'Add';
    public source = 'One';
    public destination = 'OneMinusSrcColor';

    constructor() {
        let self = this;
        let screenHeight = 70;
        let screenWidth = computeAspectRatio()*screenHeight;
        let cameraDistance = 100;

        let renderer = new THREE.WebGLRenderer({antialias: true, alpha:true, depth: false, stencil: false,});
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.width = 
        renderer.domElement.style.height = '100%';
        renderer.domElement.classList.add('screen');
        renderer.autoClear = false;

        document.body.insertBefore(renderer.domElement, document.body.firstChild);

        let backgroundUniforms:any = {
            time : { type: "f", value: 0.0 },
            mouse : {type: 'v3', value: new THREE.Vector3()},
            color : {type: 'v4', value: new THREE.Vector4(0.5,0.5,0.5,1.0)},
            gradient : {type: 'i', value: this.gradient?1:0}
        };
        let bp = createBackgroundPolygons(backgroundUniforms);
        bp.name = 'background particles';

        let textureParams = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false,
            format: THREE.RGBAFormat
        };
        let currentRtTexture = 0;
        let altRtTexture = 1;
        let rtTextures: THREE.WebGLRenderTarget[];
        let cameraRT: THREE.OrthographicCamera;
        let sceneRT: THREE.Scene;
        let feedbackMaterial: THREE.ShaderMaterial;
        let feedback: THREE.Mesh;
        if (this.useRenderTarget) {
            rtTextures = [
                new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, textureParams ),
                new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, textureParams )
            ];
            cameraRT = new THREE.OrthographicCamera(-screenWidth/2, screenWidth/2, screenHeight/2, -screenHeight/2, 1, 400);
            cameraRT.name = 'backdrop camera';

            cameraRT.position.z = cameraDistance;

            sceneRT = new THREE.Scene();
            sceneRT.name = 'backdrop scene';
            this.sceneRT = sceneRT;
            sceneRT.add(cameraRT);

            let feedbackGeometry = new THREE.PlaneBufferGeometry(1, 1);
            feedbackMaterial = new THREE.ShaderMaterial( {
                uniforms: {
                    tFeedback: { type: 't', value: null },
                    fade: { type: 'f', value: this.fade }
                },
                vertexShader: `
                    varying vec2 vUv;
        
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    }`,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform sampler2D tFeedback;
                    uniform float fade;
        
                    void main() {
                        gl_FragColor = texture2D( tFeedback, vUv )*fade;
                    }`,
                depthWrite: false
            } );
            feedback = new THREE.Mesh(feedbackGeometry, feedbackMaterial);
            feedback.name = 'feedback';
            feedback.scale.x = screenWidth;
            feedback.scale.y = screenHeight;
            sceneRT.add(feedback);

            sceneRT.add(bp);
        }


        let camera = new THREE.OrthographicCamera(-screenWidth/2, screenWidth/2, screenHeight/2, -screenHeight/2, 1, 400);
        camera.name = 'main camera';

        camera.position.z = cameraDistance;

        this.camera = camera;

        let scene = new THREE.Scene();
        scene.name = 'main scene';
        this.scene = scene;
        scene.add(camera);

        let backdropMaterial: THREE.ShaderMaterial;
        let backdrop: THREE.Mesh;
        if (this.useRenderTarget) {
            let backdropGeometry = new THREE.PlaneBufferGeometry(1, 1);
            backdropMaterial = new THREE.ShaderMaterial( {
                uniforms: { tBackdrop: { type: 't', value: rtTextures[currentRtTexture].texture } },
                vertexShader: `
                    varying vec2 vUv;
        
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    }`,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform sampler2D tBackdrop;
        
                    void main() {
                        gl_FragColor = texture2D( tBackdrop, vUv );
                    }`,
                depthWrite: false
            } );

            backdrop = new THREE.Mesh( backdropGeometry, backdropMaterial );
            backdrop.name = 'backdrop plane';
            backdrop.scale.x = screenWidth;
            backdrop.scale.y = screenHeight;
            scene.add(backdrop);
        }
        else
            scene.add(bp);

        /*
        let mockFgGeo = new THREE.PlaneBufferGeometry(68,70,1,1);
        let mockFgMat = new THREE.MeshBasicMaterial({color:'white'});
        let mockFg = new THREE.Mesh(mockFgGeo, mockFgMat);
        scene.add(mockFg);
        */

        const hashes: {[hash:string]:number;} = {
            aboutme: 1,
            experience: 5,
            lab: 3,
            skills: 2,
            blog: 4,
            education:0
        };
        function getHashIdx() {
            if (location.hash === '')
                return -1;
            else
                return hashes[location.hash.substring(1, location.hash.length)];
        }

        let foregroundUniforms:any = {
            time : { type: "f", value: 0.0 },
            face: { type: 't', value: null },
            icons: { type: 't', value: null },
            width : { type: "f", value: 68.0 },
            height : { type: "f", value: 70.0 },
            size : { type: "f", value: 1.0 },
            transitionTime : { type: "f", value: 0 },
            oldIdx : { type: "f", value: getHashIdx() },
            newIdx : { type: "f", value: getHashIdx() },
            mouse : {type: 'v3', value: new THREE.Vector3()},
            color : {type: 'v4', value: new THREE.Vector4(177/255,126/255,44/255,1)}
        };
        let fp = createForegroundPolygons(foregroundUniforms);
        fp.name = 'foreground particles';

        let loader = new THREE.TextureLoader();
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
                console.log('All foreground textures loaded. Starting foreground rendering.');
            }
        }
        function computeAspectRatio() {
            let aspect = window.innerWidth / window.innerHeight;
            return aspect;
        }

        function resizeForegroundBitmaps () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.domElement.style.width = 
            renderer.domElement.style.height = '100%';
            if (self.useRenderTarget)
                rtTextures[currentRtTexture].setSize(window.innerWidth, window.innerHeight);
        }
        function resizeBackgroundBitmaps () {
            if (self.useRenderTarget)
                rtTextures[altRtTexture].setSize(window.innerWidth, window.innerHeight);
        };
        function scaleObjects () {
            let aspect = computeAspectRatio();
            screenWidth = aspect*screenHeight;

            camera.left = -screenWidth/2;
            camera.right = screenWidth/2;
            camera.updateProjectionMatrix();

            if (self.useRenderTarget) {
                cameraRT.left = -screenWidth/2;
                cameraRT.right = screenWidth/2;
                cameraRT.updateProjectionMatrix();

                backdrop.scale.x = feedback.scale.x = screenWidth;
            }

            let halfHeight = screenHeight/2;
            bp.position.x = -halfHeight*1.2 * aspect;
            bp.position.y = -halfHeight*1.2;

            fp.position.x = (halfHeight * aspect - foregroundUniforms.width.value/2)*1.1;
            fp.position.y = 0;
        };
        let lastResize = Date.now();
        function resizing () {
            lastResize = Date.now();
            scaleObjects();
        };

        window.addEventListener('resize', resizing);

        resizeForegroundBitmaps();
        resizeBackgroundBitmaps();
        resizing();

        let target = new THREE.Vector3();
        let mouse = new THREE.Vector3();

        window.onmousemove = function (ev) {
            let aspect = computeAspectRatio()*screenHeight/2;
            mouse.x = (ev.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(ev.clientY / renderer.domElement.clientHeight) * 2 + 1;
            mouse.z = 0;

            target.copy(mouse);
            target.x *= aspect;
            target.y *= screenHeight/2;
        };

        window.onmouseup = function (ev) {
            console.log('mouse: ' + mouse.x +'\t'+  mouse.y +'\t'+  mouse.z );
            console.log('target: ' + target.x +'\t'+  target.y +'\t'+  target.z );
            let t = target.clone();
            fp.worldToLocal(t);
            console.log('local: ' + t.x +'\t'+  t.y +'\t'+  t.z);
        };

        window.addEventListener('hashchange', function (ev) {
            foregroundUniforms.oldIdx.value = foregroundUniforms.newIdx.value ;
            foregroundUniforms.newIdx.value = getHashIdx();
            foregroundUniforms.transitionTime.value = renderTime-timeLoaded;
        });

        let animate = (t:number) => {
            requestAnimationFrame(animate/*, renderer.domElement*/);

            let expiryTime = lastResize + 300;
            let now = Date.now();
            if (expiryTime < now)
                resizeForegroundBitmaps();

            t = t/1000;
            renderTime = t;

            backgroundUniforms.time.value = t;
            backgroundUniforms.mouse.value.copy(target);
            backgroundUniforms.gradient.value = this.gradient?1:0;
            bp.worldToLocal(backgroundUniforms.mouse.value);
            let m = <THREE.Mesh>(bp.children[0]);
            m.material.blending = <THREE.Blending>(<any>THREE)[this.blending+'Blending'];
            m.material.blendEquation = <THREE.BlendingEquation>(<any>THREE)[this.equation+'Equation'];
            m.material.blendDst = <THREE.BlendingDstFactor>(<any>THREE)[this.destination+'Factor'];
            m.material.blendSrc = <THREE.BlendingSrcFactor>(<any>THREE)[this.source+'Factor'];

            if (this.useRenderTarget) {
                feedbackMaterial.uniforms.tFeedback.value = rtTextures[altRtTexture].texture;
                feedbackMaterial.uniforms.fade.value = this.fade;
                feedback.visible = this.feedback;
                feedback.rotation.z = this.rotateZ;
                feedback.scale.setX(this.scale*screenWidth);
                feedback.scale.setY(this.scale*screenHeight);

                renderer.clearTarget(rtTextures[currentRtTexture], true, true, true);
                renderer.render(sceneRT, cameraRT, rtTextures[currentRtTexture]);

                backdropMaterial.uniforms.tBackdrop.value = rtTextures[currentRtTexture].texture;
            }

            foregroundUniforms.time.value = t-timeLoaded;
            foregroundUniforms.mouse.value.copy(target);
            fp.worldToLocal(foregroundUniforms.mouse.value);

            renderer.render(scene, camera);
            if (expiryTime < now)
                resizeBackgroundBitmaps();

            currentRtTexture++;
            currentRtTexture %= 2;
            altRtTexture++;
            altRtTexture %= 2;

        };
        animate(0);
    };
}
