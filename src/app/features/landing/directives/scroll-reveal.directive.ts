import {
    AfterViewInit,
    Directive,
    ElementRef,
    input,
    OnDestroy,
} from '@angular/core';

@Directive({
    selector: '[scrollReveal]',
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
    private observer!: IntersectionObserver;

    threshold = input<number>(0.15);
    delay = input<string>('0ms');

    constructor(private el: ElementRef<HTMLElement>) { }

    ngAfterViewInit(): void {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: this.threshold() }
        );

        this.el.nativeElement.style.transitionDelay = this.delay();
        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }
}
