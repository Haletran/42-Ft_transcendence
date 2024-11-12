import { renderData } from './render.js';

export async function fetchData() {
  try {
    const response = await fetch('/api/items/');
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}