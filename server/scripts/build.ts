import esbuild from "esbuild";
import path from "path";

esbuild.build({
    bundle: true,
    entryPoints: {
        index: path.resolve(__dirname, "../src/index.ts"),
    },
    outdir: path.resolve(__dirname, "../dist"),
    target: "es6",
    format: "cjs",
    platform: "node",
});
