import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/api/spotify/callback',
});

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let timeRange = searchParams.get('timeRange') as TimeRange;

  if (!['short_term', 'medium_term', 'long_term'].includes(timeRange)) {
    timeRange = 'medium_term'; 
  }

  const token = searchParams.get('token');
  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  spotifyApi.setAccessToken(token);

  try {
    const topTracksData = await spotifyApi.getMyTopTracks({
      time_range: timeRange,
      limit: 10,
    });

    return NextResponse.json(topTracksData.body);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return NextResponse.error();
  }
}
