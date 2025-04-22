import { Component, OnInit } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/library';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css',
  standalone: false
})
export class BarcodeScannerComponent implements OnInit {

  scanner: BrowserMultiFormatReader;
  videoInputDevices!: MediaDeviceInfo[];
  selectedDevice!: MediaDeviceInfo;
  scannedResult!: string;

  constructor() {
    this.scanner = new BrowserMultiFormatReader();
  }

  ngOnInit() {
    this.scanner.listVideoInputDevices().then(devices => {
      this.videoInputDevices = devices;
      if (devices.length > 0) {
        this.selectedDevice = devices[0]; // Default to the first device
      }
    });
  }

  startScanning() {
    const constraints = {
      video: {
        deviceId: this.selectedDevice.deviceId
      }
    };

    this.scanner.decodeFromVideoDevice(constraints.video.deviceId, 'video', (result, error) => {
      if (result) {
        this.scannedResult = result.getText();
      }
      if (error) {
        console.error("Error " + error);
      }
    });
  }

  stopScanning() {
    this.scanner.reset();
  }
}