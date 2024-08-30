import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function authenticateSpotify() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (error) {
    console.error('Error authenticating with Spotify', error);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist') || '';

  if (!artist) {
    return NextResponse.json({ error: 'No artist provided' }, { status: 400 });
  }

  await authenticateSpotify();

  try {
    const searchResult = await spotifyApi.searchArtists(artist);

    if (!searchResult.body || !searchResult.body.artists || searchResult.body.artists.items.length === 0) {
      return NextResponse.json({ error: 'No artist found' }, { status: 404 });
    }

    const artistData = searchResult.body.artists.items[0];

    const artistInfo = {
      id: artistData.id,
      name: artistData.name,
      followers: artistData.followers.total,
      popularity: artistData.popularity,
      genres: artistData.genres,
      spotifyUrl: artistData.external_urls.spotify,
      imageUrl: artistData.images.length > 0 ? artistData.images[0].url : '', // Foto do artista
      monthlyListeners: artistData.followers.total, // Streams mensais estimados
    };

    return NextResponse.json(artistInfo);
  } catch (error) {
    console.error('Error fetching artist data from Spotify', error);
    return NextResponse.error();
  }
}
