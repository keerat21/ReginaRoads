
export const blocked = {            path: "M -10, -10 L 10, -10 L 10, 10 L -10, 10 Z M -10, -10 L 10, 10 M 10, -10 L -10, 10", // Cross inside a rectangle
    fillColor: "#FF0000", // Red color for blockage
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#FFFFFF", // White cross lines
    scale: 1,
    rotation: 0}

    export const curves = {
        path: "M -10,-5 Q -5,10 0,-5 T 10,-5 M -10,5 Q -5,-10 0,5 T 10,5",
        fillOpacity: 0, // No fill, just stroke
        strokeWeight: 2,
        strokeColor: "#FFBF00", // Yellow color for warning
        scale: 0.8,
      };
      
      

export const potholes = {
          path: "M -6,-6 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0 M 2,-4 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0 M -3,3 a 2.5,2.5 0 1,0 5,0 a 2.5,2.5 0 1,0 -5,0",
          fillColor: "#7F7F7F", // Asphalt color
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#4A4A4A",
          scale: 1.5,
      }

export const redTriangle = {
         path: "M 0, 0 L 5, 10 L -5, 10 Z", // Custom SVG path for a triangle
          
          fillColor: "#FF0000",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#000000",
          scale: 1.5, // Adjusts the size
          rotation: 180, // No rotation
      }