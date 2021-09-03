export default function log() {
    const args = [...arguments];
    const verbose = Deno.args.indexOf('--verbose') > -1;

    if (verbose) {
        console.log(args.join(' '));
    }
}