import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/library';
import * as QRCode from 'qrcode';


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
  logMessages: string[] = [];

  constructor() {
    this.scanner = new BrowserMultiFormatReader();
  }

  ngOnInit() {
    this.scanner.listVideoInputDevices().then(devices => {
      this.videoInputDevices = devices;
  
      if (devices.length > 0) {
        // Try to find the back camera by label
        const backCam = devices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear')
        );
  
        this.selectedDevice = backCam || devices[0]; // fallback to first if not found
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
  
  async readNfcTag() {
    if ('NDEFReader' in window) {
      const ndef = new (window as any).NDEFReader();
  
      try {
        await ndef.scan();
        alert(('NFC scan started'))
        // this.logMessages.push('NFC scan started');
  
        ndef.onreading = (event: any) => {
          const message = event.message;
          for (const record of message.records) {
            alert(record);
            alert(record.data);
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            alert(textDecoder);
            const data = textDecoder.decode(record.data);
            alert("Data: " + data)
            this.scannedResult = data;
          }
        };
  
        ndef.onerror = (error: any) => {
          this.logMessages.push('NFC scan error: ' + error);
          alert('NFC scan error: ' + error);
        };
  
      } catch (error) {
        alert('Failed to start NFC scan: ' + error);
//        this.logMessages.push('Failed to start NFC scan: ' + error);
      }
    } else {
//      this.logMessages.push('Web NFC not supported on this device/browser.');
      alert('Web NFC not supported on this device/browser.');
    }
  }

}