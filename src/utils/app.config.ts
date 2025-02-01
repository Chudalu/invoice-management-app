export const AppConfig = () => ({
    CLIENT_ENCRYPTION_KEY: process.env.CLIENT_ENCRYPTION_KEY || 'CLIENT_ENCRYPTION_KEY',
    API_URL: process.env.API_URL || 'http://localhost:3500',
});