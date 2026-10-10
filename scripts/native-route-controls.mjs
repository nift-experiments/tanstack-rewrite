import {libraries} from '../.work/corpus-libraries.mjs';
const nativeLibraries=new Set(libraries.map(library=>library.id));
import {createPublicationRouter} from '../.work/publication-ssr/index.mjs';

// Native families retain original version controls. Match/redirect resolution
// belongs to Router; this adapter does not maintain a parallel URL policy.
export async function applyNativeRouteControl(href) {
  if(!nativeLibraries.has(new URL(href,'http://publication.local').pathname.split('/')[1]))return;
  const router=createPublicationRouter({initialPath:href,initialHtml:'',server:true,includeApplications:true});
  const matches=router.matchRoutes(router.state.location.pathname);
  const match=matches.find(match=>router.routesById[match.routeId]?.options.staticData?.publicationNativeVersion);
  if(!match||!nativeLibraries.has(matches.at(-1).params.libraryId))return;
  try {await router.routesById[match.routeId].options.beforeLoad({params:matches.at(-1).params,location:router.state.location})}
  catch(error){if(error?.options?.href||error?.options?.to)throw router.resolveRedirect(error);throw error}
}
