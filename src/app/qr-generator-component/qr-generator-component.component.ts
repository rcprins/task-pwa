import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  template: '<canvas #canvas [style.width.px]="size" [style.height.px]="size"></canvas>',
  standalone: true
})
export class QrGeneratorComponent implements OnChanges {
  @Input() value: string = '';
  @Input() size: number = 100; // default size in pixels
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngOnChanges() {
    if (!this.canvas || !this.value) return;
    QRCode.toCanvas(
      this.canvas.nativeElement, 
      this.value, 
      { errorCorrectionLevel: 'M', width: this.size }, // width controls canvas size in QR library
      (error: any) => {
        if (error) console.error('QR Code error:', error);
      }
    );
  }
}