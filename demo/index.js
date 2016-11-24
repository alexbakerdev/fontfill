import './style.css'

import { AutoFittingText } from './AutoFittingText.js'
import ia from 'interact.js'

var p = document.createElement('p')
var div = document.createElement('div')
div.appendChild(p)

const testString = `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 11032.`

div.className = 'textbox'

const family = 'Arial'
const lineHeight = 1.2

window.fittedText = new AutoFittingText(p.offsetWidth, p.offsetHeight, { targetString: testString, family, lineHeight })

document.body.appendChild(div)
ia('.textbox')
  .draggable({
    onmove: window.dragMoveListener
  })
  .resizable({
    preserveAspectRatio: false,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .gesturable({
    max          : 1,
    maxPerElement: 1,
    manualStart  : Boolean,
  })
  .on('resizemove', function (event) {
    var target = event.target
    var x = (parseFloat(target.getAttribute('data-x')) || 0)
    var y = (parseFloat(target.getAttribute('data-y')) || 0)

    // update the element's style
    target.style.width  = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'

    // translate when resizing from top or left edges
    x += event.deltaRect.left
    y += event.deltaRect.top

    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    let width = p.offsetWidth
    let height = p.offsetHeight

    window.fittedText.width = width
    window.fittedText.height = height

    updatePara()
  })

window.fittedText.$watch('metrics', (old, metrics) => {
  updatePara()
})

function updatePara () {
  p.style.fontSize = `${window.fittedText.metrics.fontSize}px`
  p.style.fontFamily = window.fittedText.family
  p.style.lineHeight = window.fittedText.lineHeight
  p.innerHTML = window.fittedText.metrics.lines.join('<br/>')
}

window.updatePara = updatePara
let width = p.offsetWidth
let height = p.offsetHeight

window.fittedText.width = width
window.fittedText.height = height

updatePara()
