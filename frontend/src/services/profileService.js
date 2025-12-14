import api from './api';

const profileService = {
  async getMyProfile() {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
      throw error;
    }
  },

  async getUserProfile(userId) {
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Eroare la încărcarea profilului:', error);
      throw error;
    }
  }
};

export default profileService;
