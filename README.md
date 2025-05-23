## Overview

This project consists of two parts:

1. **Server**: A Node.js server that reads anime data from a CSV file and streams it to clients
2. **App**: A web frontend that consumes the streaming API and renders content in real-time

## Project Structure

```
nodejs-streams/
├── app/                  # Frontend application
│   ├── index.html        # HTML layout with grid display
│   ├── index.js          # Stream processing and rendering
│   └── package.json      # Frontend dependencies
│
└── server/               # Backend server
    ├── animeflv.csv      # Data source containing anime information
    ├── index.js          # Server implementation with streams
    └── package.json      # Server dependencies
```

## Features

- **Streaming data processing**: Processes data on-the-fly without loading everything into memory
- **NDJSON format**: Uses newline-delimited JSON for efficient streaming
- **Web Streams API**: Leverages modern streaming capabilities in both Node.js and browsers
- **Responsive grid layout**: Displays anime information in a clean, responsive grid

## How It Works

1. The server reads a CSV file containing anime data
2. The CSV is converted to JSON and streamed to clients
3. The web app fetches this stream and processes it in chunks
4. Content is dynamically added to the page as it arrives

## Getting Started

### Server Setup

```bash
cd server
npm install
node index.js
```

The server will run at http://localhost:3000

### App Setup

```bash
cd app
npm install
# Use a tool like live-server or http-server to serve the app
npx live-server
```

## Technical Implementation

- Uses `TransformStream` for data processing pipelines
- Implements NDJSON parsing to handle streaming JSON data
- Demonstrates proper stream backpressure handling
- Shows how to abort fetch requests with `AbortController`

## API

The server exposes a single endpoint at http://localhost:3000 that streams anime data in NDJSON format with the following structure:

```json
{
  "title": "Anime Title",
  "description": "Description of the anime",
  "url_anime": "URL to watch the anime"
}
```

## Browser Compatibility

This project uses modern Web Streams API features and requires a recent browser that supports them.
