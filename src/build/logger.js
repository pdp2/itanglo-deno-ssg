export default function log() {
    const verbose = Deno.args.indexOf('--verbose') > -1;

    if (verbose) {
        console.log(...arguments);
    }
}