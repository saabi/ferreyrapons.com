({
    baseUrl: "public/js",
    paths: {
        "three": "components/three.js/three"
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    },
    name: "main",
    include: ["three"],
    out: "public/js/main-built.js"
})
