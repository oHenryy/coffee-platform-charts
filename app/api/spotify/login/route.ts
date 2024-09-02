import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const scopes = 'user-top-read';
  const redirectUri = 'http://localhost:3000/api/spotify/callback';
  const spotifyAuthorizeUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(spotifyAuthorizeUrl);
}
