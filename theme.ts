export class ThemeConfig {
    loadTheme: () => string;
    saveTheme: (theme: string) => void;
    themeChangeHandlers: ((theme: string) => void)[];

    constructor() {
        this.themeChangeHandlers = [];
        this.loadTheme = () => localStorage.getItem('theme') || 'light';
        this.saveTheme = theme => localStorage.setItem('theme', theme);
    }

    initTheme(): void {
        this.displayTheme(this.getTheme());
    }

    getTheme(): string {
        return this.loadTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    setTheme(theme: string): void {
        this.saveTheme(theme);
        this.displayTheme(theme);
    }

    displayTheme(theme: string): void {
        document.body.setAttribute('data-theme', theme);
        for (let handler of this.themeChangeHandlers) {
            handler(theme);
        }
    }
}

export function writeDarkSwitch(config: ThemeConfig) {
    document.write(`
<div class="custom-control custom-switch">
<input type="checkbox" class="custom-control-input" id="darkSwitch">
<label class="custom-control-label" for="darkSwitch">Dark Mode</label>
</div>
`);

    const darkSwitch = document.getElementById('darkSwitch') as HTMLInputElement;

    darkSwitch.checked = config.getTheme() === 'dark';
    darkSwitch.onchange = () => {
        config.setTheme(darkSwitch.checked ? 'dark' : 'light');
    };

    config.themeChangeHandlers.push(theme => darkSwitch.checked = theme === 'dark');

    return darkSwitch;
}