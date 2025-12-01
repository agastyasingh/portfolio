import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, HostListener} from '@angular/core';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import ScrollSmoother from 'gsap/ScrollSmoother';
import Observer from 'gsap/Observer';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, AfterViewInit {


  hirePurpose:string = '';
  businessName:string = '';
  contact:string = '';

  company:string = '';
  position:string = '';
  profile:string = '';

  images = [
    '/assets/Flow12.drawio.svg',
    '/assets/Flow1.drawio.svg',
    '/assets/Flow1.drawio.svg',
    '/assets/Flow1.drawio.svg',
  ];

  private currentRotation = 0;
  private readonly numFaces = this.images.length;

  ngOnInit(): void {}

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private el: ElementRef) {}


  ngAfterViewInit(): void {
    const cards = document.querySelectorAll('.animate-card');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add('in-view');
          } else {
            target.classList.remove('in-view'); 
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    
    cards.forEach(card => observer.observe(card));


    if (isPlatformBrowser(this.platformId)) {
    gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

    const paragraphs = document.querySelectorAll(".about-line");

    paragraphs.forEach((p) => {
      const split = new SplitText(p as HTMLElement, { type: "lines" });
      const lines = split.lines;

      gsap.fromTo(
        lines,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: p,
            start: "top 95%",
            end: "bottom 10%",
            scrub: true, 
            markers: false
          }
        }
      );
    });
  }

  const isMobile = window.innerWidth < 768;

  gsap.from("#about-photo", {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: isMobile ? "#about-photo" : "#about-text", 
      start: isMobile ? "top 90%" : "top 95%",             
      end: isMobile ? "bottom 30%" : "bottom 15%",
      scrub: true
    }
  });

  ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: "max",
    onUpdate: () => {
      gsap.fromTo(
        ".btn",
        { y: 0 },
        {
          y: -10,
          duration: 0.3,
          ease: "bounce.out",
          clearProps: "y"
        }
      );
    }
  });   

  
  }

  showModal = false;

  @ViewChild('hireButton', { static: true }) hireButton!: ElementRef;
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;
  // @ViewChild('carousel') carouselRef!: ElementRef;

  openModal() {
    this.showModal = true;
    setTimeout(() => {
      gsap.to('.modal-content', {
        duration: 0.4,
        scale: 1,
        opacity: 1,
        ease: 'power2.out'
      });
    });
  }

  closeModal() {
    gsap.to('.modal-content', {
      duration: 0.3,
      scale: 0.8,
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        this.showModal = false;
      }
    });
  }

  HirePurposeWebsite(purpose: string, bName:string, contact:string){
    this.hirePurpose = `${purpose}\n${bName}\n${contact}`;
  }

  HirePurposeJob(purpose: string, company:string, position:string, profile:string){
    this.hirePurpose = `${purpose}\n${company}\n${position}\n${profile}`;
  }

  // Add to your HomeComponent
// isSubmitting = false;
// submitSuccess = false;
// submitError = false;

// async onSubmit(event: Event) {
//   event.preventDefault();
//   this.isSubmitting = true;
//   this.submitError = false;

  
//   const form = event.target as HTMLFormElement;
  
//   try {
//     const response = await fetch(form.action, {
//       method: form.method,
//       body: new FormData(form),
//       headers: {
//         'Accept': 'application/json'
//       }
//     });
    
//     if (response.ok) {
//       this.submitSuccess = true;
//       form.reset();
//       setTimeout(() => this.submitSuccess = false, 5000);
//     } else {
//       throw new Error('Form submission failed');
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     this.submitError = true;
//   } finally {
//     this.isSubmitting = false;
//   }
// }

isSubmitting = false;
submitSuccess = false;
submitError = false;
formSubmitted = false; // Add this flag

async onSubmit(event: Event, form: NgForm) {
  event.preventDefault();
  this.formSubmitted = true;
  
  // Force validation update for all fields
  Object.keys(form.controls).forEach(key => {
    const control = form.controls[key];
    control.markAsTouched();
    control.updateValueAndValidity();
  });

  // Return immediately if form is invalid
  if (form.invalid) {
    this.submitError = false; // Ensure submission error is hidden
    return;
  }

  this.isSubmitting = true;
  this.submitError = false;
  this.submitSuccess = false;

  const htmlForm = event.target as HTMLFormElement;
  
  try {
    const response = await fetch(htmlForm.action, {
      method: htmlForm.method,
      body: new FormData(htmlForm),
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      this.submitSuccess = true;
      form.resetForm();
      this.formSubmitted = false;
      setTimeout(() => this.submitSuccess = false, 5000);
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    this.submitError = true;
    setTimeout(() => this.submitError = false, 3000);
  } finally {
    this.isSubmitting = false;
  }
}

// async onSubmit(event: Event, form: NgForm) {
//   event.preventDefault();
  
//   // Mark all fields as touched to show validation errors
//   form.control.markAllAsTouched();
  
//   // Check form validity before submission
//   if (form.invalid) {
//     this.submitError = true;
//     setTimeout(() => this.submitError = false, 3000);
//     return;
//   }

//   this.isSubmitting = true;
//   this.submitError = false;
//   this.submitSuccess = false;

//   const htmlForm = event.target as HTMLFormElement;
  
//   try {
//     const response = await fetch(htmlForm.action, {
//       method: htmlForm.method,
//       body: new FormData(htmlForm),
//       headers: {
//         'Accept': 'application/json'
//       }
//     });
    
//     if (response.ok) {
//       this.submitSuccess = true;
//       form.resetForm(); // Use Angular's resetForm to properly clear the form
//       setTimeout(() => this.submitSuccess = false, 5000);
//     } else {
//       throw new Error('Form submission failed');
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     this.submitError = true;
//     setTimeout(() => this.submitError = false, 3000);
//   } finally {
//     this.isSubmitting = false;
//   }
// }
}
