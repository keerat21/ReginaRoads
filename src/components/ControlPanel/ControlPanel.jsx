import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import "./ControlPanel.scss";
import { db } from "../Firebase/Firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";

function ControlPanel() {
  const positionOptions = [
    { key: "slippery road", value: 0 },
    { key: "block", value: 1 },
    { key: "potholes", value: 2 },
    { key: "low visibility", value: 3 },
  ];

  const [selectedPosition, setSelectedPosition] = useState(positionOptions[0].value);
  const [drawingManager, setDrawingManager] = useState(null);
  const [drawnShapes, setDrawnShapes] = useState([]);

  const map = useMap();
  const drawing = useMapsLibrary("drawing");

  const iconMapping = drawing
    ? {
      0: { url: "/assets/carslip.png", scaledSize: new google.maps.Size(32, 32) },
      1: { url: "/assets/blocked.png", scaledSize: new google.maps.Size(20, 32) },
      2: { url: "/assets/pothole.png", scaledSize: new google.maps.Size(32, 32) },
      3: { url: "/assets/low_visibility.png", scaledSize: new google.maps.Size(32, 32) },
    }
    : {};

  useEffect(() => {
    if (!map || !drawing) return;

    const unsubscribe = onSnapshot(collection(db, "markers"), (snapshot) => {
      const shapes = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          position: data.position ? new google.maps.LatLng(data.position.lat, data.position.lng) : null,
          path: data.path ? data.path.map((p) => new google.maps.LatLng(p.lat, p.lng)) : null,
          icon: iconMapping[data.icon],
          overlay: null,
        };
      });
      setDrawnShapes(shapes);

      shapes.forEach((shape) => {
        if (shape.type === "marker" && shape.position) {
          shape.overlay = new google.maps.Marker({
            position: shape.position,
            map,
            draggable: true,
            icon: shape.icon,
          });
        } else if (shape.type === "polyline" && shape.path) {
          shape.overlay = new google.maps.Polyline({
            path: shape.path,
            map,
            editable: true,
            draggable: true,
          });
        }
      });
    });

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

    const handleOverlayComplete = async (event) => {
      const overlay = event.overlay;
      const newShape = {
        type: event.type,
        position: overlay.getPosition ? overlay.getPosition().toJSON() : null,
        path: overlay.getPath ? overlay.getPath().getArray().map((p) => p.toJSON()) : null,
        icon: selectedPosition,
        timestamp: new Date().toISOString(),
      };

      try {
        const docRef = await addDoc(collection(db, "markers"), newShape);
        setDrawnShapes((prev) => [
          ...prev,
          { ...newShape, id: docRef.id, overlay, icon: iconMapping[selectedPosition] },
        ]);
      } catch (error) {
        console.error("Failed to add marker to Firestore:", error);
      }
    };

    google.maps.event.addListener(newDrawingManager, "overlaycomplete", handleOverlayComplete);

    return () => {
      google.maps.event.clearInstanceListeners(newDrawingManager);
      newDrawingManager.setMap(null);
      unsubscribe(); // Clean up Firestore listener
    };
  }, [drawing, map, selectedPosition]);

  const handleUndoLast = async () => {
    if (drawnShapes.length === 0) return;

    const lastShape = drawnShapes[drawnShapes.length - 1];
    if (lastShape.overlay) {
      lastShape.overlay.setMap(null);
    }
    if (lastShape.id) {
      try {
        await deleteDoc(doc(db, "markers", lastShape.id));
      } catch (error) {
        console.error("Failed to delete marker from Firestore:", error);
        return;
      }
    }
    setDrawnShapes((prev) => prev.slice(0, -1));
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