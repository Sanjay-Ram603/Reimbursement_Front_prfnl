import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReimbursementService } from '../../core/services/reimbursement.service';

@Component({
  selector: 'app-attachment-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attachment-preview.component.html',
  styleUrl: './attachment-preview.component.css'
})
export class AttachmentPreviewComponent implements OnDestroy {
  @Input() requestId: string = '';
  @Input() attachmentPath: string = '';

  isOpen: boolean = false;
  isLoading: boolean = false;
  previewUrl: string = '';
  isPdf: boolean = false;
  errorMessage: string = '';

  constructor(private reimbursementService: ReimbursementService) {}

  openPreview(): void {
    this.isOpen = true;
    this.isLoading = true;
    this.errorMessage = '';

    this.reimbursementService.downloadAttachment(this.requestId).subscribe({
      next: (blob) => {
        this.isPdf = blob.type === 'application/pdf';
        this.previewUrl = URL.createObjectURL(blob);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load attachment!';
        this.isLoading = false;
      }
    });
  }

  closePreview(): void {
    this.isOpen = false;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = '';
    }
  }

  downloadAttachment(): void {
    this.reimbursementService.downloadAttachment(this.requestId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.attachmentPath.split('/').pop() || 'attachment';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Download failed!')
    });
  }

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}
