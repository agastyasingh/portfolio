import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import Observer from 'gsap/Observer';

gsap.registerPlugin(Observer);

@Component({
  selector: 'app-observer-carousel',
  standalone: false,
  templateUrl: './observer-carousel.component.html',
  styleUrl: './observer-carousel.component.css',
})
export class ObserverCarouselComponent implements AfterViewInit {
  @ViewChild('carousel') carouselRef!: ElementRef;
  @ViewChild('leftArrow', { static: true }) leftArrow!: ElementRef;

  animateArrowIn() {
    gsap.to(this.leftArrow.nativeElement, {
      x: -5,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  animateArrowOut() {
    gsap.to(this.leftArrow.nativeElement, {
      x: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  private currentRotation = 0;
  private readonly numFaces = 6;

  ngAfterViewInit(): void {
    const carouselElement = this.carouselRef.nativeElement as HTMLElement;
    const angle = 360 / this.numFaces;

    // Set each face’s position in 3D space
    Array.from(carouselElement.children).forEach((face: Element, i: number) => {
      const rotation = angle * i;
      gsap.set(face, {
        transform: `rotateY(${rotation}deg) translateZ(400px)`,
      });
    });

    // Highlight the front-facing image
    const faces = Array.from(carouselElement.children) as HTMLElement[];
    faces.forEach((face) => face.classList.remove('front'));

    let frontIndex =
      Math.round((this.currentRotation % 360) / (360 / this.numFaces)) %
      this.numFaces;
    if (frontIndex < 0) frontIndex += this.numFaces;
    faces[frontIndex].classList.add('front');

    // Observer.create({
    //   type: 'drag,touch,wheel', // enables all 3 types
    //   target: carouselElement,
    //   preventDefault: true,
    //   onChangeX: (self) => {
    //     this.currentRotation -= self.deltaX * -0.3;

    //     gsap.to(carouselElement, {
    //       rotateY: this.currentRotation,
    //       duration: 0.8,
    //       ease: 'power2.out',
    //       overwrite: true,
    //       onUpdate: () => this.highlightFrontFace(carouselElement),
    //     });
    //   },
    // });

    Observer.create({
  type: "drag,touch,wheel",
  target: carouselElement,
  preventDefault: true,
  onChangeX: (self) => {
    // Determine if this is a touch event (trackpad/touchscreen)
    const isTouchEvent = self.event.type.includes('touch');
    
    // Reverse the direction only for touch events
    const rotationFactor = isTouchEvent ? 1 : -0.3;
    this.currentRotation += self.deltaX * rotationFactor;

    gsap.to(carouselElement, {
      rotateY: this.currentRotation,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => this.highlightFrontFace(carouselElement),
    });
  }
});
  }

  private highlightFrontFace(carousel: HTMLElement): void {
    const faces = Array.from(carousel.children) as HTMLElement[];
    const anglePerFace = 360 / this.numFaces;

    const frontIndex =
      ((Math.round(-this.currentRotation / anglePerFace) % this.numFaces) +
        this.numFaces) %
      this.numFaces;

    faces.forEach((face, i) => {
      const wasFront = face.classList.contains('front');
      const isNowFront = i === frontIndex;

      face.classList.toggle('front', isNowFront);

      // Unzoom if the face was front but is no longer
      if (wasFront && !isNowFront && this.zoomedElements.has(face)) {
        gsap.to(face, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            this.zoomedElements.delete(face);
          },
        });
      }
    });
  }

  private zoomedElements = new Set<HTMLElement>();

  toggleZoom(event: Event): void {
    const element = event.currentTarget as HTMLElement;

    // ✅ Only proceed if the clicked face is the front one
    if (!element.classList.contains('front')) {
      return; // Do nothing if not front-facing
    }

    if (this.zoomedElements.has(element)) {
      // Revert to original state
      gsap.to(element, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
      this.zoomedElements.delete(element);
    } else {
      // Zoom in and bring to front
      gsap.to(element, {
        scale: 2,
        duration: 0.6,
        ease: 'power2.out',
      });
      this.zoomedElements.add(element);
    }
  }
}

// Observer.create({
//   type: 'touch,pointer,wheel',
//   target: carouselElement,
//   onChangeX: (self) => {
//     const dx = self.deltaX;
//     this.currentRotation += dx * -0.3;

//     gsap.to(carouselElement, {
//       rotateY: this.currentRotation,
//       duration: 1,
//       ease: 'power2.out',
//       onUpdate: () => this.highlightFrontFace(carouselElement),
//     });
//   },
// });

// toggleZoom(event: Event): void {
//   const element = event.currentTarget as HTMLElement;

//   if (this.zoomedElements.has(element)) {
//     gsap.to(element, {
//       scale: 1,
//       duration: 0.6,
//       ease: 'power2.out',
//     });
//     this.zoomedElements.delete(element);
//   } else {
//     gsap.to(element, {
//       scale: 2,
//       duration: 0.6,
//       ease: 'power2.out',
//     });
//     this.zoomedElements.add(element);
//   }
// }

// private highlightFrontFace(carousel: HTMLElement): void {
//   const faces = Array.from(carousel.children) as HTMLElement[];
//   const anglePerFace = 360 / this.numFaces;

//   const frontIndex =
//     ((Math.round(-this.currentRotation / anglePerFace) % this.numFaces) +
//       this.numFaces) %
//     this.numFaces;

//   faces.forEach((face, i) => {
//     face.classList.toggle('front', i === frontIndex);
//   });
// }
