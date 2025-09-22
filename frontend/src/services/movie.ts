import api from './api';
import { Movie } from '../types';

export const movieService = {
  // Get all movies
  getMovies: async (params?: {
    genre?: string;
    language?: string;
    rating?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  // Get movie by ID
  getMovie: async (id: string): Promise<{ movie: Movie }> => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  // Get shows for a movie
  getMovieShows: async (
    movieId: string,
    params?: {
      city?: string;
      date?: string;
      theater?: string;
    }
  ) => {
    const response = await api.get(`/movies/${movieId}/shows`, { params });
    return response.data;
  },

  // Get available cities
  getCities: async (): Promise<{ cities: string[] }> => {
    const response = await api.get('/movies/cities/list');
    return response.data;
  },

  // Get available genres
  getGenres: async (): Promise<{ genres: string[] }> => {
    const response = await api.get('/movies/genres/list');
    return response.data;
  },

  // Get available languages
  getLanguages: async (): Promise<{ languages: string[] }> => {
    const response = await api.get('/movies/languages/list');
    return response.data;
  },
};