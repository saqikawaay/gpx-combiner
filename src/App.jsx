import React, { useState } from 'react';
import { buildGPX, GarminBuilder } from 'gpx-builder';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Add Map Marker Icon

const { Point, Track, Segment } = GarminBuilder.MODELS;

// Drag-and-drop item types
const ItemType = 'GPX_FILE';

// Draggable item component
function DraggableItem({ file, index, moveItem, processingFiles }) {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const isProcessing = processingFiles[index];
  
  return (
    <li
      ref={(node) => ref(drop(node))}
      className={isDragging ? 'dragging' : ''} /* Add dragging class dynamically */
      style={{
        margin: '10px 0',
        padding: '10px',
        backgroundColor: processingFiles[index] ? 'green' : '#333',
        transition: 'background-color 0.5s ease',
      }}
    >
      <span>{file.name}</span>
    </li>
  );
}

function App() {
  const [gpxFiles, setGpxFiles] = useState([]);
  const [combinedGpx, setCombinedGpx] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processingFiles, setProcessingFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setGpxFiles(files.map((file, index) => ({
      file,
      id: `file-${index}`,
    })));
    setProcessingFiles(Array(files.length).fill(false)); // Initialize processing state
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedFiles = [...gpxFiles];
    const [movedItem] = updatedFiles.splice(fromIndex, 1);
    updatedFiles.splice(toIndex, 0, movedItem);
    setGpxFiles(updatedFiles);
  };

  const combineGpxFiles = async () => {
    if (gpxFiles.length < 2) {
      alert('Please select at least two GPX files.');
      return;
    }

    setIsProcessing(true); // Disable button
    const combinedGpxData = new GarminBuilder();
    const tracks = [];

    for (let index = 0; index < gpxFiles.length; index++) {
      const { file } = gpxFiles[index];

      await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const gpxData = event.target.result;
          try {
            const parser = new DOMParser();
            const gpxDoc = parser.parseFromString(gpxData, 'application/xml');

            const trkpts = gpxDoc.getElementsByTagName('trkpt');
            const points = [];

            for (let i = 0; i < trkpts.length; i++) {
              const lat = trkpts[i].getAttribute('lat');
              const lon = trkpts[i].getAttribute('lon');
              const ele = trkpts[i].getElementsByTagName('ele')[0]?.textContent;

              points.push(new Point(
                parseFloat(lat),
                parseFloat(lon),
                {
                  ele: ele ? parseFloat(ele) : null
                }
              ));
            }

            const segment = new Segment(points);
            const track = new Track([segment]);
            tracks.push(track);

            // Update processing state for each file
            setProcessingFiles((prev) => {
              const updated = [...prev];
              updated[index] = true; // File is processed
              return updated;
            });

            const percentage = Math.round(((index + 1) / gpxFiles.length) * 100);
            setProgress(percentage);

            resolve();
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => reject(`Error reading file: ${file.name}`);
        reader.readAsText(file);
      });
    }

    combinedGpxData.setTracks(tracks);
    const gpxXml = buildGPX(combinedGpxData.toObject());
    setCombinedGpx(gpxXml);
    setIsProcessing(false); // Enable button again after processing
  };

  const downloadCombinedGpx = () => {
    if (!combinedGpx) return;

    const blob = new Blob([combinedGpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'combined.gpx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column',
      }}>
        <h1>
          <FaMapMarkerAlt /> + <FaMapMarkerAlt />
        </h1>
        <p> Select your files, then re-order them into the right order. Once you are ready, click "combine" and bob's your uncle! </p>

        <input type="file" accept=".gpx" multiple onChange={handleFileChange} />

        {gpxFiles.length > 0 && (
          <>
            <p>Drag and drop the files to arrange them in the correct order.</p>
            <ul style={{ padding: 0, listStyleType: 'none', maxWidth: '500px' }}>
              {gpxFiles.map(({ file }, index) => (
                <DraggableItem
                  key={file.name}
                  index={index}
                  file={file}
                  moveItem={moveItem}
                  processingFiles={processingFiles}
                />
              ))}
            </ul>
          </>
        )}

        <button
          onClick={combineGpxFiles}
          disabled={isProcessing}
          style={{ marginTop: '20px', marginBottom: '10px', padding: '10px 20px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
        >
          Combine GPX Files
        </button>

        {progress > 0 && progress < 100 && <p>Processing: {progress}%</p>}

        {combinedGpx && (
          <>
            <button
              onClick={downloadCombinedGpx}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              Download Combined GPX
            </button>
          </>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
