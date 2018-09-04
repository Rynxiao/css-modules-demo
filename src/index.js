import './styles/global.css'
import './styles/index.css'

// ==================================
// Normal styles
// ==================================
const html = `<div class="header">
	<h2 class="title">CSS Modules</h2>
</div>`

// ==================================
// CSS Modules styles
// ==================================

// console.log('Index', Index)
// const html = `<div class="${Index.header}">
// 	<h2 class="${Index.title}">CSS Modules</h2>
// </div>`

document.getElementById('container').innerHTML = html