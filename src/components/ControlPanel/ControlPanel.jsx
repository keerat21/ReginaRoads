import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import "./ControlPanel.scss";
import { blocked, curves, potholes, redTriangle } from "../MarkerStyles/MarkerStyles.jsx";

function ControlPanel() {
  const positionOptions = [
    { key: "slippery road", value: 0 },
    { key: "block", value: 1 },
    { key: "potholes", value: 2 },
    { key: "low visibility", value: 3 },
  ];

  // Define icons here, where google is available


  const [selectedPosition, setSelectedPosition] = useState(positionOptions[0].value);
  const [drawingManager, setDrawingManager] = useState(null);
  const [drawnShapes, setDrawnShapes] = useState([]); // Store drawn objects

  const map = useMap();
  const drawing = useMapsLibrary("drawing");


  const iconMapping = {
    0: {
      url: "src/assets/carslip.png",
      scaledSize: new google.maps.Size(32, 32)
    },
    1: {
      url: "src/assets/blocked.png",
      scaledSize: new google.maps.Size(20, 32),
    },
    2: {
      url: "src/assets/pothole.png",
      scaledSize: new google.maps.Size(32, 32),
    },
    3: {
      url: "src/assets/low_visibility.png",
      scaledSize: new google.maps.Size(32, 32),
    },
  };

  useEffect(() => {
    if (!map || !drawing) return;

    const newDrawingManager = new drawing.DrawingManager({
      map,
      drawingMode: google.maps.drawing.OverlayType.null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.MARKER, google.maps.drawing.OverlayType.POLYLINE],
      },
      markerOptions: {
        draggable: true,
        icon: iconMapping[selectedPosition],
      },
      polylineOptions: { editable: true, draggable: true },
    });

    setDrawingManager(newDrawingManager);

    const handleOverlayComplete = (event) => {
      const overlay = event.overlay;
      const newShape = {
        type: event.type,
        overlay,
        position: overlay.getPosition ? overlay.getPosition().toJSON() : null,
        path: overlay.getPath ? overlay.getPath().getArray().map((p) => p.toJSON()) : null,
        icon: iconMapping[selectedPosition],
      };
      setDrawnShapes((prev) => [...prev, newShape]);
    };

    google.maps.event.addListener(newDrawingManager, "overlaycomplete", handleOverlayComplete);

    return () => {
      google.maps.event.clearInstanceListeners(newDrawingManager);
      newDrawingManager.setMap(null);
    };
  }, [drawing, map, selectedPosition]);

  const handleUndoLast = () => {
    if (drawnShapes.length === 0) return;
    const lastShape = drawnShapes.pop();
    lastShape.overlay.setMap(null); // Remove from map
    setDrawnShapes([...drawnShapes]); // Update state
  };

  return (
    <div className="control-panel">
      <h3>Map Control Panel</h3>
      <label>Control Position</label>
      <select value={selectedPosition} onChange={(ev) => setSelectedPosition(Number(ev.target.value))}>
        {positionOptions.map(({ key, value }) => (
          <option key={key} value={value}>
            {key}
          </option>
        ))}
      </select>
      <button onClick={handleUndoLast} disabled={drawnShapes.length === 0}>
        Undo Last
      </button>
    </div>
  );
}

export default ControlPanel;
