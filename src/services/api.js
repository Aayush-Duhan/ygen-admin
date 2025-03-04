import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'https://ygen-server.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token if available
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      // Add token to all requests
      config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Event API services
const EventService = {
  // Get all events with optional filters
  getEvents: async (filters = {}) => {
    try {
      const response = await API.get('/events', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get a single event by ID
  getEvent: async (id) => {
    try {
      const response = await API.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await API.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (id, eventData) => {
    try {
      const response = await API.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (id) => {
    try {
      const response = await API.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  },

  // Add or update winners for an event
  addWinners: async (eventId, winners) => {
    try {
      const response = await API.post(`/winners/${eventId}`, winners);
      return response.data;
    } catch (error) {
      console.error('Error adding winners:', error);
      throw error;
    }
  },

  // Get winners for an event
  getWinners: async (eventId) => {
    try {
      const response = await API.get(`/winners/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching winners for event ${eventId}:`, error);
      throw error;
    }
  },

  // Delete winners for an event
  deleteWinners: async (eventId) => {
    try {
      const response = await API.delete(`/winners/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting winners for event ${eventId}:`, error);
      throw error;
    }
  }
};

// Auth API services
const AuthService = {
  // Login user
  login: async (email, password) => {
    try {
      // For demo purposes, we'll simulate a login
      // In a real app, this would be an API call
      if (email === 'admin@ygen.com' && password === 'admin123') {
        const user = { email, name: 'Admin User' };
        localStorage.setItem('adminUser', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('adminUser');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
};

export { EventService, AuthService };
