const API_BASE_URL = 'https://api.jikan.moe/v4';

export async function searchAnime(query) {
  const response = await fetch(`${API_BASE_URL}/anime?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function searchManga(query) {
  const response = await fetch(`${API_BASE_URL}/manga?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function getAnimeStreaming(id) {
  const response = await fetch(`${API_BASE_URL}/anime/${id}/streaming`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
