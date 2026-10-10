// Application construction and request-time version controls have no role in
// native publication preparation. This compiler-only seam is selected solely
// for that target; the browser/request targets retain the actual implementations.
// Fail explicitly if a preparation consumer ever crosses the boundary.
function runtimeOnly():never {throw Error('Request-runtime operation invoked during native publication preparation')}
export const createApplicationRoutes=runtimeOnly
export const beforeLoadLibraryLanding=runtimeOnly
export const routeOptions={beforeLoad:runtimeOnly}
