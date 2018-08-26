import './styles/global.css'
import Index from './styles/index.css'

console.log('Index', Index)

const html = `<div class="${Index.header}">
	<h2 class="${Index.title}">CSS Modules</h2>
</div>`

document.getElementById('container').innerHTML = html;