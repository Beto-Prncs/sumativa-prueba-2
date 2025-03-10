import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from '../camera/camera.component';

interface ReportItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, CameraComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  reports: ReportItem[] = [];
  showCamera = false;
  currentReportId: number | null = null;

  ngOnInit() {
    // Cargamos datos de ejemplo
    this.loadSampleReports();
  }

  loadSampleReports() {
    this.reports = [
      {
        id: 1,
        title: 'Inspección inicial',
        description: 'Revisión preliminar del sitio antes de comenzar trabajos',
        imageUrl: '',
        date: new Date()
      },
      {
        id: 2,
        title: 'Avance de obra',
        description: 'Documentación del progreso actual de la construcción',
        imageUrl: '',
        date: new Date()
      }
    ];
  }

  openCamera(reportId: number) {
    this.showCamera = true;
    this.currentReportId = reportId;
  }

  closeCamera() {
    this.showCamera = false;
    this.currentReportId = null;
  }

  onImageSelected(imageUrl: string) {
    if (this.currentReportId !== null) {
      // Actualizamos la imagen del reporte
      const reportIndex = this.reports.findIndex(r => r.id === this.currentReportId);
      if (reportIndex >= 0) {
        this.reports[reportIndex].imageUrl = imageUrl;
      }
    }
  }

  addNewReport() {
    const newId = Math.max(0, ...this.reports.map(r => r.id)) + 1;
    this.reports.push({
      id: newId,
      title: `Nuevo reporte ${newId}`,
      description: 'Descripción del nuevo reporte',
      imageUrl: '',
      date: new Date()
    });
  }

  deleteReport(id: number) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index >= 0) {
      this.reports.splice(index, 1);
    }
  }
}