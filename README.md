# Out Of My Way Time Tracker Progressive Web App

[![Netlify Status](https://api.netlify.com/api/v1/badges/99e7da03-201c-4516-b0ff-b6375ce4ecb6/deploy-status)](https://app.netlify.com/sites/clever-williams-1fb603/deploys)

This is the official PWA version of the [Omw command-line time tracker](https://github.com/mcdafydd/omw).  This PWA is usable on its own, but it is really meant to be used alongside the [Omw hotkeys Chrome extension].  The extension provides the global hotkey binding to allow for quick access to the task command interface from anywhere.

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
