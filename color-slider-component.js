var w = window.innerWidth,h = window.innerHeight
class ColorSliderComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.color = this.getAttribute('color')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.img.draggable = false
        console.log(this.img.draggable)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/4
        canvas.height = h/15
        const context = canvas.getContext('2d')
        if(!this.colorSlider) {
            this.colorSlider = new ColorSlider(this.color,canvas.width,canvas.height)
        }
        this.colorSlider.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.mouseHandler = new MouseHandler(this.img,this,this.colorSlider)
        this.mouseHandler.handleMouseActions()
    }
}
class ColorSlider {
    constructor(color,w,h) {
        this.color = color
        this.w = w
        this.h = h
        this.x = 0
        this.y = this.h/2
        this.val = 0
    }
    draw(context) {
        context.lineCap = 'round'
        context.fillStyle = this.color
        context.strokeStyle = 'gray'
        context.lineWidth = this.h/3
        context.beginPath()
        context.moveTo(this.h/2,this.h/2)
        context.lineTo(this.w-this.h/2,this.h/2)
        context.stroke()
        context.strokeStyle = this.color
        context.beginPath()
        context.moveTo(this.h/2,this.h/2)
        context.lineTo(this.x,this.h/2)
        context.stroke()
        context.beginPath()
        context.arc(this.x+this.h/4,this.y,this.h/2,0,2*Math.PI)
        context.fill()
    }
    update(x) {
        if(x<=this.w-3*this.h/4 && x>=this.h/4) {
            this.x = x
            this.val = ((this.x)/(this.w-this.h/2))*255
        }
    }
    handleTap(x,y) {
        return x>=this.x-this.h/2 && x<=this.x+this.h/2 && y>=this.y && y<=this.y+this.h
    }
}
class MouseHandler {
    constructor(dom,component,colorSlider) {
        this.dom = dom
        this.component = component
        this.colorSlider = colorSlider
        this.down = false
    }
    handleMouseActions() {
        this.dom.onmousedown = (event) =>{
            if(!this.down && this.colorSlider.handleTap(event.offsetX,event.offsetY)) {
                this.down = true
            }
        }
        this.dom.onmousemove = (event) => {
            if(this.down) {
                this.colorSlider.update(event.offsetX)
                this.component.render()
            }
        }
        this.dom.onmouseup = (event) => {
            if(this.down) {
                this.down = false
            }
        }
    }
}
customElements.define('color-slider-comp',ColorSliderComponent)
