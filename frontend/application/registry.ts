import * as view0 from "./views/_library"
import * as view1 from "./views/_library/$libraryId/$version.docs.community-resources"
import * as view2 from "./views/_library/$libraryId/$version.docs.contributors"
import * as view3 from "./views/_library/$libraryId/$version.docs.framework.$framework.examples.$"
import * as view4 from "./views/_library/$libraryId/$version.docs.npm-stats"
import * as view5 from "./views/_library/$libraryId/$version"
import * as view6 from "./views/_library/$libraryId/route"
import * as view7 from "./views/_library/charts.catalog.charts.$caseId"
import * as view8 from "./views/_library/charts.catalog.collections.$collectionId"
import * as view9 from "./views/_library/charts.catalog.index"
import * as view10 from "./views/_library/charts.catalog"
import * as view11 from "./views/account"
import * as view12 from "./views/account/feedback"
import * as view13 from "./views/account/index"
import * as view14 from "./views/account/integrations"
import * as view15 from "./views/account/notes"
import * as view16 from "./views/account/submissions"
import * as view17 from "./views/admin/audit"
import * as view18 from "./views/admin/chat-access"
import * as view19 from "./views/admin/docs"
import * as view20 from "./views/admin/feedback_.$id"
import * as view21 from "./views/admin/feedback.index"
import * as view22 from "./views/admin/github-stats"
import * as view23 from "./views/admin/index"
import * as view24 from "./views/admin/intent"
import * as view25 from "./views/admin/logins"
import * as view26 from "./views/admin/notes.index"
import * as view27 from "./views/admin/npm-stats"
import * as view28 from "./views/admin/roles.$roleId"
import * as view29 from "./views/admin/roles.index"
import * as view30 from "./views/admin/route"
import * as view31 from "./views/admin/showcases_.$id"
import * as view32 from "./views/admin/showcases.index"
import * as view33 from "./views/admin/users.$userId"
import * as view34 from "./views/admin/users"
import * as view35 from "./views/application-starter.docs"
import * as view36 from "./views/application-starter.index"
import * as view37 from "./views/application-starter"
import * as view38 from "./views/auth/cli"
import * as view39 from "./views/auth/popup-success"
import * as view40 from "./views/chat-access"
import * as view41 from "./views/chat.b.$botId"
import * as view42 from "./views/chat.c.$conversationId"
import * as view43 from "./views/chat.charts"
import * as view44 from "./views/chat.index"
import * as view45 from "./views/chat.p.$hash"
import * as view46 from "./views/chat.shared"
import * as view47 from "./views/chat"
import * as view48 from "./views/chat.w.$workspaceId"
import * as view49 from "./views/community-projects"
import * as view50 from "./views/dashboard"
import * as view51 from "./views/ds.avatar"
import * as view52 from "./views/ds.badges"
import * as view53 from "./views/ds.breadcrumbs"
import * as view54 from "./views/ds.buttons"
import * as view55 from "./views/ds.cards"
import * as view56 from "./views/ds.colors"
import * as view57 from "./views/ds.dialog"
import * as view58 from "./views/ds.drawer"
import * as view59 from "./views/ds.dropdown"
import * as view60 from "./views/ds.effects"
import * as view61 from "./views/ds.eyebrow"
import * as view62 from "./views/ds.index"
import * as view63 from "./views/ds.inputs"
import * as view64 from "./views/ds.logos"
import * as view65 from "./views/ds.navbar"
import * as view66 from "./views/ds.overlays"
import * as view67 from "./views/ds.page-header"
import * as view68 from "./views/ds.palette"
import * as view69 from "./views/ds.panel"
import * as view70 from "./views/ds.partner-rail"
import * as view71 from "./views/ds.semantic"
import * as view72 from "./views/ds.shadows"
import * as view73 from "./views/ds.spinner"
import * as view74 from "./views/ds.stats"
import * as view75 from "./views/ds.tabs"
import * as view76 from "./views/ds.takeover"
import * as view77 from "./views/ds"
import * as view78 from "./views/ds.typography"
import * as view79 from "./views/explore"
import * as view80 from "./views/feedback-leaderboard"
import * as view81 from "./views/intent/registry/$packageName.$skillName"
import * as view82 from "./views/intent/registry/$packageName.index"
import * as view83 from "./views/intent/registry/$packageName"
import * as view84 from "./views/intent/registry/index"
import * as view85 from "./views/libraries_.$framework"
import * as view86 from "./views/libraries"
import * as view87 from "./views/login"
import * as view88 from "./views/maintainers"
import * as view89 from "./views/oauth/authorize"
import * as view90 from "./views/partners.$partner"
import * as view91 from "./views/partners.index"
import * as view92 from "./views/partners"
import * as view93 from "./views/shop.$handle"
import * as view94 from "./views/shop.cart"
import * as view95 from "./views/shop.collections.$handle"
import * as view96 from "./views/shop.index"
import * as view97 from "./views/shop.pages.$handle"
import * as view98 from "./views/shop.policies.$handle"
import * as view99 from "./views/shop.products.$handle"
import * as view100 from "./views/shop.search"
import * as view101 from "./views/shop"
import * as view102 from "./views/showcase/$id"
import * as view103 from "./views/showcase/edit.$id"
import * as view104 from "./views/showcase/index"
import * as view105 from "./views/showcase/submit"
import * as view106 from "./views/sponsors-embed"
import * as view107 from "./views/stack.$category"
import * as view108 from "./views/stats/npm/$packages"
import * as view109 from "./views/stats/npm/embed"
import * as view110 from "./views/stats/npm/index"
import * as view111 from "./views/workshops"
export const applicationViews={
"src/routes/_library": {pattern:"/_library",options:view0.routeOptions},
"src/routes/_library/$libraryId/$version.docs.community-resources": {pattern:"/_library/$libraryId/$version/docs/community-resources",options:view1.routeOptions},
"src/routes/_library/$libraryId/$version.docs.contributors": {pattern:"/_library/$libraryId/$version/docs/contributors",options:view2.routeOptions},
"src/routes/_library/$libraryId/$version.docs.framework.$framework.examples.$": {pattern:"/_library/$libraryId/$version/docs/framework/$framework/examples/$",options:view3.routeOptions},
"src/routes/_library/$libraryId/$version.docs.npm-stats": {pattern:"/_library/$libraryId/$version/docs/npm-stats",options:view4.routeOptions},
"src/routes/_library/$libraryId/$version": {pattern:"/_library/$libraryId/$version",options:view5.routeOptions},
"src/routes/_library/$libraryId/route": {pattern:"/_library/$libraryId",options:view6.routeOptions},
"src/routes/_library/charts.catalog.charts.$caseId": {pattern:"/_library/charts/catalog/charts/$caseId",options:view7.routeOptions},
"src/routes/_library/charts.catalog.collections.$collectionId": {pattern:"/_library/charts/catalog/collections/$collectionId",options:view8.routeOptions},
"src/routes/_library/charts.catalog.index": {pattern:"/_library/charts/catalog/",options:view9.routeOptions},
"src/routes/_library/charts.catalog": {pattern:"/_library/charts/catalog",options:view10.routeOptions},
"src/routes/account": {pattern:"/account",options:view11.routeOptions},
"src/routes/account/feedback": {pattern:"/account/feedback",options:view12.routeOptions},
"src/routes/account/index": {pattern:"/account/",options:view13.routeOptions},
"src/routes/account/integrations": {pattern:"/account/integrations",options:view14.routeOptions},
"src/routes/account/notes": {pattern:"/account/notes",options:view15.routeOptions},
"src/routes/account/submissions": {pattern:"/account/submissions",options:view16.routeOptions},
"src/routes/admin/audit": {pattern:"/admin/audit",options:view17.routeOptions},
"src/routes/admin/chat-access": {pattern:"/admin/chat-access",options:view18.routeOptions},
"src/routes/admin/docs": {pattern:"/admin/docs",options:view19.routeOptions},
"src/routes/admin/feedback_.$id": {pattern:"/admin/feedback_/$id",options:view20.routeOptions},
"src/routes/admin/feedback.index": {pattern:"/admin/feedback/",options:view21.routeOptions},
"src/routes/admin/github-stats": {pattern:"/admin/github-stats",options:view22.routeOptions},
"src/routes/admin/index": {pattern:"/admin/",options:view23.routeOptions},
"src/routes/admin/intent": {pattern:"/admin/intent",options:view24.routeOptions},
"src/routes/admin/logins": {pattern:"/admin/logins",options:view25.routeOptions},
"src/routes/admin/notes.index": {pattern:"/admin/notes/",options:view26.routeOptions},
"src/routes/admin/npm-stats": {pattern:"/admin/npm-stats",options:view27.routeOptions},
"src/routes/admin/roles.$roleId": {pattern:"/admin/roles/$roleId",options:view28.routeOptions},
"src/routes/admin/roles.index": {pattern:"/admin/roles/",options:view29.routeOptions},
"src/routes/admin/route": {pattern:"/admin",options:view30.routeOptions},
"src/routes/admin/showcases_.$id": {pattern:"/admin/showcases_/$id",options:view31.routeOptions},
"src/routes/admin/showcases.index": {pattern:"/admin/showcases/",options:view32.routeOptions},
"src/routes/admin/users.$userId": {pattern:"/admin/users/$userId",options:view33.routeOptions},
"src/routes/admin/users": {pattern:"/admin/users",options:view34.routeOptions},
"src/routes/application-starter.docs": {pattern:"/application-starter/docs",options:view35.routeOptions},
"src/routes/application-starter.index": {pattern:"/application-starter/",options:view36.routeOptions},
"src/routes/application-starter": {pattern:"/application-starter",options:view37.routeOptions},
"src/routes/auth/cli": {pattern:"/auth/cli",options:view38.routeOptions},
"src/routes/auth/popup-success": {pattern:"/auth/popup-success",options:view39.routeOptions},
"src/routes/chat-access": {pattern:"/chat-access",options:view40.routeOptions},
"src/routes/chat.b.$botId": {pattern:"/chat/b/$botId",options:view41.routeOptions},
"src/routes/chat.c.$conversationId": {pattern:"/chat/c/$conversationId",options:view42.routeOptions},
"src/routes/chat.charts": {pattern:"/chat/charts",options:view43.routeOptions},
"src/routes/chat.index": {pattern:"/chat/",options:view44.routeOptions},
"src/routes/chat.p.$hash": {pattern:"/chat/p/$hash",options:view45.routeOptions},
"src/routes/chat.shared": {pattern:"/chat/shared",options:view46.routeOptions},
"src/routes/chat": {pattern:"/chat",options:view47.routeOptions},
"src/routes/chat.w.$workspaceId": {pattern:"/chat/w/$workspaceId",options:view48.routeOptions},
"src/routes/community-projects": {pattern:"/community-projects",options:view49.routeOptions},
"src/routes/dashboard": {pattern:"/dashboard",options:view50.routeOptions},
"src/routes/ds.avatar": {pattern:"/ds/avatar",options:view51.routeOptions},
"src/routes/ds.badges": {pattern:"/ds/badges",options:view52.routeOptions},
"src/routes/ds.breadcrumbs": {pattern:"/ds/breadcrumbs",options:view53.routeOptions},
"src/routes/ds.buttons": {pattern:"/ds/buttons",options:view54.routeOptions},
"src/routes/ds.cards": {pattern:"/ds/cards",options:view55.routeOptions},
"src/routes/ds.colors": {pattern:"/ds/colors",options:view56.routeOptions},
"src/routes/ds.dialog": {pattern:"/ds/dialog",options:view57.routeOptions},
"src/routes/ds.drawer": {pattern:"/ds/drawer",options:view58.routeOptions},
"src/routes/ds.dropdown": {pattern:"/ds/dropdown",options:view59.routeOptions},
"src/routes/ds.effects": {pattern:"/ds/effects",options:view60.routeOptions},
"src/routes/ds.eyebrow": {pattern:"/ds/eyebrow",options:view61.routeOptions},
"src/routes/ds.index": {pattern:"/ds/",options:view62.routeOptions},
"src/routes/ds.inputs": {pattern:"/ds/inputs",options:view63.routeOptions},
"src/routes/ds.logos": {pattern:"/ds/logos",options:view64.routeOptions},
"src/routes/ds.navbar": {pattern:"/ds/navbar",options:view65.routeOptions},
"src/routes/ds.overlays": {pattern:"/ds/overlays",options:view66.routeOptions},
"src/routes/ds.page-header": {pattern:"/ds/page-header",options:view67.routeOptions},
"src/routes/ds.palette": {pattern:"/ds/palette",options:view68.routeOptions},
"src/routes/ds.panel": {pattern:"/ds/panel",options:view69.routeOptions},
"src/routes/ds.partner-rail": {pattern:"/ds/partner-rail",options:view70.routeOptions},
"src/routes/ds.semantic": {pattern:"/ds/semantic",options:view71.routeOptions},
"src/routes/ds.shadows": {pattern:"/ds/shadows",options:view72.routeOptions},
"src/routes/ds.spinner": {pattern:"/ds/spinner",options:view73.routeOptions},
"src/routes/ds.stats": {pattern:"/ds/stats",options:view74.routeOptions},
"src/routes/ds.tabs": {pattern:"/ds/tabs",options:view75.routeOptions},
"src/routes/ds.takeover": {pattern:"/ds/takeover",options:view76.routeOptions},
"src/routes/ds": {pattern:"/ds",options:view77.routeOptions},
"src/routes/ds.typography": {pattern:"/ds/typography",options:view78.routeOptions},
"src/routes/explore": {pattern:"/explore",options:view79.routeOptions},
"src/routes/feedback-leaderboard": {pattern:"/feedback-leaderboard",options:view80.routeOptions},
"src/routes/intent/registry/$packageName.$skillName": {pattern:"/intent/registry/$packageName/$skillName",options:view81.routeOptions},
"src/routes/intent/registry/$packageName.index": {pattern:"/intent/registry/$packageName/",options:view82.routeOptions},
"src/routes/intent/registry/$packageName": {pattern:"/intent/registry/$packageName",options:view83.routeOptions},
"src/routes/intent/registry/index": {pattern:"/intent/registry/",options:view84.routeOptions},
"src/routes/libraries_.$framework": {pattern:"/libraries_/$framework",options:view85.routeOptions},
"src/routes/libraries": {pattern:"/libraries",options:view86.routeOptions},
"src/routes/login": {pattern:"/login",options:view87.routeOptions},
"src/routes/maintainers": {pattern:"/maintainers",options:view88.routeOptions},
"src/routes/oauth/authorize": {pattern:"/oauth/authorize",options:view89.routeOptions},
"src/routes/partners.$partner": {pattern:"/partners/$partner",options:view90.routeOptions},
"src/routes/partners.index": {pattern:"/partners/",options:view91.routeOptions},
"src/routes/partners": {pattern:"/partners",options:view92.routeOptions},
"src/routes/shop.$handle": {pattern:"/shop/$handle",options:view93.routeOptions},
"src/routes/shop.cart": {pattern:"/shop/cart",options:view94.routeOptions},
"src/routes/shop.collections.$handle": {pattern:"/shop/collections/$handle",options:view95.routeOptions},
"src/routes/shop.index": {pattern:"/shop/",options:view96.routeOptions},
"src/routes/shop.pages.$handle": {pattern:"/shop/pages/$handle",options:view97.routeOptions},
"src/routes/shop.policies.$handle": {pattern:"/shop/policies/$handle",options:view98.routeOptions},
"src/routes/shop.products.$handle": {pattern:"/shop/products/$handle",options:view99.routeOptions},
"src/routes/shop.search": {pattern:"/shop/search",options:view100.routeOptions},
"src/routes/shop": {pattern:"/shop",options:view101.routeOptions},
"src/routes/showcase/$id": {pattern:"/showcase/$id",options:view102.routeOptions},
"src/routes/showcase/edit.$id": {pattern:"/showcase/edit/$id",options:view103.routeOptions},
"src/routes/showcase/index": {pattern:"/showcase/",options:view104.routeOptions},
"src/routes/showcase/submit": {pattern:"/showcase/submit",options:view105.routeOptions},
"src/routes/sponsors-embed": {pattern:"/sponsors-embed",options:view106.routeOptions},
"src/routes/stack.$category": {pattern:"/stack/$category",options:view107.routeOptions},
"src/routes/stats/npm/$packages": {pattern:"/stats/npm/$packages",options:view108.routeOptions},
"src/routes/stats/npm/embed": {pattern:"/stats/npm/embed",options:view109.routeOptions},
"src/routes/stats/npm/index": {pattern:"/stats/npm/",options:view110.routeOptions},
"src/routes/workshops": {pattern:"/workshops",options:view111.routeOptions},
}
