"use client";

import { useState } from 'react';
import { searchAnime, searchManga, getAnimeStreaming } from '../lib/jikanApi';

const REQUEST_DELAY = 1000; // 1 second delay

export default function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnimeChecked, setIsAnimeChecked] = useState(false);
  const [isMangaChecked, setIsMangaChecked] = useState(false);
  const [isBooksChecked, setIsBooksChecked] = useState(false);
  const [isGamesChecked, setIsGamesChecked] = useState(false);
  const [isMoviesChecked, setIsMoviesChecked] = useState(false);
  const [isTVShowsChecked, setIsTVShowsChecked] = useState(false);
  const [animeStreaming, setAnimeStreaming] = useState({});

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSearch = async (e) => {
    e.preventDefault();

    if ((!isAnimeChecked && !isMangaChecked && !isBooksChecked && !isGamesChecked && !isMoviesChecked && !isTVShowsChecked) || query.trim() === '') {
      setAnimeList([]);
      setMangaList([]);
      return;
    }

    setLoading(true);

    try {
      if (isAnimeChecked) {
        const animeData = await searchAnime(query);
        console.log('Anime Data:', animeData);

        // Sort by popularity
        const sortedAnimeData = animeData.data.sort((a, b) => a.popularity - b.popularity);
        setAnimeList(sortedAnimeData);

        // Fetch streaming info for each anime with throttling
        const streamingInfoPromises = sortedAnimeData.map(async (anime, index) => {
          await delay(REQUEST_DELAY * index); // Apply delay to avoid rate limit
          return getAnimeStreaming(anime.mal_id);
        });
        const streamingInfoResults = await Promise.all(streamingInfoPromises);

        // Store streaming information in state
        const streamingInfo = streamingInfoResults.reduce((acc, result, index) => {
          acc[sortedAnimeData[index].mal_id] = result.data;
          return acc;
        }, {});
        console.log('Stream Data:', streamingInfo);
        setAnimeStreaming(streamingInfo);
      } else {
        setAnimeList([]);
      }

      if (isMangaChecked) {
        const mangaData = await searchManga(query);
        console.log('Manga Data:', mangaData);

        // Sort by popularity
        const sortedMangaData = mangaData.data.sort((a, b) => a.popularity - b.popularity);
        setMangaList(sortedMangaData);
      } else {
        setMangaList([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setAnimeList([]);
      setMangaList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <header>
        <h1 className="text-3xl font-bold p-4">Backlog Builder</h1>
      </header>
      <main className="flex flex-col items-center justify-between p-6">
        <div>
          <div className="p-4">
            <form className="max-w-xl mx-auto" onSubmit={handleSearch}>
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search All"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
                <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </form>
          </div>
          <div className="p-4">
            <label className="inline-flex items-center cursor-pointer px-2">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isAnimeChecked}
                onChange={() => setIsAnimeChecked(!isAnimeChecked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Anime</span>
            </label>
            <label className="inline-flex items-center cursor-pointer px-2">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isMangaChecked}
                onChange={() => setIsMangaChecked(!isMangaChecked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Manga</span>
            </label>
            <label className="inline-flex items-center cursor-pointer px-2">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isBooksChecked}
                onChange={() => setIsBooksChecked(!isBooksChecked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Books</span>
            </label>
            <label className="inline-flex items-center cursor-pointer px-2">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isGamesChecked}
                onChange={() => setIsGamesChecked(!isGamesChecked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Games</span>
            </label>
            <label className="inline-flex items-center cursor-pointer px-2">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isMoviesChecked}
                onChange={() => setIsMoviesChecked(!isMoviesChecked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Movies</span>
            </label>
            <label className="inline-flex items-center cursor-pointer px-2">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isTVShowsChecked}
                onChange={() => setIsTVShowsChecked(!isTVShowsChecked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">TV Shows</span>
            </label>
          </div>
        </div>
      </main>
      <section className="flex w-full max-w-7xl p-4 space-x-4">
        {loading && <p>Loading...</p>}
        {!loading && (
          <>
            {animeList.length > 0 && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Anime Results</h2>
                <ul className="space-y-4">
                  {animeList.map((anime) => (
                    <li key={anime.mal_id} className="result-item flex gap-4">
                      <img
                        src={anime.images?.jpg?.image_url || '/placeholder.png'}
                        alt={anime.title}
                        className="anime-photo w-32 h-auto"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{anime.title}</h3>
                        {anime.score && (
                          <p className="anime-score">My Anime List Score: {anime.score}</p>
                        )}
                        {anime.status && (
                          <p>Status: {anime.status}</p>
                        )}
                        {anime.episodes && (
                          <p>Episodes: {anime.episodes}</p>
                        )}
                        {anime.genres && (
                          <p>Genres: {anime.genres.map(genre => genre.name).join(', ')}</p>
                        )}
                        {animeStreaming[anime.mal_id] && (
                          <div>
                            <h4>Now Streaming On:</h4>
                            <ul>
                              {animeStreaming[anime.mal_id].map((stream) => (
                                <li key={stream.provider_id}>
                                  <a href={stream.url} target="_blank" rel="noopener noreferrer">
                                    {stream.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {mangaList.length > 0 && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Manga Results</h2>
                <ul className="space-y-4">
                  {mangaList.map((manga) => (
                    <li key={manga.mal_id} className="result-item flex gap-4">
                      <img
                        src={manga.images?.jpg?.image_url || '/placeholder.png'}
                        alt={manga.title}
                        className="anime-photo w-32 h-auto"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{manga.title}</h3>
                        {manga.score && (
                          <p className="anime-score">Score: {manga.score}</p>
                        )}
                        {manga.status && (
                          <p>Status: {manga.status}</p>
                        )}
                        {manga.chapters && (
                          <p>Chapters: {manga.chapters}</p>
                        )}
                        {manga.genres && (
                          <p>Genres: {manga.genres.map(genre => genre.name).join(', ')}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
