import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:5001/api',  // ✅ Change this to your local backend
  headers: { 'Content-Type': 'application/json' }
});



// Add a request interceptor to include auth token if available
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Event API services
const EventService = {
  // Get all events with optional filters
  getEvents: async (filters = {}) => {
    try {
      const response = await API.get('/events', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get a single event by ID
  getEvent: async (id) => {
    try {
      const response = await API.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await API.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (id, eventData) => {
    try {
      const response = await API.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (id) => {
    try {
      const response = await API.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Add or update winners for an event
  addWinners: async (eventId, winners) => {
    try {
      const response = await API.post(`/winners/${eventId}`, winners);
      return response.data;
    } catch (error) {
      console.error('Error adding winners:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get winners for an event
  getWinners: async (eventId) => {
    try {
      const response = await API.get(`/winners/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching winners for event ${eventId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete winners for an event
  deleteWinners: async (eventId) => {
    try {
      const response = await API.delete(`/winners/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting winners for event ${eventId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

// Auth API services
const AuthService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const data = response.data;
      localStorage.setItem('adminUser', JSON.stringify(data));
      return data.user;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register user
  register: async (email, password) => {
    return await API.post('/auth/register', { email, password });
  },


  // Logout user
  logout: () => {
    localStorage.removeItem('adminUser');
  },

  // Get current user
  getCurrentUser: async () => {
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (!user) return null;
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export { EventService, AuthService };
