import * as THREE from 'three';

export class FloorPlanRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private scale: number;

  constructor(width: number = 1024, height: number = 1024, scale: number = 50) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d')!;
    this.width = width;
    this.height = height;
    this.scale = scale;
  }

  render(plan: RoomPlan): HTMLCanvasElement {
    const ctx = this.context;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 4;
    const wallLeft = centerX - (plan.width / 2) * this.scale;
    const wallRight = centerX + (plan.width / 2) * this.scale;
    const wallTop = centerY - (plan.depth / 2) * this.scale;
    const wallBottom = centerY + (plan.depth / 2) * this.scale;

    ctx.strokeRect(wallLeft, wallTop, plan.width * this.scale, plan.depth * this.scale);

    plan.furniture.forEach((item) => {
      const x = centerX + item.x * this.scale;
      const y = centerY + item.z * this.scale;
      const w = item.width * this.scale;
      const d = item.depth * this.scale;

      ctx.fillStyle = item.color;
      ctx.fillRect(x - w / 2, y - d / 2, w, d);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - w / 2, y - d / 2, w, d);
    });

    ctx.fillStyle = '#0088FF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('You', centerX, centerY);

    return this.canvas;
  }

  getImageData(): string {
    return this.canvas.toDataURL('image/png');
  }

  downloadImage(filename: string = 'floor-plan.png'): void {
    const link = document.createElement('a');
    link.href = this.getImageData();
    link.download = filename;
    link.click();
  }
}
