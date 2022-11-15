const NLIMIT = 1000000;

const t0 = Date.now();
const m = new Map;
const nLimitSize = String(NLIMIT).length - 1;
for(var i = 0; i < NLIMIT; i++) {
    const sum = String(i).padStart(nLimitSize, '0')
        .split("")
        .map(x => Number(x))
        .reduce((a, v) => a + v);
    m.set(sum, (m.get(sum) ?? 0) + 1);
}
print("build: ", (Date.now() - t0)/1000, "sec.");
print("array:", Array.from(m.values()));
Array.from(m.values())
    .map(x => x*x)
    .reduce((a, v) => a + v);
