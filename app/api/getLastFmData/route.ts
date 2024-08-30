import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');

  if (!artist) {
    return NextResponse.json({ error: 'No artist provided' }, { status: 400 });
  }

  try {
    const apiKey = process.env.LASTFM_API_KEY;
    const lastFmResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${apiKey}&format=json`);
    const lastFmData = await lastFmResponse.json();

    if (lastFmData.error) {
      return NextResponse.json({ error: lastFmData.message }, { status: 500 });
    }

    const artistData = {
      name: lastFmData.artist.name,
      listeners: lastFmData.artist.stats.listeners,
      playcount: lastFmData.artist.stats.playcount,
      bio: lastFmData.artist.bio.content,
      tags: lastFmData.artist.tags.tag.map((tag: any) => tag.name),
      imageUrl: lastFmData.artist?.image?.[3]?.['#text'] || '', 
    };

    // Obtendo top tracks
    const topTracksResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&api_key=${apiKey}&format=json&limit=10`);
    const topTracksData = await topTracksResponse.json();
    const topTracks = topTracksData.toptracks.track.map((track: any) => ({
      name: track.name,
      playcount: track.playcount,
      url: track.url,
      albumImageUrl: track.image?.[3]?.['#text'] || '', 
    }));

    // Obtendo top álbuns
    const topAlbumsResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${apiKey}&format=json&limit=10`);
    const topAlbumsData = await topAlbumsResponse.json();
    const topAlbums = topAlbumsData.topalbums.album.map((album: any) => ({
      name: album.name,
      playcount: album.playcount,
      url: album.url,
      imageUrl: album.image?.[3]?.['#text'] || '', 
    }));

    return NextResponse.json({ artistData, topTracks, topAlbums });
  } catch (error) {
    console.error('Error fetching data from Last.fm', error);
    return NextResponse.error();
  }
}
