// utils.js
function generateUniqueBookingId() {
    // Logic to generate a unique booking ID
    // This can be based on timestamps, random strings, or a combination of both
    
    // For example, generating a random string as the booking ID
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let bookingId = '';
    for (let i = 0; i < 10; i++) {
      bookingId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return bookingId;
  }
  
  module.exports = {
    generateUniqueBookingId
  };
  