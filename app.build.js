({
    baseUrl: "public/js",
    paths: {
        "three": "components/threejs/build/three",
        "dat-gui": "components/dat.gui/build/dat.gui"
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    },
    name: "main",
    include: ["three","dat-gui"],
    out: "public/js/main-built.js"
})
