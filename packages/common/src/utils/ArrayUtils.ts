export default class ArrayUtils {
    public static sort<T>(array: T[], key: string, asc: boolean): void {
        array.sort((a: T, b: T) => {
            if (asc) {
                return a[key] - b[key];
            }
            return b[key] - a[key];
        });
    }

    public static min<T>(array: T[], key: string): T {
        if (!array.length) {
            return null;
        }
        let min = array[0];
        if (array.length === 1) {
            return min;
        }
        for (let i = 1; i < array.length; i++) {
            const item = array[i];
            if (item[key] < min[key]) {
                min = item;
            }
        }
        return min;
    }

    public static max<T>(array: T[], key: string): T {
        if (!array.length) {
            return null;
        }
        let max = array[0];
        if (array.length === 1) {
            return max;
        }
        for (let i = 1; i < array.length; i++) {
            const item = array[i];
            if (item[key] > max[key]) {
                max = item;
            }
        }
        return max;
    }

    public static toTree<T>(
        array: T[],
        keyName: string,
        parentKeyName: string,
        childrenName: string,
        rootId: number,
    ): T[] {
        if (!array || !array.length) {
            return [];
        }
        const dummy: T = { [keyName]: rootId } as T;
        const list = [dummy, ...array];
        for (const item of list) {
            for (const child of list) {
                if (item[keyName] !== child[parentKeyName]) {
                    continue;
                }
                if (!item[childrenName]) {
                    item[childrenName] = [];
                }
                item[childrenName].push(child);
            }
        }
        return dummy[childrenName];
    }
}
