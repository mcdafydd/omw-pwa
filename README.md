# OutOfMyWay Time Tracker Progressive Web App

*** (12/11/19) In active development, it may not work exactly as described, but it's getting close ***

This is the official PWA for the command-line [Omw time tracker](https://github.com/mcdafydd/omw) server.  This PWA is usable on its own, but it is really meant to be used embedded from the [Omw hotkeys Chrome extension].  The extension provides the global hotkey binding to access the time tracking interface from anywhere on your computer, no matter what application is focused.

# Prerequisites

## For running

* A modern web browser supporting PWA technologies (we target the latest Chrome features - others may work)

### Getting Started

Visit the PWA URL **coming soon**. From here you can install the app if you want.

If you want global hotkeys support, highly recommended, we have to use a browser extension until these are a native capability of PWAs.

## For developing

We use the [lit-element](#References) framework for building web components.  The app started as a fork of Google's [PWA Starter Kit](#References) and moved to the [open-wc](#References)  template.

1. Use NodeJS v11.14.0+
2. Build the rollup-packaged app: `npm run build`
3. Test the app locally: `npm run start:build`

# References

* [Open Web Component Recommendations](https://open-wc.org/)
* [PWA Starter Kit](https://github.com/Polymer/pwa-starter-kit)
* [Lit Element](https://lit-element.polymer-project.org/)
