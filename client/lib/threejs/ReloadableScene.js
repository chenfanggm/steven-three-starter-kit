import * as THREE from 'three'


let REMOVABLE_ITEMS = [];

const _add = Scene.add
Scene.add = (object) => {
  _add(object)
  REMOVABLE_ITEMS.push(object);
}

Scene.clean = () => {
  if( REMOVABLE_ITEMS.length > 0 ) {
    /*REMOVABLE_ITEMS.forEach((v,i) => {
      v.parent.remove(v);
    })*/
    REMOVABLE_ITEMS = null;
    REMOVABLE_ITEMS = [];
  }
}

export default Scene