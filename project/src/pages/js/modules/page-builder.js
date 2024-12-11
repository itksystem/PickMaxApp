// Interface class for generating and rendering a page
class PageBuilder {
   constructor(containerClass) {
        if (!containerClass) {
            throw new Error("Container class is required to initialize PageBuilder");
        }
        this.container = document.querySelector(`.${containerClass}`);
        if (!this.container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }
        this.modules = [];
    }

    /**
     * Adds a module to the page.
     * @param {string} moduleName - The name of the module.
     * @param {HTMLElement} content - The content of the module.
     */
    addModule(moduleName, content) {
        if (!moduleName || !content) {
            throw new Error("Module name and content are required.");
        }
        const module = {
            name: moduleName,
            content: content
        };
        this.modules.push(module);
    }

    /**
     * Renders the page into the specified container.
     */
    render() {
        if (this.modules.length === 0) {
            throw new Error("No modules to render.");
        }

        // Clear the container
        this.container.innerHTML = "";

        // Render each module
        this.modules.forEach(module => {
            const moduleContainer = document.createElement("div");
            moduleContainer.className = "module-container";
            moduleContainer.dataset.moduleName = module.name;
            moduleContainer.appendChild(module.content);
            this.container.appendChild(moduleContainer);
        });
    }
}
