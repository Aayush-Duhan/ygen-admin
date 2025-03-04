import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventService } from '../services/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format, parse } from 'date-fns';

// Custom TimePickerField component
const TimePickerField = ({ label, value, onChange, required, helperText }) => {
  // Parse the current value
  const parseTimeValue = (timeStr) => {
    if (!timeStr) return { hour: '12', minute: '00', period: 'AM' };
    try {
      const [time, period] = timeStr.split(' ');
      const [hour, minute] = time.split(':');
      return {
        hour: hour.padStart(2, '0'),
        minute: minute.padStart(2, '0'),
        period: period || 'AM'
      };
    } catch (err) {
      return { hour: '12', minute: '00', period: 'AM' };
    }
  };

  const { hour, minute, period } = parseTimeValue(value);

  const handleTimeChange = (type, newValue) => {
    const timeValue = parseTimeValue(value);
    const updatedTime = {
      ...timeValue,
      [type]: newValue
    };
    
    const formattedTime = `${updatedTime.hour}:${updatedTime.minute} ${updatedTime.period}`;
    onChange(formattedTime);
  };

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  // Generate minutes (00-55, step 5)
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  const selectStyles = {
    borderRadius: 0,
    border: '2px solid #000',
    backgroundColor: 'white',
    '& .MuiSelect-select': {
      backgroundColor: 'white'
    },
    '&:hover': {
      borderColor: '#000'
    },
    '&.Mui-focused': {
      borderColor: '#000',
      backgroundColor: 'white'
    }
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel sx={{ 
        backgroundColor: 'white', 
        px: 1,
        '&.Mui-focused': {
          color: '#000'
        }
      }}>{label}</InputLabel>
      <Stack direction="row" spacing={1}>
        <Select
          value={hour}
          onChange={(e) => handleTimeChange('hour', e.target.value)}
          size="small"
          required={required}
          sx={{ 
            flex: 1,
            ...selectStyles
          }}
        >
          {hours.map((h) => (
            <MenuItem key={h} value={h}>{h}</MenuItem>
          ))}
        </Select>
        <Select
          value={minute}
          onChange={(e) => handleTimeChange('minute', e.target.value)}
          size="small"
          required={required}
          sx={{ 
            flex: 1,
            ...selectStyles
          }}
        >
          {minutes.map((m) => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </Select>
        <Select
          value={period}
          onChange={(e) => handleTimeChange('period', e.target.value)}
          size="small"
          required={required}
          sx={{ 
            width: 80,
            ...selectStyles
          }}
        >
          <MenuItem value="AM">AM</MenuItem>
          <MenuItem value="PM">PM</MenuItem>
        </Select>
      </Stack>
      {helperText && (
        <Typography 
          variant="caption" 
          color="textSecondary" 
          sx={{ 
            mt: 1,
            display: 'block',
            ml: '14px'
          }}
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'offline',
    description: '',
    image: '',
    category: 'event'
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Convert 24hr time to 12hr format
  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    try {
      const [hours, minutes] = time24.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return format(date, 'hh:mm a');
    } catch (err) {
      return time24;
    }
  };

  // Convert 12hr time to 24hr format
  const convertTo24Hour = (time12) => {
    if (!time12) return '';
    try {
      const parsedTime = parse(time12, 'hh:mm a', new Date());
      return format(parsedTime, 'HH:mm');
    } catch (err) {
      return time12;
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const response = await EventService.getEvent(id);
          
          // Parse date range if exists
          let startDate = response.date;
          let endDate = '';
          let startTime = response.time;
          let endTime = '';
          
          if (response.date.includes('-')) {
            const [start, end] = response.date.split('-').map(d => d.trim());
            startDate = new Date(start).toISOString().split('T')[0];
            endDate = new Date(end).toISOString().split('T')[0];
          } else {
            startDate = new Date(response.date).toISOString().split('T')[0];
          }

          if (response.time.includes('-')) {
            const [start, end] = response.time.split('-').map(t => t.trim());
            startTime = convertTo12Hour(start);
            endTime = convertTo12Hour(end);
          } else {
            startTime = convertTo12Hour(response.time);
          }
          
          setFormData({
            ...response,
            startDate,
            endDate,
            startTime,
            endTime
          });
          setError('');
        } catch (err) {
          console.error('Error fetching event:', err);
          setError('Failed to load event data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // If start date is after end date, update end date
      if (name === 'startDate' && newData.endDate && value > newData.endDate) {
        newData.endDate = value;
      }
      // If end date is before start date, update start date
      if (name === 'endDate' && newData.startDate && value < newData.startDate) {
        newData.startDate = value;
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.name || !formData.startDate || !formData.startTime || !formData.location || 
        !formData.description || !formData.image) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // Convert times back to 24hr format for API
      const startTime24 = convertTo24Hour(formData.startTime);
      const endTime24 = formData.endTime ? convertTo24Hour(formData.endTime) : '';
      
      // Format date range and time for API
      const formattedData = {
        ...formData,
        date: formData.endDate && formData.startDate !== formData.endDate 
          ? `${formData.startDate} - ${formData.endDate}`
          : formData.startDate,
        time: endTime24 
          ? `${startTime24} - ${endTime24}`
          : startTime24
      };
      
      if (isEditMode) {
        await EventService.updateEvent(id, formattedData);
        setSuccess('Event updated successfully!');
      } else {
        await EventService.createEvent(formattedData);
        setSuccess('Event created successfully!');
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          location: '',
          type: 'offline',
          description: '',
          image: '',
          category: 'event'
        });
      }
      
      setTimeout(() => {
        navigate('/events');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: format(date, 'MMM d, yyyy')
    }));
  };

  const handleTimeChange = (event) => {
    setFormData({ ...formData, time: event.target.value });
  };

  return (
    <Box className="dashboard-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" className="page-title">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="event">Event</MenuItem>
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="hackathon">Hackathon</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Type"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="End Date"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="Optional for multi-day events"
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TimePickerField
                      label="Start Time"
                      value={formData.startTime}
                      onChange={handleTimeChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TimePickerField
                      label="End Time"
                      value={formData.endTime}
                      onChange={handleTimeChange}
                      helperText="Optional for events with specific end time"
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="e.g., Tech Lab, Building B or Online (Zoom)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                  helperText="Enter a URL for the event image"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
              
              {formData.image && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Image Preview:</Typography>
                  <Box 
                    component="img" 
                    src={formData.image} 
                    alt="Event preview" 
                    sx={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                    }}
                  />
                </Grid>
              )}
            </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/events')}
                sx={{ mr: 2 }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
}

export default EventForm;