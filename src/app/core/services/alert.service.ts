import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

/**
 * Alert Service for SweetAlert2 confirmations and notifications
 * Provides a centralized way to show alerts, confirmations, and messages
 * TODO: Integrate with API error handling when real APIs are added
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private defaultOptions: SweetAlertOptions = {
    buttonsStyling: false,
    customClass: {
      confirmButton: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
      cancelButton: 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700',
      actions: 'flex gap-3 justify-end items-center mt-4',
      popup: 'dark:bg-gray-800 dark:text-white'
    },
    reverseButtons: false
  };

  /**
   * Show a confirmation dialog
   * @param title - Dialog title
   * @param text - Dialog message
   * @param confirmText - Confirm button text (default: 'Yes')
   * @param cancelText - Cancel button text (default: 'No')
   * @returns Promise<SweetAlertResult>
   */
  confirm(
    title: string = 'Are you sure?',
    text: string = "You won't be able to revert this!",
    confirmText: string = 'Yes',
    cancelText: string = 'No'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: false,
      buttonsStyling: false,
      customClass: {
        ...this.defaultOptions.customClass,
        actions: 'flex gap-3 justify-end items-center mt-4'
      }
    });
  }

  /**
   * Show a success message
   */
  success(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  /**
   * Show an error message
   */
  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  /**
   * Show a warning message
   */
  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  /**
   * Show an info message
   */
  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }
}

