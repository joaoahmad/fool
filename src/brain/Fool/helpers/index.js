export function intersect(a, b){
    return a.find(i => !!b.find(j => j === i));
}
