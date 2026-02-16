import * as THREE from 'three';

export class FirstPersonControls {
  private camera: THREE.PerspectiveCamera;
  private euler: THREE.Euler;
  private isLocked: boolean;
  private onMouseMove: (event: MouseEvent) => void;
  private onClick: () => void;
  private onPointerLockChange: () => void;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.isLocked = false;

    this.onMouseMove = (event: MouseEvent) => {
      if (!this.isLocked) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= movementX * 0.002;
      this.euler.x -= movementY * 0.002;

      this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));

      this.camera.quaternion.setFromEuler(this.euler);
    };

    this.onClick = () => {
      domElement.requestPointerLock();
    };

    this.onPointerLockChange = () => {
      this.isLocked = document.pointerLockElement === domElement;
    };

    domElement.addEventListener('click', this.onClick);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
  }
}
