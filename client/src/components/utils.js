// utils.js
function generateUniqueBookingId() {
  const prefix = 'AMS';
  // Logic to generate a unique booking ID
  // This can be based on timestamps, random strings, or a combination of both

  // generating a random string as the booking ID
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let remainingId = '';
  for (let i = 0; i < 7; i++) { // We use 7 characters here to make up the remaining part of the ID
    remainingId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  // Concatenate the prefix 'AMS' with the remaining random characters
  const bookingId = prefix + remainingId;
  return bookingId;
}

module.exports = {
  generateUniqueBookingId
};
