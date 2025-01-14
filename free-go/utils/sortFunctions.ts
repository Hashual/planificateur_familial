import { Task, Article } from "@/mockapi/types";

type SortOrder = 'asc' | 'desc';

type Comparator<T> = (a: T, b: T) => number;

/**
 * Function to sort an array of Task by a specified key.
 * @param array - The array to be sorted.
 * @param key - The key of the object used for sorting.
 * @param order - The order of sorting ('asc' for ascending, 'desc' for descending). Default is 'asc'.
 * @returns A new sorted array of type Task.
 */
export function sortTask(
  array: Task[],
  key: keyof Task,
  order: SortOrder = 'asc'
): Task[] {
  const comparator: Comparator<Task> = (a, b) => {
    if (a[key] == null) return order === 'asc' ? 1 : -1;
    if (b[key] == null) return order === 'asc' ? -1 : 1;
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  };

  return [...array].sort(comparator);
}

/**
 * Function to sort an array of Article by a specified key.
 * @param array - The array to be sorted.
 * @param key - The key of the object used for sorting.
 * @param order - The order of sorting ('asc' for ascending, 'desc' for descending). Default is 'asc'.
 * @returns A new sorted array of type Article.
 */
export function sortArticle(
  array: Article[],
  key: keyof Article,
  order: SortOrder = 'asc'
): Article[] {
  const comparator: Comparator<Article> = (a, b) => {
    if (a[key] == null) return order === 'asc' ? 1 : -1;
    if (b[key] == null) return order === 'asc' ? -1 : 1;
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  };

  return [...array].sort(comparator);
}
