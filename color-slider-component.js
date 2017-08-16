var w = window.innerWidth,h = window.innerHeight
class ColorSliderComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.color = this.getAttribute('color')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.img.draggable = false
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
        this.x = this.h/2
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
        context.arc(this.x,this.y,this.h/3,0,2*Math.PI)
        context.fill()
    }
    update(x) {
        if(x<=this.w-this.h/2 && x>=this.h/2) {
            this.x = x
            this.val = Math.floor(((this.x)/(this.w-this.h/2))*255)
        }
    }
    handleTap(x,y) {
        return x>=this.x-this.h && x<=this.x+this.h && y>=this.y && y<=this.y+this.h
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
                if(this.component.onchange) {
                    this.component.onchange(this.colorSlider.val)
                }
            }
        }
        this.dom.onmouseup = (event) => {
            if(this.down) {
                this.down = false
            }
        }
    }
}
class RGBColorSliderGroupComponent extends HTMLElement{
    constructor() {
        super()
        this.sliders = []
        const colors = ['red','green','blue']
        const shadow = this.attachShadow({mode:'open'})
        this.r = 0
        this.g = 0
        this.b = 0
        const callbacks = [(val)=>{this.r = val;if(this.onchange){this.onchange(this.r,this.g,this.b);}},(val)=>{this.g = val;if(this.onchange){this.onchange(this.r,this.g,this.b);}},(val)=>{this.b = val;if(this.onchange){this.onchange(this.r,this.g,this.b);}}]
        colors.forEach((color,index)=>{
            const slider = document.createElement('color-slider-comp')
            const br = document.createElement('br')
            slider.setAttribute('color',color)
            slider.onchange = (val) => {
                callbacks[index](val)
                console.log(this.r,this.g,this.b)
            }
            shadow.appendChild(slider)
            shadow.appendChild(br)
            this.sliders.push(slider)
        })
    }
}
class ColorPaneComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        this.styleDiv()
        shadow.appendChild(this.div)
        const rgbColorSlider = document.createElement('rgb-color-slider-group')
        rgbColorSlider.onchange = (r,g,b)=>{
            this.div.style.background = `rgb(${r},${g},${b})`
        }
        shadow.appendChild(rgbColorSlider)
    }
    styleDiv() {
        this.div.style.width = w/10
        this.div.style.height = w/10
        this.div.style.background = 'black'
        this.div.style.borderRadius = '20%'
    }
}
customElements.define('color-pane-comp',ColorPaneComponent)
customElements.define('rgb-color-slider-group',RGBColorSliderGroupComponent)
customElements.define('color-slider-comp',ColorSliderComponent)
