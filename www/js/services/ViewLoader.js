/*
 * View Loader Service
 * Fetches HTML partials and injects them into the main app container
 */
window.ViewLoader = {
    load: function(viewName) {
        const path = `views/${viewName}.html`;
        return fetch(path)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load view: ${viewName}`);
                return response.text();
            })
            .catch(err => {
                console.error(err);
                return `<div class="error">Failed to load view</div>`;
            });
    }
};
