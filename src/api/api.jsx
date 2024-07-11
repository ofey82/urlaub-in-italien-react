import axios from 'axios';

const API_URL = 'http://localhost:8080/api';



// TRIPS
export const createTrip = async (tripData) => {
  const response = await axios.post(`${API_URL}/trip`, tripData);
  return response.data;
};

export const updateTrip = async (tripId, trip) => {
  const response = await axios.put(`${API_URL}/trip/${tripId}`, JSON.stringify(trip), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getTrips = async () => {
  const response = await axios.get(`${API_URL}/trip`);
  return response.data;
};

export const getTripDetails = async (tripId) => {
  const response = await axios.get(`${API_URL}/trip/${tripId}`);
  return response.data;
};

// PHOTOS
export const uploadPhotos = async (tripId, photos) => {
  const formData = new FormData();
  photos.forEach(photo => formData.append('photo', photo));

  for (let pair of formData.entries()) {
    console.log('CHECK', pair[0] + ', ' + pair[1]);
  }

  try {
    const response = await axios.post(`${API_URL}/photo/${tripId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with status code:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

// STORY
export const createStory = async (tripId, photos, title, text) => {
  const response = await axios.post(`${API_URL}/story/${tripId}`, {
    photos,
    title,
    text
  });
  console.log("Response",response.data);
  return response.data;
};

export const updateStory = async (storyId, title, text) => {
  const response = await axios.put(`${API_URL}/story/${storyId}`, {
    title,
    text
  });
  return response.data;
};

export const getStoryDetails = async (storyId) => {
  const response = await axios.get(`${API_URL}/story/${storyId}`);
  return response.data;
};


