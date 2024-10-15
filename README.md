
# Marker + Marker: GPX File Combiner

Marker + Marker is a web-based tool that allows users to combine multiple GPX files into a single GPX file. Users can upload, drag and reorder GPX files, and then download the combined GPX output. The project is deployed on GitHub Pages.

## Demo

You can try the live demo of the app [here](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME).

## Modules and Libraries Used

- **React**: The app is built using the React JavaScript library for building the user interface.
- **Vite**: Used as the build tool for a fast development environment and production build.
- **react-dnd**: For drag-and-drop functionality to reorder the GPX files.
- **gpx-builder**: A module used to process and combine GPX files.
- **gh-pages**: Used to deploy the app to GitHub Pages.
- **react-icons**: Used for adding the map marker icon in the header.
  
## Features

- Upload multiple GPX files.
- Drag-and-drop to reorder the files.
- Visual progress feedback for file processing.
- Combine GPX files and download the result.

## Installation and Usage

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the development server with:

```bash
npm run dev
```

This will start the app on `http://localhost:5173` or another available port.

### Building for Production

To create a production build:

```bash
npm run build
```

### Deploying to GitHub Pages

The project is already configured to deploy to GitHub Pages. To deploy:

1. Make sure you've added the repository URL to your `package.json` file:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   ```

2. Deploy the app:
   ```bash
   npm run deploy
   ```

## MIT License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
