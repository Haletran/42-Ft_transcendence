export function renderData(data) {
	const list = data.map(item => `<li>${item.name}</li>`).join('');
	document.getElementById('data-list').innerHTML = `<ul>${list}</ul>`;
  }