"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [artist, setArtist] = useState('');
  const [artistData, setArtistData] = useState<any>(null);
  const [spotifyTracks, setSpotifyTracks] = useState<any[]>([]);
  const [lastFmData, setLastFmData] = useState<any>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<'spotify' | 'lastfm'>('spotify');
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'topTracks' | 'topAlbums' | 'bio'>('info');
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }

    const token = localStorage.getItem('spotifyAccessToken');
    setIsLoggedIn(!!token);
  }, []);

  const fetchArtistData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/getArtistData?artist=${artist}`);
      const artistInfo = response.data;
      setArtistData(artistInfo);

      if (artistInfo.id) {
        const spotifyTracksResponse = await axios.get(`/api/getTopTracks?artistId=${artistInfo.id}`);
        setSpotifyTracks(spotifyTracksResponse.data.tracks);

        const lastFmResponse = await axios.get(`/api/getLastFmData?artist=${artist}&spotifyArtistId=${artistInfo.id}`);
        setLastFmData(lastFmResponse.data);

        updateRecentSearches(artistInfo.name, artistInfo.imageUrl);
      } else {
        console.error('ID do artista está faltando');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do artista', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRecentSearches = (artistName: string, artistImage: string) => {
    let searches = [{ name: artistName, imageUrl: artistImage }, ...recentSearches];
    searches = searches.filter((item, index, self) =>
      index === self.findIndex((t) => t.name === item.name)
    ).slice(0, 3);
    setRecentSearches(searches);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchArtistData();
    }
  };

  const handleRecentSearchClick = (artistName: string) => {
    setArtist(artistName);
    fetchArtistData();
  };

  const handleLogin = () => {
    const scopes = 'user-top-read';
    const redirectUri = 'http://localhost:3000/api/spotify/callback';
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const spotifyAuthorizeUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = spotifyAuthorizeUrl;
  };

  const fetchTopTracks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('spotifyAccessToken');
      const response = await axios.get(`/api/spotify/topTracks?timeRange=${timeRange}&token=${token}`);
      setTopTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTopTracks();
    }
  }, [timeRange, isLoggedIn]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Estatísticas de Streaming do Artista</h1>

      <div className="flex mb-4">
        <input 
          type="text" 
          value={artist} 
          onChange={(e) => setArtist(e.target.value)} 
          onKeyPress={handleKeyPress} 
          placeholder="Digite o nome do artista" 
          className="border p-2 w-full text-black bg-white mr-2"
        />
        <button 
          onClick={fetchArtistData}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Buscar
        </button>
      </div>

      {recentSearches.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold inline-block mr-2">Buscas recentes:</h2>
          <div className="inline-flex space-x-2">
            {recentSearches.map((search, index) => (
              <button 
                key={index} 
                onClick={() => handleRecentSearchClick(search.name)}
                className="flex items-center bg-gray-800 text-white rounded-full px-3 py-1 transition hover:bg-gray-700"
              >
                {search.imageUrl && (
                  <img 
                    src={search.imageUrl}
                    alt={`Foto de ${search.name}`} 
                    className="w-6 h-6 rounded-full mr-2"
                  />
                )}
                <span>{search.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {artistData && (
        <div className="mt-8">
          <div className="flex space-x-4 mb-4">
            <button 
              onClick={() => setActivePlatformTab('spotify')} 
              className={`p-2 ${activePlatformTab === 'spotify' ? 'border-b-2 border-blue-500 text-[#1DB954]' : 'text-white'}`}
            >
              Spotify
            </button>
            <button 
              onClick={() => setActivePlatformTab('lastfm')} 
              className={`p-2 ${activePlatformTab === 'lastfm' ? 'border-b-2 border-blue-500 text-[#D51007]' : 'text-white'}`}
            >
              Last.fm
            </button>
          </div>

          <div className="flex space-x-4 mb-4">
            <button 
              onClick={() => setActiveSubTab('info')} 
              className={`p-2 ${activeSubTab === 'info' ? 'border-b-2 border-blue-500' : ''}`}
            >
              Informações
            </button>
            <button 
              onClick={() => setActiveSubTab('topTracks')} 
              className={`p-2 ${activeSubTab === 'topTracks' ? 'border-b-2 border-blue-500' : ''}`}
            >
              Top Tracks
            </button>
            {activePlatformTab === 'lastfm' && (
              <>
                <button 
                  onClick={() => setActiveSubTab('topAlbums')} 
                  className={`p-2 ${activeSubTab === 'topAlbums' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Top Álbuns
                </button>
                <button 
                  onClick={() => setActiveSubTab('bio')} 
                  className={`p-2 ${activeSubTab === 'bio' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Biografia
                </button>
              </>
            )}
          </div>

          {activePlatformTab === 'spotify' && (
            <div>
              {activeSubTab === 'info' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Spotify - Informações</h2>
                  <p className="text-lg font-semibold mb-2">{artistData.name}</p>
                  {artistData.imageUrl && (
                    <img
                      src={artistData.imageUrl}
                      alt={artistData.name}
                      className="w-32 h-32 mb-4 rounded-full"
                    />
                  )}
                  <p>Seguidores: {artistData.followers.toLocaleString()}</p>
                  <p>Popularidade: {artistData.popularity}</p>
                  <p>Gêneros: {artistData.genres.join(', ')}</p>
                  <p>Ouvintes Mensais: {artistData.monthlyListeners.toLocaleString()}</p>
                  <a 
                    href={artistData.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Abrir no Spotify
                  </a>
                </div>
              )}

              {activeSubTab === 'topTracks' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Spotify - Top 10 Músicas</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {spotifyTracks.map((track: any, index: number) => (
                      <li key={track.id} className="mb-2">
                        <a 
                          href={track.external_urls.spotify} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-4 border rounded-lg shadow hover:bg-gray-800 hover:text-white transition"
                        >
                          {track.albumImageUrl && (
                            <img src={track.albumImageUrl} alt={`Álbum de ${track.name}`} className="w-full h-48 object-cover mb-2 rounded-md" />
                          )}
                          <span className="font-bold block mb-2">{index + 1}. {track.name}</span>
                          <p>Popularidade: {track.streams.toLocaleString()}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activePlatformTab === 'lastfm' && lastFmData && (
            <div>
              {activeSubTab === 'info' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Last.fm - Informações</h2>
                  <p className="text-lg font-semibold mb-2">{lastFmData.artistData.name}</p>
                  {lastFmData.artistData.imageUrl ? (
                    <img
                      src={lastFmData.artistData.imageUrl}
                      alt={lastFmData.artistData.name}
                      className="w-32 h-32 mb-4 rounded-full"
                    />
                  ) : (
                    <div className="w-32 h-32 mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xl text-gray-600">Sem Foto</span>
                    </div>
                  )}
                  <p>Ouvintes: {parseInt(lastFmData.artistData.listeners).toLocaleString()}</p>
                  <p>Scrobbles: {parseInt(lastFmData.artistData.playcount).toLocaleString()}</p>
                  <p>Tags: {lastFmData.artistData.tags.join(', ')}</p>
                  <a 
                    href={`https://www.last.fm/music/${encodeURIComponent(lastFmData.artistData.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Abrir no Last.fm
                  </a>
                </div>
              )}

              {activeSubTab === 'topTracks' && lastFmData.topTracks && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Last.fm - Top 10 Músicas</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lastFmData.topTracks.map((track: { name: string; playcount: string; url: string; albumImageUrl: string }, index: number) => (
                      <li key={track.name} className="mb-2">
                        <a 
                          href={track.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-4 border rounded-lg shadow hover:bg-gray-800 hover:text-white transition"
                        >
                          {track.albumImageUrl && (
                            <img src={track.albumImageUrl} alt={`Álbum de ${track.name}`} className="w-full h-48 object-cover mb-2 rounded-md" />
                          )}
                          <span className="font-bold block mb-2">{index + 1}. {track.name}</span>
                          <p>Scrobbles: {parseInt(track.playcount).toLocaleString()}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSubTab === 'topAlbums' && lastFmData.topAlbums && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Last.fm - Top 10 Álbuns</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lastFmData.topAlbums.map((album: { name: string; playcount: string; url: string; imageUrl: string }, index: number) => (
                      <li key={album.name} className="mb-2">
                        <a 
                          href={album.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-4 border rounded-lg shadow hover:bg-gray-800 hover:text-white transition"
                        >
                          {album.imageUrl && (
                            <img src={album.imageUrl} alt={`Álbum de ${album.name}`} className="w-full h-48 object-cover mb-2 rounded-md" />
                          )}
                          <span className="font-bold block mb-2">{index + 1}. {album.name}</span>
                          <p>Scrobbles: {parseInt(album.playcount).toLocaleString()}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSubTab === 'bio' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Last.fm - Biografia</h2>
                  <div className="whitespace-pre-line">
                    <p dangerouslySetInnerHTML={{ __html: lastFmData.artistData.bio }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Relatório de Músicas Mais Ouvidas</h2>
        {!isLoggedIn ? (
          <button 
            onClick={handleLogin} 
            className="bg-green-500 text-white p-2 rounded"
          >
            Conectar ao Spotify
          </button>
        ) : (
          <div>
            <div className="flex mb-4">
              <button onClick={() => setTimeRange('short_term')} className="btn">Última Semana</button>
              <button onClick={() => setTimeRange('medium_term')} className="btn">Último Mês</button>
              <button onClick={() => setTimeRange('long_term')} className="btn">Último Ano</button>
              <button onClick={() => setTimeRange('long_term')} className="btn">Todos os Tempos</button>
            </div>

            <div>
              {loading ? (
                <p>Carregando dados do usuário...</p>
              ) : (
                topTracks.map((track, index) => (
                  <div key={index} className="track-item">
                    <img src={track.album.images[0].url} alt={track.name} />
                    <div>{track.name}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
