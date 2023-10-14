export const displayNumber = (n: number) => {
    return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}