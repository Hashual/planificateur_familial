import { Family, FamilyMember } from "@/types/Family";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = 'http://192.168.1.40:3000';

export type API_RESPONSE<T> = {
    code: number;
    message: string;
    data:  T
}

type shoppingListArticles = {
    id: number;
    title: string;
    quantity: number;
    dueDate: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    shoppingListId: number;
}


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
        numberOfInProgressArticles: number;
        createdAt: Date;
        updatedAt: Date;
        articles: Array<shoppingListArticles>
    },
    '/shopping-list': {
        id: number;
        title: string;
        numberOfArticles: number;
        numberOfInProgressArticles: number;
        createdAt: Date;
        updatedAt: Date;
    }[],
    '/families': Family[],
    '/families/[id]': Family,
    '/families/[id]/members': FamilyMember[]
}

type QueryType = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    searchParams?: {[key: string]: string | number}
}

// TODO: Update type of query parameter
export async function useFetchQuery<T>(path: string, query: QueryType) {
    const url = new URL(`${BASE_URL}${path}`);

    Object.entries(query.searchParams ?? {}).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
    });

    const token = await AsyncStorage.getItem("session-token");

    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    return await fetch(url.toString(), {
        method: query.method as string,
        body: typeof query.body == "object" ? JSON.stringify(query.body) : undefined,   
        headers: headers
    }).then(res => res.json() as unknown as API_RESPONSE<T>);
}