const { build } = require("esbuild");

const shared = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
};

build({
    ...shared,
    outfile: "dist/cjs/index.js",
    format: "cjs",
});

build({
    ...shared,
    outfile: "dist/js/index.js",
    format: "esm",
});
