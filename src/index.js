import Global from './styles/global.css'

// ==================================
// Normal styles
// ==================================

// import './styles/index.css'
// const html = `<div class="header">
// 	<h2 class="title">CSS Modules</h2>
// </div>`

// ==================================
// CSS Modules styles
// ==================================

import Index from './styles/index.css'
console.log('Index', Index)
console.log('Golbal', Global)
const html = `<div class="${Index.header}">
	<h2 class="${Index.title}">CSS Modules</h2>
</div>`

document.getElementById('container').innerHTML = html