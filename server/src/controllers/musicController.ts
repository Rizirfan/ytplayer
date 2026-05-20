import { Request, Response } from 'express';
import ytSearch from 'yt-search';

// Helper to filter out irrelevant videos (like 10 hour loops, shorts, podcasts)
const isRelevantTrack = (v: any, query: string = '') => {
  if (!v?.videoId || !v?.seconds) return false;
  
  const q = query.toLowerCase();
  const t = v.title.toLowerCase();
  
  // If the user explicitly asks for a mix, hour, or podcast, allow it
  if (q.includes('mix') || q.includes('hour') || q.includes('podcast') || q.includes('live')) {
    return true; 
  }

  // Otherwise, strictly filter lengths:
  // Must be > 45 seconds (ignore shorts/memes)
  // Must be < 12 minutes (ignore compilations, albums, 1 hour loops)
  if (v.seconds < 60 || v.seconds > 720) return false;

  // Additional sanity checks for common unwanted formats if not asked for
  if (t.includes('10 hours') || t.includes('10 hrs') || t.includes('1 hour') || t.includes('podcast')) {
    return false;
  }

  return true;
};

export const searchMusic = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query is required' });
  }

  console.log(`[Search] Query: "${q}" via yt-search`);

  try {

    const queries = [
      `${q} official music`,
      q as string
    ];

    const seen = new Set<string>();
    const collected: any[] = [];

    // Run searches in parallel
    const searchResults = await Promise.all(
      queries.map(pattern => ytSearch(pattern))
    );

    for (const r of searchResults) {
      const videos = r.videos || [];
      for (const v of videos) {
        if (!v?.videoId) continue;
        if (!isRelevantTrack(v, q as string)) continue;
        
        seen.add(v.videoId);
        collected.push({
          id: v.videoId,
          title: v.title,
          artist: v.author.name || 'Unknown Artist',
          thumbnail: v.thumbnail,
          duration: v.timestamp,
        });

        if (collected.length >= 25) break;
      }
    }

    res.json(collected.slice(0, 50));
  } catch (error: any) {
    console.error('yt-search Error:', error);
    res.status(500).json({ message: 'Error performing search', details: error.message });
  }
};

export const getTrending = async (req: Request, res: Response) => {
  try {
    console.log('[Trending] Fetching trending via yt-search');
    // yt-search doesn't have a direct "trending" so we just search for generic terms or hits
    const queries = ['top hits 2024', 'global top songs', 'trending music', 'new popular songs'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const r = await ytSearch(randomQuery);
    let videos = r.videos || [];
    
    // Filter out long mixes and shorts for trending
    videos = videos.filter(v => isRelevantTrack(v, randomQuery));

    const items = videos.slice(0, 30).map(video => ({
      id: video.videoId,
      title: video.title,
      artist: video.author.name || 'Unknown Artist',
      thumbnail: video.thumbnail,
      duration: video.timestamp
    }));

    res.json(items);
  } catch (error: any) {
    console.error('yt-search Trending Error:', error);
    res.status(500).json({ message: 'Error fetching trending tracks' });
  }
};
