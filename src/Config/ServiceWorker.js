

export function register(config) {
    if ('serviceWorker' in navigator) {
        // if (process.env.NODE_ENV === 'production') {
            window.addEventListener('load', () => {
                const swUrl = `${process.env.PUBLIC_URL || ""}/service-worker.js?v=${process.env.VERSION_HASH}`;
                registerValidSW(swUrl, config);
            });
        // }
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            registration.unregister();
                            window.location.reload();
                        } else {
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Error during service worker registration:', error);
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister();
            })
            .catch(error => {
                console.error(error.message);
            });
    }
}

