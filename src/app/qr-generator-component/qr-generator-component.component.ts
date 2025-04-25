import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  template: '<canvas #canvas></canvas>',
})

export class QrGeneratorComponent implements OnChanges {
  @Input() value: string = '';
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngOnChanges() {
    if (!this.canvas || !this.value) return;
    QRCode.toCanvas(this.canvas.nativeElement, this.value, { errorCorrectionLevel: 'M' }, (error: any) => {
      if (error) console.error('QR Code error:', error);
    });
  }
}
