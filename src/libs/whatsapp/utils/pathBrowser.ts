export const pathBrowser = (os: 'win32' | 'darwin' | 'linux' | string): string => {
    if (os == "win32") {
        return 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    } else if (os == "darwin") {
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else if (os == "linux") {
        return '/usr/bin/google-chrome-stable';
    }
}