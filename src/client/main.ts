/**
 * Created by ushi on 17/11/15.
 */

import {Vec2} from '../common/Vec2D';
import {LoadMeter} from 'LoadMeter';

module System {
    var iconPaths = {
        aboutme: "m 7e-8,1052.3584 c 0,-0.013 0.0176096,-0.068 0.0278172,-0.087 0.038631,-0.072 0.13171059,-0.1421 0.23964448,-0.1792 l 0.0217451,-0.01 0.0279366,0.023 c 0.035209,0.03 0.0586047,0.043 0.10045498,0.057 0.0294357,0.01 0.0386707,0.011 0.0819585,0.011 0.0407256,0 0.053298,0 0.0761044,-0.01 0.0415864,-0.014 0.0771247,-0.034 0.10563,-0.06 l 0.0257957,-0.024 0.0279541,0.01 c 0.0649762,0.021 0.13724783,0.064 0.18227567,0.1092 0.0451935,0.045 0.0730143,0.094 0.0799592,0.1418 L 1,1052.3622 l -0.5,0 c -0.27499999,0 -0.5,0 -0.5,0 z m 0.48199433,-0.2139 c -0.0933887,-0.011 -0.1755587,-0.073 -0.21867319,-0.1667 -0.0223974,-0.048 -0.0299689,-0.083 -0.0320622,-0.1456 -0.002166,-0.065 0.003665,-0.101 0.0247112,-0.1532 0.0346578,-0.086 0.0961505,-0.1465 0.17528793,-0.1726 0.038606,-0.013 0.0979915,-0.013 0.13659759,0 0.0973394,0.032 0.16961391,0.1192 0.19573854,0.2358 0.008489,0.038 0.008489,0.1201 0,0.158 -0.0309103,0.1379 -0.12956679,0.2341 -0.25037759,0.2441 -0.0107327,8e-4 -0.0247827,10e-4 -0.0312223,2e-4 z",
        education: "m 7e-6,1051.9822 c 0,-1.3 1.76096,-6.8 2.78172,-8.7 3.8631,-7.2 13.171059,-14.21 23.964448,-17.92 l 2.17451,-1 2.79366,2.3 c 3.5209,3 5.86047,4.3 10.045498,5.7 2.94357,1 3.86707,1.1 8.19585,1.1 4.07256,0 5.3298,0 7.61044,-1 4.15864,-1.4 7.71247,-3.4 10.563,-6 l 2.57957,-2.4 2.79541,1 c 6.49762,2.1 13.724783,6.4 18.227567,10.92 4.51935,4.5 7.30143,9.4 7.99592,14.18 l 0.2724,2.2 -50,0 c -27.499999,0 -50,0 -50,0 z m 48.199433,-21.39 c -9.33887,-1.1 -17.55587,-7.3 -21.867319,-16.67 -2.23974,-4.8 -2.99689,-8.3 -3.20622,-14.56 -0.2166,-6.5 0.3665,-10.1 2.47112,-15.32 3.46578,-8.6 9.61505,-14.65 17.528793,-17.26 3.8606,-1.3 9.79915,-1.3 13.659759,0 9.73394,3.2 16.961391,11.92 19.573854,23.58 0.8489,3.8 0.8489,12.01 0,15.8 -3.09103,13.79 -12.956679,23.41 -25.037759,24.41 -1.07327,0.08 -2.47827,0.1 -3.12223,0.02 z",
        experience: "m -0.5,1052.7914 c 0,-0.013 0.0176096,-0.068 0.0278172,-0.087 0.038631,-0.072 0.13171059,-0.1421 0.23964448,-0.1792 l 0.0217451,-0.01 0.0279366,0.023 c 0.035209,0.03 0.0586047,0.043 0.10045498,0.057 0.0294357,0.01 0.0386707,0.011 0.0819585,0.011 0.0407256,0 0.053298,0 0.0761044,-0.01 0.0415864,-0.014 0.0771247,-0.034 0.10563,-0.06 l 0.0257957,-0.024 0.0279541,0.01 c 0.0649762,0.021 0.13724783,0.064 0.18227567,0.1092 0.0451935,0.045 0.0730143,0.094 0.0799592,0.1418 l 0.002724,0.022 -0.5,0 c -0.27499999,0 -0.5,0 -0.5,0 z m 0.48199433,-0.2139 c -0.0933887,-0.011 -0.1755587,-0.073 -0.21867319,-0.1667 -0.0223974,-0.048 -0.0299689,-0.083 -0.0320622,-0.1456 -0.002166,-0.065 0.003665,-0.101 0.0247112,-0.1532 0.0346578,-0.086 0.0961505,-0.1465 0.17528793,-0.1726 0.038606,-0.013 0.0979915,-0.013 0.13659759,0 0.0973394,0.032 0.16961391,0.1192 0.19573854,0.2358 0.008489,0.038 0.008489,0.1201 0,0.158 -0.0309103,0.1379 -0.12956679,0.2341 -0.25037759,0.2441 -0.0107327,8e-4 -0.0247827,10e-4 -0.0312223,2e-4 z",
        portfolio: "m -0.5,1052.7914 c 0,-0.013 0.0176096,-0.068 0.0278172,-0.087 0.038631,-0.072 0.13171059,-0.1421 0.23964448,-0.1792 l 0.0217451,-0.01 0.0279366,0.023 c 0.035209,0.03 0.0586047,0.043 0.10045498,0.057 0.0294357,0.01 0.0386707,0.011 0.0819585,0.011 0.0407256,0 0.053298,0 0.0761044,-0.01 0.0415864,-0.014 0.0771247,-0.034 0.10563,-0.06 l 0.0257957,-0.024 0.0279541,0.01 c 0.0649762,0.021 0.13724783,0.064 0.18227567,0.1092 0.0451935,0.045 0.0730143,0.094 0.0799592,0.1418 l 0.002724,0.022 -0.5,0 c -0.27499999,0 -0.5,0 -0.5,0 z m 0.48199433,-0.2139 c -0.0933887,-0.011 -0.1755587,-0.073 -0.21867319,-0.1667 -0.0223974,-0.048 -0.0299689,-0.083 -0.0320622,-0.1456 -0.002166,-0.065 0.003665,-0.101 0.0247112,-0.1532 0.0346578,-0.086 0.0961505,-0.1465 0.17528793,-0.1726 0.038606,-0.013 0.0979915,-0.013 0.13659759,0 0.0973394,0.032 0.16961391,0.1192 0.19573854,0.2358 0.008489,0.038 0.008489,0.1201 0,0.158 -0.0309103,0.1379 -0.12956679,0.2341 -0.25037759,0.2441 -0.0107327,8e-4 -0.0247827,10e-4 -0.0312223,2e-4 z",
        projects: "m -0.5,1052.7914 c 0,-0.013 0.0176096,-0.068 0.0278172,-0.087 0.038631,-0.072 0.13171059,-0.1421 0.23964448,-0.1792 l 0.0217451,-0.01 0.0279366,0.023 c 0.035209,0.03 0.0586047,0.043 0.10045498,0.057 0.0294357,0.01 0.0386707,0.011 0.0819585,0.011 0.0407256,0 0.053298,0 0.0761044,-0.01 0.0415864,-0.014 0.0771247,-0.034 0.10563,-0.06 l 0.0257957,-0.024 0.0279541,0.01 c 0.0649762,0.021 0.13724783,0.064 0.18227567,0.1092 0.0451935,0.045 0.0730143,0.094 0.0799592,0.1418 l 0.002724,0.022 -0.5,0 c -0.27499999,0 -0.5,0 -0.5,0 z m 0.48199433,-0.2139 c -0.0933887,-0.011 -0.1755587,-0.073 -0.21867319,-0.1667 -0.0223974,-0.048 -0.0299689,-0.083 -0.0320622,-0.1456 -0.002166,-0.065 0.003665,-0.101 0.0247112,-0.1532 0.0346578,-0.086 0.0961505,-0.1465 0.17528793,-0.1726 0.038606,-0.013 0.0979915,-0.013 0.13659759,0 0.0973394,0.032 0.16961391,0.1192 0.19573854,0.2358 0.008489,0.038 0.008489,0.1201 0,0.158 -0.0309103,0.1379 -0.12956679,0.2341 -0.25037759,0.2441 -0.0107327,8e-4 -0.0247827,10e-4 -0.0312223,2e-4 z",
        skills: "m -0.5,1052.7914 c 0,-0.013 0.0176096,-0.068 0.0278172,-0.087 0.038631,-0.072 0.13171059,-0.1421 0.23964448,-0.1792 l 0.0217451,-0.01 0.0279366,0.023 c 0.035209,0.03 0.0586047,0.043 0.10045498,0.057 0.0294357,0.01 0.0386707,0.011 0.0819585,0.011 0.0407256,0 0.053298,0 0.0761044,-0.01 0.0415864,-0.014 0.0771247,-0.034 0.10563,-0.06 l 0.0257957,-0.024 0.0279541,0.01 c 0.0649762,0.021 0.13724783,0.064 0.18227567,0.1092 0.0451935,0.045 0.0730143,0.094 0.0799592,0.1418 l 0.002724,0.022 -0.5,0 c -0.27499999,0 -0.5,0 -0.5,0 z m 0.48199433,-0.2139 c -0.0933887,-0.011 -0.1755587,-0.073 -0.21867319,-0.1667 -0.0223974,-0.048 -0.0299689,-0.083 -0.0320622,-0.1456 -0.002166,-0.065 0.003665,-0.101 0.0247112,-0.1532 0.0346578,-0.086 0.0961505,-0.1465 0.17528793,-0.1726 0.038606,-0.013 0.0979915,-0.013 0.13659759,0 0.0973394,0.032 0.16961391,0.1192 0.19573854,0.2358 0.008489,0.038 0.008489,0.1201 0,0.158 -0.0309103,0.1379 -0.12956679,0.2341 -0.25037759,0.2441 -0.0107327,8e-4 -0.0247827,10e-4 -0.0312223,2e-4 z"
        //fuck: "m 0,0 l 1,0 1,0.5 0.5,1 0,1 z",
        //fuck: "m 0,0 l 1,0 1,0.5 0.5,1 0,1 z"
    }

    interface Color {
        r: number;
        g: number;
        b: number;
        a: number;
    }
    interface Particle {
        pos: Vec2;
        vel: Vec2;
        ovel: Vec2;
        rot:number;
        rotvel:number;
        frames: number;
        icon: number;
        //pvel:number;
    }

    interface IRenderer {
        init(canvas:HTMLCanvasElement):void;
        renderPentagon(i:number, c:Color, ac:number, as:number, x:number, y:number):void;
        renderIcon(i:number, icon:number, c:Color, ac:number, as:number, x:number, y:number):void;
        clearScreen():void;
        flush():void;
    }

    const mx = Math.max;
    const mn = Math.min;
    const sin = Math.sin;
    const cos = Math.cos;
    const round = Math.round;
    const PI = Math.PI;
    const TWOPI = Math.PI*2;

    module Canvas2D {
        let pa = (360/5)/180*PI;
        function pentagon(ctx:CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.moveTo(0, 1);
            let a1 = pa;
            while (a1 < TWOPI) {
                ctx.lineTo(Math.sin(a1), Math.cos(a1));
                a1 += pa;
            }
            ctx.fill();
        }
        function pentagonPath() {
            let p = new Path2D();
            p.moveTo(0, 1);
            let a1 = pa;
            while (a1 < TWOPI) {
                p.lineTo(Math.sin(a1), Math.cos(a1));
                a1 += pa;
            }
            p.closePath();
            return p;
        }
        function loadPaths(paths:any):Path2D[] {
            var icons:Path2D[] = [];
            for (var pathName in paths) {
                var path = paths[pathName];
                icons.push(new Path2D(path));
            }
            return icons;
        }
        export class Renderer implements IRenderer {
            ctx:CanvasRenderingContext2D;
            usingPath2D:boolean;
            pentaPath:any;
            icons:Path2D[];

            init(canvas:HTMLCanvasElement):void {
                this.usingPath2D = !!window.Path2D;
                this.pentaPath = this.usingPath2D ? pentagonPath() : null;
                this.icons = loadPaths(iconPaths);
                console.log(this.usingPath2D ? 'Using Path2D.' : 'Path2D not found.');
                this.ctx = canvas.getContext('2d');
            }
            renderPentagon(i:number, c:Color, ac:number, as:number, x:number, y:number):void {
                let ctx = this.ctx;
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`;
                ctx.setTransform(ac, as, -as, ac, x, y);
                if (this.usingPath2D)
                    ctx.fill(this.pentaPath);
                else
                    pentagon(ctx);
            }
            renderIcon(i:number, icon:number, c:Color, ac:number, as:number, x:number, y:number):void {
                let ctx = this.ctx;
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`;
                ctx.setTransform(ac, as, -as, ac, x, y);
                if (this.usingPath2D)
                    ctx.fill(this.icons[icon]);
                else
                    pentagon(ctx);
            }

            clearScreen():void {
                let ctx = this.ctx;
                ctx.setTransform(1,0,0,1,0,0);
                ctx.clearRect(0, 0, CW, CH);
                //canvas.width = canvas.width;
            }
            flush() {
                this.ctx.setTransform(1,0,0,1,0,0);
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(faceParticles.length.toString(), 0, 10);
            }
        }
    }
    module Canvas3D {
        export class Renderer implements IRenderer {
            init(canvas:HTMLCanvasElement):void {}
            renderPentagon(i:number, c:Color, ac:number, as:number, x:number, y:number):void {}
            renderIcon(i:number, icon:number, c:Color, ac:number, as:number, x:number, y:number):void {}
            clearScreen():void {}
            flush():void {}
        }
    }
    function updateVelocities() {
        let l = faceParticles.length;
        for (let i=0; i<l; i++) {
            let p = faceParticles[i];
            let v = 1+getVelocity(p.pos.x, p.pos.y);
            let v1 = Math.pow((v)/256,1.8)*2+0.1;
            p.vel.assign(p.ovel);
            p.vel.scale(v1);
            //p.rotvel = (256-v)/1024;
            //p.vel.x *= 0.99;
            //p.vel.y = -v;
        }
    }
    function updatePositions(ps:Particle[]) {
        let l = ps.length;
        let w = udgy.width;
        for (let i=0; i<l; i++) {
            let p = ps[i];
            let pp = p.pos;
            pp.add(p.vel);
//            p.phase += p.pvel;
            //pp.x += w;
            //pp.x %= w;
            //pp.y += CH;
            //pp.y %= CH;
            pp.x = (pp.x+w)%w;
            pp.y = (pp.y+CH)%CH;
            p.rot += p.rotvel;
            p.frames++;
            /*if (p.pos.y < 0)
             reset(p);*/
        }
    }
    function updatePositions1(ps:Particle[]) {
        let l = ps.length;
        //let tmp = new Vec2();
        for (let i=0; i<l; i++) {
            let p = ps[i];
            //tmp.assign(p.vel);
            //tmp.scale(2.5-2*p.pos.y/CH);
            //p.pos.add(tmp);
            p.pos.add(p.vel);
//            p.phase += p.pvel;
//            p.pos.x = (p.pos.x)%CW1;
//            p.pos.y = (p.pos.y)%CH;
            p.rot += p.rotvel;
            if (p.pos.y < -100 || p.pos.x > CW)
               reset1(p);
            p.frames++;
        }
    }
    function reset(p:Particle) {
        p.pos.x = Math.random()*udgy.width;
        p.pos.y = Math.random()*udgy.height;
        p.vel.x = Math.random()*2-1;
        p.vel.y = Math.random()*2-1;
        //p.vel.y = -Math.random()-0.01;
        p.ovel.assign(p.vel);
        p.rot = Math.random()*Math.PI*2;
        p.rotvel = (Math.random()*Math.PI*2-Math.PI)/60;
        p.frames = 0;

//        p.phase = 0;
//        p.pvel = (Math.random()*Math.PI*2*5+0.5)/60;
    }
    function reset1(p:Particle) {
        let pos = Math.random()*(CW+CH+200);
        if (pos<CH) {
            p.pos.x = -100;
            p.pos.y = pos;
        } else {
            p.pos.x = pos-CH-100;
            p.pos.y = CH+100;
        }
        p.vel.x = Math.random()*3;
        p.vel.y = -Math.random()*3;

        //p.vel.y = -Math.random()-0.01;
        p.ovel.assign(p.vel);
        p.rot = Math.random()*Math.PI*2;
        p.rotvel = (Math.random()*Math.PI*2-Math.PI)/60;
        p.frames = 0;
//        p.phase = 0;
//        p.pvel = (Math.random()*Math.PI*2*5+0.5)/60;
    }
    var iconNumber = 0;
    function spawn() : Particle {
        let p = {
            pos: new Vec2(0, 0),
            vel: new Vec2(0, 0),
            ovel: new Vec2(0, 0),
            rot: 0,
            rotvel: 0,
            frames: 0,
            icon: iconNumber
        }
        iconNumber = (iconNumber+1)%(renderer.icons.length);
        reset(p);
        return p;
    }
    function spawn2() : Particle {
        let p = {
            pos: new Vec2(0, 0),
            vel: new Vec2(0, 0),
            ovel: new Vec2(0, 0),
            rot: 0,
            rotvel: 0,
            frames: 0,
            icon: 0
        }
        //iconNumber++;
        //iconNumber %= renderer.icons.length-1;
        reset1(p);
        return p;
    }

    function renderFaceParticles(renderer:IRenderer) {
        let xo = CW-udgy.offsetWidth+30;
        let l = faceParticles.length;
        let c = {r:0,g:0,b:0,a:0};
        let tmp:Vec2 = new Vec2(0,0);
        for (let i = 0; i < l; i++) {
            let p = faceParticles[i];
            let ppx = p.pos.x;
            let ppy = p.pos.y;
            let pr = p.rot;

            getColor(ppx, ppy, c);
            let cr = c.r;
            let cg = c.g;
            let cb = c.b;
            let v = c.a;

            let val = mx(cr, cg, cb);
            let diff = val - mn(cr, cg, cb);
            let s = diff / val;

            let r = (256 - v) / mx(128-s*64, 256 - p.frames) + 0.5;
            r *= CH/658;

            ppx += xo;

            if (r>1 && ppx<CW) {
                tmp.assign(mouse);
                tmp.x -= xo;
                tmp.subtract(p.pos);
                    let d = tmp.squaredLength();
                tmp.scale(-100/d);
                tmp.add(p.pos);
                tmp.x += xo;

                r += 1000/Math.sqrt(d);

                let angle_sine = sin(pr)*r,
                    angle_cosine = cos(pr)*r;

                renderer.renderIcon(i, p.icon, c, angle_cosine, angle_sine, tmp.x, tmp.y);
                //renderer.renderPentagon(i, c, angle_cosine, angle_sine, tmp.x, tmp.y);
            }
        }
    }
    function renderBackgroundParticles(renderer:IRenderer){
        let l1 = backgroundParticles.length;
        const uw = CW-udgy.width;
        const uh = CH*2;
        let p1 = new Vec2(uw,0);
        let p2 = new Vec2(CW-CH/3,CH);
        let p3 = new Vec2(0,0);
        p3.assign(p2);
        p3.subtract(p1);
        let ln = p3.length();
        let cf = p2.x*p1.y - p2.y*p1.x;
        let mxln = -(p3.y*0-p3.x*CH+cf)/ln;
        let c = {r:0,g:0,b:0,a:0};
        for (let i=l1-1; i>=0; i--) {
            let p = backgroundParticles[i];
            let pp = p.pos;
            let ppx = pp.x;
            let ppy = pp.y;
            //let v = mx(0,mn(1,ppx/uw-ppy/uh));
            //let v = mx(0,mn(1000,-(p3.y*ppx-p3.x*ppy+cf)/ln));
            let v = mx(0,mn(1,-(p3.y*ppx-p3.x*ppy+cf)/ln/(mxln+i%(111*mn(CH/658,CW/1300)))));
            //let r = (1-v)*100;
            let r = v * CH/7;
            //r *= mn(CH/658,CW/1300);

            let angle_sine = sin(p.rot)*r,
            angle_cosine = cos(p.rot)*r;

            let v1 = round(160+((1-v)**2.4)*96)+i%40;
            c.r = mn(255,v1);
            c.g = mn(255,v1-i%10);
            c.b = mn(255,v1-i%25);
            c.a = v/16;

            renderer.renderPentagon(i, c, angle_cosine, angle_sine, ppx, ppy);
        }
    }

    let frame=0;
    function loop() {
        requestAnimationFrame(loop);
        meter.begin();
        updateVelocities();
        meter.mark('velocities');
        updatePositions(faceParticles);
        meter.mark('pos1');
        updatePositions1(backgroundParticles);
        meter.mark('pos2');
        if (/*meter.average < 20 && */faceParticles.length < 500) {
            faceParticles.push(spawn());
            faceParticles.push(spawn());
            faceParticles.push(spawn());
        } else if (faceParticles.length>3) {
            //faceParticles.length -= 3;
        }
        if (backgroundParticles.length < 100) {
            backgroundParticles.push(spawn2());
        }

        renderer.clearScreen();
        renderBackgroundParticles(renderer);
        meter.mark('render');
        renderFaceParticles(renderer);
        meter.mark('render1');
        meter.end();
        renderer.flush();
        meter.render('render1');
        frame++;
    }

    function getColor(x:number, y:number, c:Color) {
        if (!speedImageData)
            return 255;
        let data = speedImageData.data;
        let CW = speedImageData.width;
        let CH = speedImageData.height;
        x += sin(frame/100+y/CH*PI)*30;
        y += cos(frame/150+x/CW*PI)*20;
        y = round(mx(0, mn(y,CH-1)));
        x = round(mx(0, mn(x,CW-1)));
        y = ((CW * y) + x) * 4;
        c.r = data[y++];
        c.g = data[y++];
        c.b = data[y++];
        c.a = data[y];
    }
    function getVelocity(x:number, y:number) {
        if (!speedImageData)
            return 255;
        let CW = speedImageData.width;
        let CH = speedImageData.height;
        x += sin(frame/100+y/CH*PI)*30;
        y += cos(frame/150+x/CW*PI)*20;
        y = round(mx(0, mn(y,CH-1)));
        x = round(mx(0, mn(x,CW-1)));
        return speedImageData.data[((CW * y) + x) * 4+3];
    }

    let mouse:Vec2 = new Vec2(0,0);
    onmousemove = function(e: MouseEvent) {  // se llama cuando se mueve el mouse
        /*
        var target = e.target || e.srcElement,
            rect = target.getBoundingClientRect(),
            offsetX = e.clientX - rect.left,
            offsetY = e.clientY - rect.top;
        */
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
    };

    const meter = new LoadMeter(document.body);

    let speedCtx: CanvasRenderingContext2D;
    let speedImageData:ImageData;
    let CW:number, CH:number;
    let faceParticles:Particle[] = [];
    let backgroundParticles:Particle[] = [];
    //let udgy: HTMLImageElement;
    const canvas = <HTMLCanvasElement>document.createElement('canvas');
    canvas.id = 'particles';
    let renderer = new Canvas2D.Renderer();

    const speedCanvas = <HTMLCanvasElement>document.createElement('canvas');
    speedCanvas.id = 'speed';

    const udgy = <HTMLImageElement>document.createElement('img');
    udgy.id = 'udgy';
    udgy.onload = function () {
        renderer.init(canvas);
        speedCtx = speedCanvas.getContext('2d');
        CW = canvas.width = canvas.offsetWidth;
        CH = canvas.height = canvas.offsetHeight;


        meter.colors = {
            velocities: 'green',
            pos1: 'yellow',
            pos2: 'orange',
            render: 'red',
            render1: 'purple',
            next: 'blue'
        };
        meter.order = ['next', 'render1', 'render', 'pos2', 'pos1', 'velocities'];

        function resize() {
            speedCanvas.width = udgy.offsetWidth;
            speedCanvas.height = udgy.offsetHeight;
            CW = canvas.width = canvas.offsetWidth;
            CH = canvas.height = canvas.offsetHeight;

            speedCtx.drawImage(udgy, 0, 0, speedCanvas.width, speedCanvas.height);
            speedImageData = speedCtx.getImageData(0, 0, speedCanvas.width, speedCanvas.height);

            h1.style.fontSize = 0.95 * header.offsetWidth * h1fs + 'px';
            h2.style.fontSize = 0.95 * header.offsetWidth * h2fs + 'px';
        }

        window.addEventListener('resize', resize);

        resize();

        requestAnimationFrame(loop);
    }
    udgy.src = 'img/udgy-thick4.png';

    document.body.insertBefore(udgy,document.body.firstChild);
    document.body.insertBefore(speedCanvas,document.body.firstChild);
    document.body.insertBefore(canvas,document.body.firstChild);

    //var icons:HTMLImageElement[] = <HTMLImageElement[]>document.getElementById("icons").children;
    //var icons:Path2D[] = renderer.loadPaths;

    const header = <HTMLElement>document.querySelector('body > header');
    const h1 = <HTMLElement>document.querySelector('body > header > h1');
    const h2 = <HTMLElement>document.querySelector('body > header > h2');
    const h1fs = parseInt(window.getComputedStyle(h1).fontSize) / h1.offsetWidth;
    const h2fs = parseInt(window.getComputedStyle(h2).fontSize) / h2.offsetWidth;
    h1.style.fontSize = 0.95 * header.offsetWidth * h1fs + 'px';
    h2.style.fontSize = 0.95 * header.offsetWidth * h2fs + 'px';
}
