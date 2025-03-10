import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryPhoto, GalleryImageOptions } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor() { }

  private async checkPermissions(): Promise<void> {
    try {
      const permissions = await Camera.checkPermissions();
      // Si estamos en web, podemos omitir algunas comprobaciones de permisos
      // ya que el navegador manejará esto a través de su propio sistema de permisos
      if (permissions.camera === 'prompt') {
        await Camera.requestPermissions();
      }
    } catch (error) {
      console.log('Verificación de permisos omitida en web:', error);
      // No lanzamos error aquí, permitimos que el flujo continúe
    }
  }

  async takePicture(): Promise<string> {
    try {
      // Intentamos verificar permisos, pero no bloqueamos si falla
      await this.checkPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        // Cambiamos a DataUrl para mejor compatibilidad web
        resultType: CameraResultType.DataUrl,
        // Cambiamos a Camera para usar la cámara directamente en lugar de la galería
        source: CameraSource.Camera,
        // Añadimos opciones específicas para web
        webUseInput: true
      });
      
      // Si usamos DataUrl, debemos acceder a dataUrl en lugar de webPath
      if (image.dataUrl) {
        return image.dataUrl;
      } else {
        throw new Error("No se obtuvo una imagen válida");
      }
    } catch (error) {
      console.error('Error en el servicio de cámara:', error);
      throw error;
    }
  }

  async getPhotosFromGallery(limit: number = 5): Promise<string[]> {
    try {
      await this.checkPermissions();
      
      // Usamos el método correcto y opciones para obtener imágenes de la galería
      const result = await Camera.pickImages({
        limit: limit
      });
      
      // Procesamos las fotos obtenidas
      const photos: string[] = [];
      
      if (result && result.photos) {
        for (const photo of result.photos) {
          try {
            // Convertimos cada foto a base64/dataUrl manualmente
            // ya que pickImages no acepta resultType
            const photoData = await this.convertToDataUrl(photo);
            photos.push(photoData);
          } catch (err) {
            console.error('Error al procesar foto:', err);
          }
        }
      }
      
      return photos;
    } catch (error) {
      console.error('Error al obtener imágenes de la galería:', error);
      throw error;
    }
  }

  private async convertToDataUrl(photo: GalleryPhoto): Promise<string> {
    // Si estamos en web y tenemos webPath
    if (photo.webPath) {
      try {
        // Convertimos webPath a dataUrl
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error al convertir imagen:', error);
        throw new Error('No se pudo convertir la imagen');
      }
    } else if (photo.path) {
      // Si estamos en nativo y tenemos path
      // En un entorno real, aquí tendrías que usar capacitor/filesystem 
      // para leer el archivo y convertirlo a base64
      throw new Error('La conversión de path a dataUrl no está implementada para entorno nativo');
    } else {
      throw new Error('No se encontró una ruta válida para la imagen');
    }
  }
}