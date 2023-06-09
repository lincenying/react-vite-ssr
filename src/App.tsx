import type { Request, Response } from 'express'
import { Route, Routes } from 'react-router-dom'
import type { AppRoutes } from './routes'
import type { AppStore } from './store'
import { RootContext } from './store'

export function App({ store, routes }: { store: AppStore; routes: AppRoutes }) {
    return (
        <>
            <RootContext.Provider value={store}>
                <Routes>
                    {routes.map(({ path, component: RouteComp }) => (
                        <Route key={path} path={path} element={<RouteComp />} />
                    ))}
                </Routes>
            </RootContext.Provider>
        </>
    )
}

export interface RenderContext {
    req: Request
    res: Response
    template: string
    html?: string
    routes?: AppRoutes
    store?: AppStore
}

export type PrefetchContext = Omit<
    Required<RenderContext>,
    'req' | 'res' | 'template' | 'html'
> & { req: { originalUrl: string } }

export function prefetch(ctx: PrefetchContext) {
    const matched = ctx.routes.filter(
        each => each.path === ctx.req.originalUrl,
    )

    console.log(matched)

    const ps: Promise<void>[] = []

    matched.forEach((route) => {
        if (typeof route.prefetch === 'function')
            ps.push(route.prefetch(ctx))
    })

    return Promise.all(ps)
}
