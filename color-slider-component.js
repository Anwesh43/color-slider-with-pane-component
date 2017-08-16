var w = window.innerWidth,h = window.innerHeight
class ColorSliderComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.color = this.getAttribute('color')
        const shadow = document.createElement('shadow')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/4
        canvas.height = h/20
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class ColorSlider {
    constructor(color,w,h) {
        this.color = color
        this.w = w
        this.h = h
        this.x = 0
        this.y = 0
        this.val = 0
    }
    draw(context) {
        context.strokeStyle = 'gray'
        context.lineWidth = this.h/3
        context.beginPath()
        context.moveTo(this.h/2,0)
        context.lineTo(this.w,0)
        context.stroke()
        context.beginPath()
        context.arc(this.x,this.y,this.h/2,0,2*Math.PI)
        context.fill()
    }
    update(x,y) {
        if(x<=this.w-this.h/2 && x>=0) {
            this.x = x
            this.y = y
            this.val = ((this.x)/(this.w-this.h/2))*255
        }
    }
    handleTap(x,y) {
        return x>=this.x-this.h/2 && x<=this.x+this.h/2 && y>=this.y && y<=this.y+this.h
    }
}
