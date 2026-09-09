import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private readonly storageKey = 'flowboard-theme';

    readonly isDarkMode = signal(false);

    constructor() {
        const savedTheme = localStorage.getItem(this.storageKey);

        if (savedTheme === 'dark') {
            this.isDarkMode.set(true);
        }

        this.applyTheme();
    }

    toggleTheme(): void {
        this.isDarkMode.update(value => !value);

        localStorage.setItem(
            this.storageKey,
            this.isDarkMode() ? 'dark' : 'light'
        );

        this.applyTheme();
    }

    private applyTheme(): void {
        document.documentElement.classList.toggle(
            'dark',
            this.isDarkMode()
        );
    }
}