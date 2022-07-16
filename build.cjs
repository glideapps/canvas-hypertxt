const { build } = require("esbuild");

const shared = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
};

build({
    ...shared,
    outfile: "dist/cjs/index.cjs",
    format: "cjs",
});

build({
    ...shared,
    outfile: "dist/js/index.js",
    format: "esm",
});
