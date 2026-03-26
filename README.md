# Playlist Pace Tracker

A lightweight, local-first web app for tracking progress through a YouTube playlist against a deadline. Set your total videos and a due date, then mark videos as completed to see whether you are on track.

## Features

- **Pace-aware insights**: compares required daily pace to your current pace.
- **Progress at a glance**: progress bar, completion percent, and remaining videos.
- **Local storage**: saves progress in your browser (no account, no server).
- **Simple controls**: increment, undo, or reset your progress.
- **Responsive UI**: works well on desktop and mobile screens.

## Getting Started

No installation is required.

1. Open `index.html` in any modern browser.
2. Enter the total number of videos and your deadline.
3. Use **+1 Completed** as you watch videos to update your pace.

## How the Pace Is Calculated

- **Daily target** = remaining videos ÷ days left
- **Current pace** = completed videos ÷ days since you started
- You are **On Track** when current pace ≥ daily target (or when all videos are complete).

## Local Development

You can open the file directly, or use a simple local server to avoid any browser file restrictions:

```bash
python -m http.server
```

Then visit `http://localhost:8000` and open `index.html`.

## Project Structure

```
.
├── index.html   # App layout and structure
├── style.css    # Styling and layout
└── script.js    # State, calculations, and UI updates
```

## Tests

There are no automated tests for this project.
