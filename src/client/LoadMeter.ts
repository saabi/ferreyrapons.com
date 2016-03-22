/**
 * Created by ushi on 02/12/15.
 */

export class LoadMeter {
    times: any = {};
    colors: any = {};
    order: any = [];
    lastTime = 0;
    startTime = 0;
    duration = 100;
    average = 16.666;
    context:CanvasRenderingContext2D;

    constructor (el:HTMLElement) {
        let display = <HTMLCanvasElement>document.createElement('canvas');
        display.width = 100;
        display.height = 64;
        display.style.position = 'fixed';
        display.style.width = '100px';
        display.style.height = '64px';
        display.style.left = '20px';
        display.style.bottom = '20px';

        this.context = display.getContext('2d');
        el.appendChild(display);
    }

    color (name: string, color: string) {
        this.colors[name] = color;
    }
    begin() {
        this.lastTime = this.startTime;
        this.startTime = performance.now();
    }
    mark (name: string) {
        let times = this.times;
        if (!(name in times)) {
            times[name] = []
        }
        let time = performance.now()-this.startTime;
        times[name].push(time);
        return time;
    }
    end() {
        let times = this.times;
        if (!('next' in times)) {
            times['next'] = []
        }
        let time = this.startTime-this.lastTime;
        times['next'].push(time);
        this.average = this.average*0.98 + time*0.02;
    }
    render (selectedName:string) {
        let times = this.times;
        let selected = 0;
        let duration = this.duration;
        let ctx = this.context;

        // pintar pantalla
        ctx.fillStyle = '#444';
        ctx.fillRect(0, 0, duration, 64);
        ctx.lineWidth = 1;
        for (let j in this.order) {
            let name = this.order[j];
            ctx.strokeStyle = this.colors[name];
            let stream = times[name];
            ctx.beginPath();
            for (let i = 0; i < duration && i < stream.length; i++) {
                ctx.moveTo(duration - i - 0.5, 64);
                ctx.lineTo(duration - i - 0.5, 64 - stream[stream.length - 1 - i]);
            }
            ctx.stroke();
            if (selectedName === name)
                selected = stream[stream.length-1];
            if (stream.length > 1000) {
                this.times[name] = stream.slice(stream.length - duration);
            }
        }
        ctx.strokeStyle = 'rgba(128,255,128,0.25)';
        ctx.beginPath();
        for (let i = 1; i < 4; i++) {
            ctx.moveTo(0.5, 64.5 - i*16.66);
            ctx.lineTo(100.5, 64.5 - i*16.66);
        }
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.fillText(this.average.toFixed(2), 0, 10);
    }
}
