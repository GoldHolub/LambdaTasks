// @ts-check
export default {};
Array.prototype.multiply = function (factor = 10) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        const item = this[i];
        if (typeof item !== 'number') {
            throw new Error('The array must contain only numeric values.');
        }
        result.push(item * factor);
    }
    return result;
};
Array.prototype.any = function (predicate) {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) {
            return true;
        }
    }
    return false;
};
Array.prototype.all = function (predicate) {
    for (let i = 0; i < this.length; i++) {
        if (!predicate(this[i])) {
            return false;
        }
    }
    return true;
};
Array.prototype.associateBy = function (keySelector, valueTransform) {
    const resultMap = new Map();
    for (const item of this) {
        const key = keySelector(item);
        const value = valueTransform ? valueTransform(item) : item;
        resultMap.set(key, value);
    }
    return resultMap;
};
Array.prototype.groupBy = function (keySelector, valueTransform) {
    const resultMap = new Map();
    for (const item of this) {
        const key = keySelector(item);
        const existingMap = resultMap.get(key) || [];
        const value = valueTransform ? valueTransform(item) : item;
        existingMap.push(value);
        resultMap.set(key, existingMap);
    }
    return resultMap;
};
Array.prototype.average = function () {
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
        sum += this[i];
    }
    return (sum / this.length);
};
Array.prototype.chunked = function (size) {
    const result = [];
    let chunk = [];
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
};
Array.prototype.distinctBy = function (selector) {
    const resultMap = new Map();
    for (const item of this) {
        const key = selector(item);
        if (!resultMap.has(key)) {
            resultMap.set(key, item);
        }
    }
    return Array.from(resultMap.values());
};
Array.prototype.myFilter = function (predicate) {
    const result = [];
    for (const item of this) {
        if (predicate(item)) {
            result.push(item);
        }
    }
    return result;
};
Array.prototype.filterIndexed = function (predicate) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (predicate(i, this[i])) {
            result.push(this[i]);
        }
    }
    return result;
};
Array.prototype.filterNot = function (predicate) {
    const result = [];
    for (const item of this) {
        if (!predicate(item)) {
            result.push(item);
        }
    }
    return result;
};
Array.prototype.myFind = function (predicate) {
    for (const item of this) {
        if (predicate(item)) {
            return item;
        }
    }
    return null;
};
Array.prototype.findLast = function (predicate) {
    let lastResult = null;
    for (const item of this) {
        if (predicate(item)) {
            lastResult = item;
        }
    }
    return lastResult;
};
Array.prototype.flatten = function () {
    const result = [];
    for (const seq of this) {
        for (const item of seq) {
            result.push(item);
        }
    }
    return result;
};
Array.prototype.fold = function (initial, operation) {
    let accumulator = initial;
    for (const item of this) {
        accumulator = operation(accumulator, item);
    }
    return accumulator;
};
Array.prototype.maxBy = function (selector) {
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
};
Array.prototype.minBy = function (selector) {
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
};
Array.prototype.count = function (selector) {
    if (this.length === 0) {
        throw new Error('Sequence is empty');
    }
    let sum = selector(this[0]);
    for (let i = 1; i < this.length; i++) {
        sum += selector(this[i]);
    }
    return sum;
};
function isThree(item) {
    if (item == 3) {
        return true;
    }
    return false;
}
const arrayOfNumbers = [3, 3, 3, 2.5, 3, 2, 4];
console.log(arrayOfNumbers.any(isThree));
const scientists = [
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
console.log(numbers.myFind(num => num > 2 && num % 2 == 0));
console.log(numbers.findLast(num => num > 2 && num % 2 == 0));
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
const cities = [
    { population: 100000 },
    { population: 200000 },
    { population: 150000 },
];
console.log(cities.count((city) => city.population));
//# sourceMappingURL=CustomArrayApp.js.map