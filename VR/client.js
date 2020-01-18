import { ReactInstance, Location, Surface } from 'react-360-web';
import KeyboardCameraController from './KeyBoardCameraController';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    fullScreen: true,
    ...options
  });

  // Create three roots: two flat panels on the left and the right, and a Location
  // to mount rendered models in 3D space

  //r360.controls.clearCameraControllers();
  //r360.controls.addCameraController(new KeyboardCameraController());

  r360.renderToLocation(
    r360.createRoot('ModelView'),
    new Location([0, -0.1, 0])
  );

  r360.compositor.setBackground('./static_assets/360_world.jpg');
}

window.React360 = { init };
