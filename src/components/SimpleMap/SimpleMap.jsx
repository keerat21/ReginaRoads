import { useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  ControlPosition,
  MapControl,
} from "@vis.gl/react-google-maps";
import "./SimpleMap.scss";
import ControlPanel from "../ControlPanel/ControlPanel";
// import { CustomZoomControl } from "./custom-zoom-control";

const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const SimpleMap = () => {
  const [controlPosition, setControlControlPosition] = useState(
    ControlPosition.LEFT_BOTTOM
  );

  return (
    <APIProvider apiKey={VITE_API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 50.44521, lng: -104.618896 }}
        defaultZoom={13}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        s
      >
        <MapControl position={ControlPosition.TOP_LEFT}>
          .. any component here will be added to the control-containers of the
          google map instance ..
          <ControlPanel
            position={ControlPosition.TOP_RIGHT}
            onControlPositionChange={(p) => setControlControlPosition(p)}
            style={{ width: "50%" }}
          />
        </MapControl>
      </Map>
    </APIProvider>
  );
};

export default SimpleMap;
