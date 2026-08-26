import authService from './authService.js';

export const profileService = {
  getProfile: authService.getProfile,
  updateProfile: authService.updateProfile,
  updatePassword: authService.updatePassword,
};

export default profileService;
