/**
 * Created by ushi on 02/12/15.
 */

export class Vec2 {
    x:number;
    y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    assign(v:Vec2) {
        this.x = v.x;
        this.y = v.y;
    }

    add(v:Vec2) {
        this.x += v.x;
        this.y += v.y;
    }

    subtract(v:Vec2) {
        this.x -= v.x;
        this.y -= v.y;
    }

    scale(v:number) {
        this.x *= v;
        this.y *= v;
    }

    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    squaredLength() {
        return (this.x * this.x) + (this.y * this.y);
    }

    normalize() {
        let iLen = 1 / this.length();
        this.x *= iLen;
        this.y *= iLen;
    }

    clamp(limit:number) {
        this.x = Math.max(-limit, Math.min(limit, this.x));
        this.y = Math.max(-limit, Math.min(limit, this.y));
    }
}
