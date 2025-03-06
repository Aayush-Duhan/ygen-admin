import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  FormControl,
  OutlinedInput
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      className="auth-container"
      sx={{ 
        backgroundColor: '#FFFFF2',
        position: 'relative',
        overflow: 'hidden',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      <Card 
        className="auth-card" 
        elevation={0}
        sx={{ 
          maxWidth: isMobile ? '95%' : 460,
          borderRadius: 0,
          backgroundColor: '#FFFFFF',
          border: '3px solid #000000',
          boxShadow: '8px 8px 0px 0px #000000',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '10px 10px 0px 0px #000000',
          },
        }}
      >
        <CardContent sx={{ p: isMobile ? 3 : 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                backgroundColor: '#FFD600',
                borderRadius: 0, 
                p: 1.5, 
                mb: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px 0px #000000',
              }}
            >
              <LockOutlined sx={{ color: '#000000', fontSize: 28 }} />
            </Box>
            <Typography 
              component="h1" 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 800, 
                mb: 1, 
                color: '#000000',
                letterSpacing: '-0.5px',
                textTransform: 'uppercase',
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center',
                color: '#555555', 
                fontWeight: 500,
              }}
            >
              Enter your credentials to access the admin dashboard
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 0,
                backgroundColor: '#FF2D6F',
                color: '#FFFFFF',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px 0px #000000',
                fontWeight: 700,
                '& .MuiAlert-icon': {
                  color: '#FFFFFF'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 2.5 }}>
              <Typography 
                variant="body2" 
                component="label" 
                htmlFor="email" 
                sx={{ 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 700,
                  color: '#000000'
                }}
              >
                Email Address
              </Typography>
              <FormControl 
                fullWidth 
                variant="outlined"
                required
                className="neubrutalism-input"
              >
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#000000' }} />
                    </InputAdornment>
                  }
                  sx={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                component="label" 
                htmlFor="password" 
                sx={{ 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 700,
                  color: '#000000'
                }}
              >
                Password
              </Typography>
              <FormControl 
                fullWidth 
                variant="outlined"
                required
                className="neubrutalism-input"
              >
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#000000' }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          border: '1px solid #000',
                          borderRadius: 0,
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </FormControl>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                py: 1.5,
                borderRadius: 0,
                fontSize: '1rem',
                fontWeight: 700,
                backgroundColor: '#0066FF',
                color: 'white',
                border: '2px solid #000000',
                boxShadow: '5px 5px 0px 0px #000000',
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: '#0066FF',
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '7px 7px 0px 0px #000000',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Don't have an account? <a href="/register" style={{ color: '#0066FF', fontWeight: 'bold' }}>Sign up here</a>
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
