({
    baseUrl: "public/js",
    paths: {
        "three": "components/three.js/three",
        "dat": "components/dat-gui/build/dat.gui"
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    },
    name: "main",
    include: ["three","dat"],
    out: "public/js/main-built.js"
})
