const BASE_URL = 'http://localhost:3000';

export type API = {
    '/todo-list': {
        id: number;
        title: string;
        tasksAmount: number;
        tasksInProgressAmount: number;
        createdAt: Date;
        updatedAt: Date;
    },
    '/todo-list/[id]': {
        id: number;
        title: string;
        tasksAmount: number;
        tasksInProgressAmount: number;
        createdAt: Date;
        updatedAt: Date;
    },
    '/todo-list/[id]/tasks/[taskId]': {
        id: number;
        title: string;
        date: Date;
        completedDate: Date;
        createdAt: Date;
        updatedAt: Date;
    },
    '/shoppinglists/[id]': {
        id: number;
        title: string;
        numberOfArticles: number;
        createdAt: Date;
        updatedAt: Date;
    },
    '/shopping-list': {
        id: number;
        title: string;
        numberOfArticles: number;
        numberOfInProgressArticles: number;
        createdAt: Date;
        updatedAt: Date;
    }[],


}


export async function useFetchQuery<T extends keyof API>(path: string, query: Record<string, string | number> = {}) {
    const url = new URL(`${BASE_URL}${path}`);

    if (query.method) {
        console.log(query.body)
        return await fetch(url.toString(), {
            method: query.method as string,
            body: JSON.stringify(query.body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json() as unknown as API[T]);
    } else {
        Object.entries(query).forEach(([key, value]) => {
            url.searchParams.append(key, value.toString());
        });

        return await fetch(url.toString()).then(res => res.json() as unknown as API[T]);
    }
}