import * as React from 'react';
import { Animated, View, asset } from 'react-360';
import Entity from 'Entity';
import AmbientLight from 'AmbientLight';
import PointLight from 'PointLight';
import { connect } from './Store';

const AnimatedEntity = Animated.createAnimatedComponent(Entity);

/**
 * Renders the actual model in 3D space, rotating it a full 360 degrees to show
 * it from all angles.
 */
class ModelView extends React.Component {
  rotation = new Animated.Value(0);

  componentDidMount() {
    console.log('Mounted');
  }

  render() {
    return (
      <View
        onInput={e => {
          const event = e.nativeEvent;
          const inputEvent = event.inputEvent;
          //console.log(inputEvent.button);
        }}
      >
        <AmbientLight
          intensity={1.0}
          color={'#ffffff'}
          style={{
            transform: [
              { translate: [100, -17, 100] },
              { scale: 0.1 },
              { rotateX: 270 }
            ]
          }}
        />
        <PointLight
          intensity={0.4}
          style={{ transform: [{ translate: [0, 5, -1] }] }}
        />
        {/**<AnimatedEntity
          style={{transform: [{rotateY: this.rotation}]}}
          source={{gltf2: source.root.url}}
        />*/}
        <Entity
          source={{ obj: asset('terrain-1.obj'), mtl: asset('terrain-1.mtl') }}
          style={{ scaleX: 2000.0, scaleY: 2000.0, scaleZ: 2000.0 }}
          lit={true}
        />
      </View>
    );
  }
}

const ConnectedModelView = connect(ModelView);

export default ConnectedModelView;
