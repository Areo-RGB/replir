# AthletePro

A web application for tracking and analyzing athlete performance data.

## Features

- Performance analytics and visualization
- Deutscher Motorik Test integration
- Interactive data charts
- Athlete profile management

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Express.js
- Styling: Tailwind CSS
- Charts: Chart.js
- Database: NeonDB (PostgreSQL)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This application is configured for deployment on Heroku:

1. Create a new Heroku app
2. Connect your GitHub repository
3. Enable automatic deploys from main/master branch
4. Add the following environment variables in Heroku:
   - `NODE_ENV`: production
   - Add any other required environment variables (database URLs, API keys, etc.)

## License

MIT
