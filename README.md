# Node.js Streams and Web Streams API Demo

A comprehensive project demonstrating the power of streaming data processing using Node.js Streams and the Web Streams API to efficiently render large datasets without memory constraints.

## Overview

This project showcases a complete streaming architecture with:

1. **Server**: A Node.js server that reads anime data from a CSV file and streams it to clients in NDJSON format
2. **Web App**: A frontend that efficiently processes the streaming data using Web Streams API and implements virtualization for smooth UI rendering

## Features

- **Server-side Streaming**: Processes CSV data on-the-fly without loading entire files into memory
- **NDJSON Format**: Uses newline-delimited JSON for efficient streaming between server and client
- **Web Streams API**: Demonstrates modern streaming capabilities in both Node.js and browsers
- **Virtual Rendering**: Only renders items visible to the user, preventing UI freezes with large datasets
- **Intersection Observer**: Intelligently loads more content as the user scrolls
- **Backpressure Handling**: Properly manages data flow between producer and consumer
- **Responsive UI**: Displays anime information in a clean, responsive grid layout

## Project Structure

```
nodejs-streams/
├── app/                  # Frontend application
│   ├── index.html        # HTML layout with grid display
│   ├── index.js          # Stream processing and virtual rendering
│   └── package.json      # Frontend dependencies
│
└── server/               # Backend server
    ├── animeflv.csv      # Data source containing anime information
    ├── index.js          # Server implementation with Node.js streams
    └── package.json      # Server dependencies
```

## How It Works

1. **Server**:
   - Reads CSV file line by line using Node.js streams
   - Converts each line to JSON format
   - Sends data as NDJSON to clients
2. **Client**:
   - Fetches streaming data from server
   - Processes stream using TransformStream for NDJSON parsing
   - Buffers items in memory and renders only what's visible
   - Uses IntersectionObserver and scroll events to detect when to load more items
   - Employs virtualization to prevent UI freezing

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

### Server-side Streams

The server uses Node.js streams to efficiently process CSV data:

- `Readable.toWeb()` - Converts Node.js streams to Web Streams API
- `Transform.toWeb(csvtojson())` - Transforms CSV to JSON on-the-fly
- Custom TransformStream for NDJSON formatting

### Client-side Streams

The client implements sophisticated stream processing:

- `TransformStream` - Processes incoming NDJSON data
- Virtual rendering with intersection detection
- Batch processing to prevent UI blocking
- Item buffering for smooth scrolling experience

## API

The server exposes a single endpoint at http://localhost:3000 that streams anime data in NDJSON format with the following structure:

```json
{
  "title": "Anime Title",
  "description": "Description of the anime",
  "url_anime": "URL to watch the anime"
}
```

## Credits

This project was inspired by Erick Wendel's tutorial on Node.js streams:

- [Node.js Streams and the Web Streams API - Erick Wendel](https://www.youtube.com/watch?v=-IpRYbL4yMk&t=22s&ab_channel=ErickWendel)

Thanks to Erick for the excellent educational content on streams implementation in JavaScript!

## Browser Compatibility

This project uses modern Web Streams API features and requires a recent browser that supports:

- Fetch API with streaming
- TransformStream and WritableStream
- IntersectionObserver API
