// @ts-check
export default {};

declare global {
    interface Array<T> {
        /**
        * This method multiplies each element of the array by a specified factor.
        *
        * By default each element will be multiplied by 10
        * @param {number} factor - The numeric factor by which to multiply each element.
        * @returns A new array containing the multiplied values.
        */
        multiply<T extends number>(this: T[], factor?: number): number[];

        /**
        * Checks if at least one element in the array satisfies the specified predicate.
        *
        * @param {Predicate<T>} predicate - The predicate function to apply to each element.
        * @returns {boolean} `true` if at least one element satisfies the predicate; otherwise, `false`.
        *
        * @example
        * const fruits = ['🍏', '🍎', '🍐', '🍊', '🍌'];
        * const isAtLeastOneFruit = fruits.any((item) => isFruit(item));
        * // isAtLeastOneFruit will be true if there is at least one fruit.
        */
        any(predicate: Predicate<T>): boolean;

        /**
        * Checks if all elements in the array satisfy the specified predicate.
        *
        * @param {Predicate<T>} predicate - The predicate function to apply to each element.
        * @returns {boolean} `true` if all elements satisfy the predicate; otherwise, `false`.
        *
        * @example
        * const fruits = ['🍏', '🍎', '🍐', '🍊', '🍌'];
        * const isAllFruits = fruits.all((item) => isFruit(item));
        * // isAllFruits will be true if all elements are fruits.
         */
        all(predicate: Predicate<T>): boolean;

        /**
         * Returns a Map containing key-value pairs provided by the transform function
         * applied to elements of the given sequence.
         *
         * If any two elements would have the same key returned by the `keySelector`,
         * the last one gets added to the map.
         *
         * The returned map preserves the entry iteration order of the original sequence.
         *
         * @param {(item: T) => K} keySelector The function to extract keys from elements.
         * @param {(item: T) => V} [valueTransform] The function to transform elements into values (optional).
         * @returns {Map<K, V>} A Map containing key-value pairs.
         */
        associateBy<T, K, V>(this: T[],
            keySelector: (item: T) => K,
            valueTransform?: (item: T) => V): Map<K, V>;

        /**
         * Groups elements of the original sequence by the key returned by the given `keySelector`
         * function applied to each element and returns a map where each group key is associated
         * with a list of corresponding elements.
         *
         * If any two    elements would have the same key returned by `keySelector`, the last one
         * gets added to the map.
         *
         * The returned map preserves the entry iteration order of the keys produced from the
         * original sequence.
         *
         * @param {(item: T) => K} keySelector The function to extract keys from elements.
         * @param {(item: T) => V} valueTransform The function to transform one element to another (optional).
         * @returns {Map<K, T[]>} A Map containing key-value pairs.
         */
        groupBy<T, K, V>(this: T[],
            keySelector: (item: T) => K,
            valueTransform?: (item: T) => V): Map<K, V[]>;

        /**
         * Calculates the average value of numeric elements in the array.
         *
         * @template T The type of elements in the array (must extend `number`).
         * @returns {number} The average value.
         */
        average<T extends number>(this: T[]): number;

        /**
         * Splits an array into a sequence of lists, each not exceeding the given size.
         *
         * The last list in the resulting sequence may have fewer elements than the given size.
         *
         * @param {number} size The number of elements to take in each list (must be positive).
         * @returns {T[][]} An array of lists containing chunks of elements.
         */
        chunked<T>(this: T[], size: number): T[][];

        /**
         * Returns an array containing only elements from the given array having distinct keys
         * returned by the given selector function.
         *
         * Among elements of the given array with equal keys, only the first one will be present
         * in the resulting array. The elements in the resulting array are in the same order
         * as they were in the source array.
         *
         * @param {(item: T) => K} selector The function to extract keys from elements.
         * @returns {T[]} An array containing distinct elements based on the keys.
         */
        distinctBy<T, K>(this: T[], selector: (item: T) => K): T[];

        /**
         * Returns an array containing only elements from the given array that match the given predicate.
         *
         * @param {(item: T) => boolean} predicate The function to test each element.
         * @returns {T[]} An array containing elements that satisfy the predicate.
         */
        myFilter<T>(this: T[], predicate: (item: T) => boolean): T[];

        /**
         * Returns an array containing only elements from the given array that match the given predicate.
         *
         * @param {(index: number, item: T) => boolean} predicate The function to test each element.
         * @returns {T[]} An array containing elements that satisfy the predicate.
         */
        filterIndexed<T>(this: T[], predicate: (index: number, item: T) => boolean): T[];

        /**
         * Returns an array containing only elements from the given array that NOT match the given predicate.
         *
         * @param {(item: T) => boolean} predicate The function to test each element.
         * @returns {T[]} An array containing elements that satisfy the predicate.
         */
        filterNot<T>(this: T[], predicate: (item: T) => boolean): T[];

        /**
         * Returns the first element from the given array that matches the given predicate,
         * or null if no such element was found.
         *
         * @param {(item: T) => boolean} predicate The function to test each element.
         * @returns {T | null} The first matching element or null if not found.
         */
        myFind<T>(this: T[], predicate: (item: T) => boolean): T | null;

        /**
         * Returns the LAST element from the given array that matches the given predicate,
         * or null if no such element was found.
         *
         * @param {(item: T) => boolean} predicate The function to test each element.
         * @returns {T | null} The first matching element or null if not found.
         */
        findLast<T>(this: T[], predicate: (item: T) => boolean): T | null;

        /**
         * Returns an array containing all elements from all sequences in the given array of sequences.
         *
         * @returns {T[]} An array containing all elements from all sequences.
         */
        flatten<T>(this: T[][]): T[];

        /**
         * Accumulates a value starting with an initial value and applying an operation from left to right
         * to the current accumulator value and each element in the array.
         *
         * Returns the specified initial value if the sequence is empty.
         *
         * @param {R} initial The initial value for accumulation.
         * @param {(acc: R, item: T) => R} operation The function to apply to each element.
         * @returns {R} The accumulated value.
         */
        fold<T, R>(this: T[], initial: R, operation: (acc: R, item: T) => R): R;

        /**
         * Returns the first element from the given array that yields the largest value
         * based on the provided selector function.
         *
         * @param {(item: T) => R} selector The function to extract values from elements.
         * @returns {T} The element with the largest value based on the selector function.
         * @throws {Error} Throws an error if the sequence is empty.
         */
        maxBy<T, R>(this: T[], selector: (item: T) => R): T;

        /**
         * Returns the first element from the given array that yields the smallest value
         * based on the provided selector function.
         *
         * @param {(item: T) => R} selector The function to extract values from elements.
         * @returns {T} The element with the smallest value based on the selector function.
         * @throws {Error} Throws an error if the sequence is empty.
         */
        minBy<T, R>(this: T[], selector: (item: T) => R): T;

        /**
         * Calculates the sum of a numeric property across all elements in the array.
         * @param {function(T): number} selector - A function that extracts the numeric value from each element.
         * @throws {Error} Throws an error if the array is empty.
         * @returns {number} The sum of the selected numeric property.
         */
        count<T>(this: T[], selector: (item: T) => number): number;
    }
}

interface Predicate<T> {
    (item: T): boolean;
}

Array.prototype.multiply = function <T extends number>(this: T[], factor = 10): number[] {
    const result: number[] = [];
    for (let i = 0; i < this.length; i++) {
        const item = this[i];
        if (typeof item !== 'number') {
            throw new Error('The array must contain only numeric values.');
        }
        result.push(item * factor);
    }
    return result;
};

Array.prototype.any = function <T>(this: T[], predicate: Predicate<T>): boolean {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) {
            return true;
        }
    }
    return false;
}

Array.prototype.all = function <T>(this: T[], predicate: Predicate<T>): boolean {
    for (let i = 0; i < this.length; i++) {
        if (!predicate(this[i])) {
            return false;
        }
    }
    return true;
}

Array.prototype.associateBy = function <T, K, V>(this: T[],
    keySelector: (item: T) => K,
    valueTransform?: (item: T) => V): Map<K, V> {
    const resultMap = new Map<K, V>();
    for (const item of this) {
        const key = keySelector(item);
        const value = valueTransform ? valueTransform(item) : item;
        resultMap.set(key, value as V);
    }
    return resultMap;
}

Array.prototype.groupBy = function <T, K, V>(this: T[],
    keySelector: (item: T) => K,
    valueTransform?: (item: T) => V): Map<K, V[]> {
    const resultMap = new Map<K, V[]>();
    for (const item of this) {
        const key = keySelector(item);
        const existingMap = resultMap.get(key) || [];
        const value = valueTransform ? valueTransform(item) : item;
        existingMap.push(value as V);
        resultMap.set(key, existingMap);
    }
    return resultMap;
}

Array.prototype.average = function <T extends number>(this: T[]): number {
    let sum: number = 0;
    for (let i = 0; i < this.length; i++) {
        sum += this[i];
    }
    return (sum / this.length);
}

Array.prototype.chunked = function <T>(this: T[], size: number): T[][] {
    const result: T[][] = [];
    let chunk: T[] = [];
    for (let i = 0; i < this.length; i++) {
        chunk.push(this[i]);
        if (chunk.length === size) {
            result.push(chunk);
            chunk = [];
        }
    }
    if (chunk.length > 0) {
        result.push(chunk);
    }
    return result;
}

Array.prototype.distinctBy = function <T, K>(this: T[], selector: (item: T) => K): T[] {
    const resultMap = new Map<K, T>();
    for (const item of this) {
        const key = selector(item);
        if (!resultMap.has(key)) {
            resultMap.set(key, item);
        }
    }
    return Array.from(resultMap.values());
}

Array.prototype.myFilter = function <T>(this: T[], predicate: (item: T) => boolean): T[] {
    const result: T[] = [];
    for (const item of this) {
        if (predicate(item)) {
            result.push(item);
        }
    }
    return result;
}

Array.prototype.filterIndexed = function <T>(this: T[], predicate: (index: number, item: T) => boolean): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.length; i++) {
        if (predicate(i, this[i])) {
            result.push(this[i]);
        }
    }
    return result;
}

Array.prototype.filterNot = function <T>(this: T[], predicate: (item: T) => boolean): T[] {
    const result: T[] = [];
    for (const item of this) {
        if (!predicate(item)) {
            result.push(item);
        }
    }
    return result;
}

Array.prototype.myFind = function <T>(this: T[], predicate: (item: T) => boolean): T | null {
    for (const item of this) {
        if (predicate(item)) {
            return item;
        }
    }
    return null;
}

Array.prototype.findLast = function <T>(this: T[], predicate: (item: T) => boolean): T | null {
    let lastResult: T | null = null; 
    for (const item of this) {
        if (predicate(item)) {
            lastResult = item;
        }
    }
    return lastResult;
}

Array.prototype.flatten = function <T>(this: T[][]): T[] {
    const result: T[] = [];
    for (const seq of this) {
        for (const item of seq) {
            result.push(item);
        }
    }
    return result;
}

Array.prototype.fold = function <T, R>(this: T[], initial: R, operation: (acc: R, item: T) => R): R {
    let accumulator = initial;
    for (const item of this) {
        accumulator = operation(accumulator, item);
    }
    return accumulator;
}

Array.prototype.maxBy = function <T, R>(this: T[], selector: (item: T) => R): T {
    if (this.length === 0) {
        throw new Error('Sequence is empty');
    }
    let maxItem = this[0];
    let maxValue = selector(maxItem);
    for (const item of this) {
        const value = selector(item);
        if (value > maxValue) {
            maxItem = item;
            maxValue = value;
        }
    }
    return maxItem;
}

Array.prototype.minBy = function <T, R>(this: T[], selector: (item: T) => R): T {
    if (this.length === 0) {
        throw new Error('Sequence is empty');
    }
    let minItem = this[0];
    let minValue = selector(minItem);
    for (const item of this) {
        const value = selector(item);
        if (value < minValue) {
            minItem = item;
            minValue = value;
        }
    }
    return minItem;
}

Array.prototype.count = function <T>(this: T[], selector: (item: T) => number): number {
    if (this.length === 0) {
        throw new Error('Sequence is empty');
    }
    let sum = selector(this[0]);
    for (let i = 1; i < this.length; i++) {
        sum += selector(this[i]);        
    }
    return sum;
}

function isThree(item: number) {
    if (item == 3) {
        return true;
    }
    return false;
}
const arrayOfNumbers: number[] = [3, 3, 3, 2.5, 3, 2, 4];
console.log(arrayOfNumbers.any(isThree));

interface Person {
    firstName: string;
    lastName: string;
}

const scientists: Person[] = [
    { firstName: 'Grace', lastName: 'Hopper' },
    { firstName: 'Jacob', lastName: 'Bernoulli' },
    { firstName: 'Johann', lastName: 'Bernoulli' },
];

console.log(scientists.associateBy((persone) => persone.lastName));

const data = [
    { emoji: "😀", sad: false },
    { emoji: "🥲", sad: false },
    { emoji: "🥲", sad: true }
];

console.log(data.groupBy((entry) => entry.sad ? "sad" : "happy"));
console.log(arrayOfNumbers.average());
console.log(arrayOfNumbers.chunked(2));

const charArray = ['a', 'd', 'f', 'F', 'a', 'a', 'b', 'B', 'B', 'b'];
console.log(charArray.distinctBy((char) => char.toUpperCase()));
console.log(arrayOfNumbers.myFilter(num => num % 2 == 0));

const numbers = [0, 1, 2, 3, 4, 8, 6];
console.log(numbers.filterIndexed((index, i) => index === i));
console.log(numbers.filterNot(num => num % 2 == 0));
console.log(numbers.myFind(num =>  num > 2 && num % 2 == 0));
console.log(numbers.findLast(num =>  num > 2 && num % 2 == 0));

const numbers2 = [[0, 1, 2, 3, 4, 8, 6], [0, 12, 24, 48], [-0, 4]];
console.log(numbers2.flatten());
console.log(numbers.fold(100, (accumulator, num) => accumulator + num));

const students = [
    { name: 'Alice', score: 92 },
    { name: 'Bob', score: 108 },
    { name: 'Carol', score: -112 },
];

console.log(students.maxBy((student) => student.score));
console.log(students.minBy((student) => student.score));

interface City {
    population: number;
}
const cities: City[] = [
    { population: 100000 },
    { population: 200000 },
    { population: 150000 },
];

console.log(cities.count((city) => city.population));
