import apiClient from './client';

export const searchMusic = async (query: string) => {
  try {
    const response = await apiClient.get('/music/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching from backend search:', error);
    return [];
  }
};

export const getTrendingMusic = async () => {
  try {
    const response = await apiClient.get('/music/trending');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending music from backend:', error);
    return [];
  }
};
