import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EventService } from '../services/api';
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import '../styles/EventList.css';
import { format } from 'date-fns';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [winnersModalOpen, setWinnersModalOpen] = useState(false);
  const [winners, setWinners] = useState({ first: '', second: '', third: '' });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterCategory !== 'all') filters.category = filterCategory;
      if (filterType !== 'all') filters.type = filterType;
      
      // Fetch both upcoming and completed events
      const [upcomingData, completedData] = await Promise.all([
        EventService.getEvents({ ...filters, status: 'upcoming' }),
        EventService.getEvents({ ...filters, status: 'completed' })
      ]);
      
      setEvents(upcomingData.concat(completedData));
      setError('');
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterType]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    
    try {
      await EventService.deleteEvent(selectedEvent._id || selectedEvent.id);
      setEvents(events.filter(e => (e._id || e.id) !== (selectedEvent._id || selectedEvent.id)));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again later.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const getFilteredEvents = (events) => {
    return events.filter(event => {
      if (filterCategory !== 'all' && event.category !== filterCategory) {
        return false;
      }
      
      if (filterType !== 'all' && event.type !== filterType) {
        return false;
      }
      
      if (searchTerm && !event.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const resetFilters = () => {
    setFilterCategory('all');
    setFilterType('all');
    setSearchTerm('');
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'No date specified';
    
    // Check if it's a date range (contains a hyphen)
    if (dateString.includes('-')) {
      const [startDate, endDate] = dateString.split('-').map(d => d.trim());
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedStart = new Date(startDate).toLocaleDateString(undefined, options);
      const formattedEnd = new Date(endDate).toLocaleDateString(undefined, options);
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    // Single date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time to be more readable
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Check if it's a time range (contains a hyphen)
    if (timeString.includes('-')) {
      const [startTime, endTime] = timeString.split('-').map(t => t.trim());
      // Convert 24h times to 12h format
      const formattedStart = format(new Date(`2000/01/01 ${startTime}`), 'hh:mm a');
      const formattedEnd = format(new Date(`2000/01/01 ${endTime}`), 'hh:mm a');
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    // Single time
    return format(new Date(`2000/01/01 ${timeString}`), 'hh:mm a');
  };

  const openWinnersModal = async (event) => {
    setSelectedEvent(event);
    try {
      // Try to fetch existing winners
      const winnersData = await EventService.getWinners(event._id || event.id);
      setWinners(winnersData || { first: '', second: '', third: '' });
    } catch (err) {
      // If no winners exist yet, set empty values
      setWinners({ first: '', second: '', third: '' });
    }
    setWinnersModalOpen(true);
  };

  const handleWinnersSubmit = async () => {
    try {
      if (!winners.first || !winners.second || !winners.third) {
        setError('Please fill in all winner positions');
        return;
      }

      // Add or update winners using the new API
      const updatedWinners = await EventService.addWinners(selectedEvent._id || selectedEvent.id, winners);
      
      // Update the events state with the new winners
      setEvents(events.map(event => 
        (event._id || event.id) === (selectedEvent._id || selectedEvent.id)
          ? { ...event, winners: updatedWinners }
          : event
      ));
      
      setWinnersModalOpen(false);
      setSelectedEvent(null);
      setWinners({ first: '', second: '', third: '' });
      setError(''); // Clear any existing errors
    } catch (err) {
      console.error('Error updating winners:', err);
      setError('Failed to update winners. Please try again later.');
    }
  };

  const closeWinnersModal = () => {
    setWinnersModalOpen(false);
    setSelectedEvent(null);
    setWinners({ first: '', second: '', third: '' });
  };

  const isEventCompleted = (event) => {
    if (!event.date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    // If it's a date range
    if (event.date.includes('-')) {
      const [, endDate] = event.date.split('-').map(d => d.trim());
      const eventEndDate = new Date(endDate);
      eventEndDate.setHours(0, 0, 0, 0);
      return eventEndDate < today;
    }
    
    // Single date
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  const renderEventCards = (events, isCompleted = false) => {
    return getFilteredEvents(events).map((event) => (
      <Grid item xs={12} sm={6} lg={4} key={event.id}>
        <div className="event-card">
          <div className={`event-card__type event-card__type--${event.type}`}>
            {event.type}
          </div>
          <div className={`event-card__category event-card__category--${event.category}`}>
            {event.category}
          </div>
          <div className="event-card__content">
            <Typography className="event-card__title">
              {event.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {event.description}
            </Typography>
            <div className="event-card__details">
              <div className="event-card__detail">
                <div className="event-card__detail-icon">
                  <CalendarIcon fontSize="small" />
                </div>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {formatDate(event.date)}
                </Typography>
              </div>
              <div className="event-card__detail">
                <div className="event-card__detail-icon">
                  <AccessTimeIcon fontSize="small" />
                </div>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {formatTime(event.time)}
                </Typography>
              </div>
              <div className="event-card__detail">
                <div className="event-card__detail-icon">
                  <LocationIcon fontSize="small" />
                </div>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {event.location}
                </Typography>
              </div>
              <div className="event-card__detail">
                <div className="event-card__detail-icon">
                  <PeopleIcon fontSize="small" />
                </div>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {event.capacity} people
                </Typography>
              </div>
            </div>
            {isCompleted && (event.category === 'hackathon' || event.category === 'event') && (
              <Button
                onClick={() => openWinnersModal(event)}
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: 0,
                  border: '2px solid #000',
                  fontWeight: 700,
                  backgroundColor: event.winners ? '#E8F5E9' : 'white',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#FFD600',
                    transform: 'translate(-2px, -2px)',
                    boxShadow: '6px 6px 0 0 #000',
                  }
                }}
                startIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>}
              >
                {event.winners ? 'Edit Winners' : 'Add Winners'}
              </Button>
            )}
          </div>
          <div className="event-card__actions">
            <IconButton 
              component={Link} 
              to={`/events/edit/${event._id || event.id}`}
              sx={{
                backgroundColor: '#f8f8f8',
                border: '2px solid #000',
                borderRadius: 0,
                padding: '6px',
                '&:hover': {
                  backgroundColor: '#0066FF',
                  color: 'white'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={() => handleDeleteClick(event)}
              sx={{
                backgroundColor: '#f8f8f8',
                border: '2px solid #000',
                borderRadius: 0,
                padding: '6px',
                '&:hover': {
                  backgroundColor: '#FF2D6F',
                  color: 'white'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </Grid>
    ));
  };

  return (
    <Box className="events-container">
      <Box className="events-header">
        <Typography variant="h4" component="h1" className="events-title">
          Events Gallery
        </Typography>
        <Button
          className="add-event-button"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/events/new"
        >
          Create Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Creative Filters */}
      <Box className="filters-container">
        <Grid container spacing={2} className="filter-row">
          <Grid item xs={12} md={6}>
            <TextField
              className="filter-input"
              label="Search events"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: 0,
                  border: '2px solid #000',
                  backgroundColor: 'white'
                }
              }}
              InputLabelProps={{
                sx: {
                  backgroundColor: 'white',
                  px: 1
                }
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ backgroundColor: 'white', px: 1 }}>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
                sx={{
                  borderRadius: 0,
                  border: '2px solid #000',
                  backgroundColor: 'white',
                  '& .MuiSelect-select': {
                    backgroundColor: 'white'
                  }
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="event">Events</MenuItem>
                <MenuItem value="workshop">Workshops</MenuItem>
                <MenuItem value="hackathon">Hackathons</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ backgroundColor: 'white', px: 1 }}>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  borderRadius: 0,
                  border: '2px solid #000',
                  backgroundColor: 'white',
                  '& .MuiSelect-select': {
                    backgroundColor: 'white'
                  }
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              startIcon={<FilterIcon />}
              onClick={resetFilters}
              fullWidth
              sx={{
                borderRadius: 0,
                border: '2px solid #000',
                fontWeight: 700,
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: '#FFD600',
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '6px 6px 0 0 #000',
                }
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Upcoming Events Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon /> Upcoming Events
            </Typography>
            {getFilteredEvents(events.filter(event => !isEventCompleted(event))).length > 0 ? (
              <Grid container spacing={2}>
                {renderEventCards(events.filter(event => !isEventCompleted(event)))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming events found
                </Typography>
              </Box>
            )}
          </Box>

          {/* Completed Events Section */}
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon /> Completed Events
            </Typography>
            {getFilteredEvents(events.filter(event => isEventCompleted(event))).length > 0 ? (
              <Grid container spacing={2}>
                {renderEventCards(events.filter(event => isEventCompleted(event)), true)}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  No completed events found
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: '3px solid #000',
            boxShadow: '8px 8px 0 0 #000',
            width: { xs: '95%', sm: 'auto' },
            margin: { xs: '0 auto', sm: '32px' }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '2px solid #000' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete "{selectedEvent?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, borderTop: '2px dashed #000', flexWrap: 'wrap', gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              borderRadius: 0,
              border: '2px solid #000',
              fontWeight: 700,
              boxShadow: '3px 3px 0 0 #000',
              '&:hover': {
                boxShadow: '5px 5px 0 0 #000',
                transform: 'translate(-2px, -2px)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            sx={{
              borderRadius: 0,
              border: '2px solid #000',
              fontWeight: 700,
              boxShadow: '3px 3px 0 0 #000',
              '&:hover': {
                boxShadow: '5px 5px 0 0 #000',
                transform: 'translate(-2px, -2px)'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Winners Modal */}
      <Dialog
        open={winnersModalOpen}
        onClose={closeWinnersModal}
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: '3px solid #000',
            boxShadow: '8px 8px 0 0 #000',
            width: { xs: '95%', sm: 'auto' },
            margin: { xs: '0 auto', sm: '32px' }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '2px solid #000' }}>
          {selectedEvent?.winners ? 'Edit Winners' : 'Add Winners'} - {selectedEvent?.name}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: { sm: '400px' } }}>
            <TextField
              label="First Place"
              value={winners.first}
              onChange={(e) => setWinners({ ...winners, first: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
            />
            <TextField
              label="Second Place"
              value={winners.second}
              onChange={(e) => setWinners({ ...winners, second: e.target.value })}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Third Place"
              value={winners.third}
              onChange={(e) => setWinners({ ...winners, third: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, borderTop: '2px dashed #000', flexWrap: 'wrap', gap: 1 }}>
          <Button 
            onClick={closeWinnersModal}
            sx={{
              borderRadius: 0,
              border: '2px solid #000',
              fontWeight: 700,
              boxShadow: '3px 3px 0 0 #000',
              '&:hover': {
                boxShadow: '5px 5px 0 0 #000',
                transform: 'translate(-2px, -2px)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWinnersSubmit}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 0,
              border: '2px solid #000',
              fontWeight: 700,
              boxShadow: '3px 3px 0 0 #000',
              '&:hover': {
                boxShadow: '5px 5px 0 0 #000',
                transform: 'translate(-2px, -2px)'
              }
            }}
          >
            Save Winners
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventList;