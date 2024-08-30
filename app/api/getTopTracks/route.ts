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
  const artistId = searchParams.get('artistId');

  if (!artistId) {
    return NextResponse.json({ error: 'No artist ID provided' }, { status: 400 });
  }

  await authenticateSpotify();

  try {
    const topTracksData = await spotifyApi.getArtistTopTracks(artistId, 'US');

    const tracks = topTracksData.body.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      streams: track.popularity, 
      external_urls: track.external_urls, 
      albumImageUrl: track.album.images[0]?.url || '', 
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error fetching top tracks from Spotify', error);
    return NextResponse.error();
  }
}
