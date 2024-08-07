import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-rect-ske',
  host: {
    'class': 'pulse'
  },
  template: ``,
  styles: [`
    :host {
      display: block;
      width: var(--skeleton-rect-width);
      height: var(--skeleton-rect-height);
      margin: 2px;
      background: var(--text-color) no-repeat;
      
    }
  `]
})
export class RectSkeComponent {
  width!: string;
  height!: string;
  className!: string;

  constructor(private host: ElementRef<HTMLElement>) { }

  ngOnInit() {
    const host = this.host.nativeElement;

    if (this.className) {
      host.classList.add(this.className);
    }

    host.style.setProperty('--skeleton-rect-width', this.width ?? '100%');
    host.style.setProperty('--skeleton-rect-height', this.height ?? '20px');
  }

}
