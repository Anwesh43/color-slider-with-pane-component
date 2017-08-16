var w = window.innerWidth,h = window.innerHeight
class ColorSliderComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = document.createElement('shadow')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/4
        canvas.height = h/10
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
