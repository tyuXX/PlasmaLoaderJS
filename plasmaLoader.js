window.PlasmaLoader = {
    version: "0.0.1",
    loaded: false,
    mods: [
        {
            name: "Plasma Loader",
            id: "plasmaLoader",
            version: "current",
            author: "tyuXX",
            dependencies: [],
            scripts: [],
            loaded: true
        }
    ],
    loadUI: () => {
        if (PlasmaLoader.loaded) {
            // Do stuff
            console.log("PlasmaLoader UI loaded!");
        }
    },
    load: () => {
        const plasmaLoaderContainer = document.createElement("div");
        plasmaLoaderContainer.id = "plasmaLoaderContainer";
        plasmaLoaderContainer.appendChild(document.createElement("div")).id = "plasmaLoaderScripts";
        plasmaLoaderContainer.appendChild(document.createElement("div")).id = "plasmaLoaderButton";
        plasmaLoaderContainer.appendChild(document.createElement("div")).id = "plasmaLoaderUI";
        document.body.appendChild(plasmaLoaderContainer);
        // Do stuff
        PlasmaLoader.loaded = true;
        console.log("PlasmaLoader loaded!");
    },
    registerMod: (modJson) => {
        if (PlasmaLoader.loaded) {
            const mod = fetch(modJson).then(res => res.json());
            PlasmaLoader.mods.push({
                name: mod.name,
                id: mod.id,
                version: mod.version,
                author: mod.author,
                dependencies: mod.dependencies,
                scripts: mod.scripts,
                loaded: false
            });
            console.log("PlasmaLoader: Mod registered!");
        }
    },
    unregisterMod: (modId) => {
        if (PlasmaLoader.loaded) {
            PlasmaLoader.mods = PlasmaLoader.mods.filter(mod => mod.id !== modId);
            console.log("PlasmaLoader: Mod unregistered!");
        }
    },
    loadMod: (modId) => {
        if (PlasmaLoader.loaded) {
            const mod = PlasmaLoader.mods.find(mod => mod.id === modId);
            if (mod) {
                mod.loaded = true;
                // Load dependencies first
                for (const dependency of mod.dependencies) {
                    if (!PlasmaLoader.mods.find(m => m.id === dependency && m.loaded)) {
                        PlasmaLoader.loadMod(dependency);
                    }
                }
                // Load mod scripts
                for (const script of mod.scripts) {
                    const scriptElement = document.createElement("script");
                    scriptElement.src = script;
                    scriptElement.id = `${modId}-${script}`;
                    document.getElementById("plasmaLoaderScripts").appendChild(scriptElement);
                }
                console.log(`PlasmaLoader: Mod ${modId} loaded!`);
            }
        }
    },
    unloadMod: (modId) => {
        if (PlasmaLoader.loaded) {
            const mod = PlasmaLoader.mods.find(mod => mod.id === modId);
            if (mod) {
                mod.loaded = false;
                // Remove mod scripts
                for (const script of mod.scripts) {
                    const scriptElement = document.getElementById(`${modId}-${script}`);
                    if (scriptElement) {
                        scriptElement.remove();
                    }
                }
                console.log(`PlasmaLoader: Mod ${modId} unloaded!`);
            }
        }
    },
    saveMods: () => {
        if (PlasmaLoader.loaded) {
            localStorage.setItem("plasmaLoader_mods", JSON.stringify(PlasmaLoader.mods));
            console.log("PlasmaLoader: Mods saved!");
        }
    },
    loadMods: () => {
        if (PlasmaLoader.loaded) {
            const savedMods = localStorage.getItem("plasmaLoader_mods");
            if (savedMods) {
                PlasmaLoader.mods = JSON.parse(savedMods);
                // Reload active mods
                for (const mod of PlasmaLoader.mods) {
                    if (mod.loaded) {
                        PlasmaLoader.loadMod(mod.id);
                    }
                }
                console.log("PlasmaLoader: Mods loaded from storage!");
            }
        }
    }
};

// Initialize PlasmaLoader when the document is ready
document.addEventListener("DOMContentLoaded", () => {
    PlasmaLoader.load();
    PlasmaLoader.loadMods();
});