/**
 * Напишите функцию, которая проверяет, является ли число целым используя побитовые операторы
 * @param {*} n
 */
function isInteger(n) {
    // побитовое ИЛИ гонит число через ToInt32: дробь отваливается, но и всё за пределами ±2^31 тоже — это цена побитовых из ТЗ
    return (n | 0) === n;
}

/**
 * Напишите функцию, которая возвращает массив четных чисел от 2 до 20 включительно
 */
function even() {
    const result = [];
    for (let i = 2; i <= 20; i += 2) result.push(i);
    return result;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя цикл
 * @param {*} n
 */
function sumTo(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) sum += i;
    return sum;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя рекурсию
 * @param {*} n
 */
function recSumTo(n) {
    // база на n <= 0 заодно спасает от 0 и минусов, иначе рекурсия ушла бы в минус бесконечно
    if (n <= 0) return 0;
    return n + recSumTo(n - 1);
}

/**
 * Напишите функцию, считающую факториал заданного числа
 * @param {*} n
 */
function factorial(n) {
    // способ в ТЗ не задан, беру цикл — так глубина стека вообще не важна
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

/**
 * Напишите функцию, которая определяет, является ли число двойкой, возведенной в степень
 * @param {*} n
 */
function isBinary(n) {
    // не через n & (n - 1): побитовые режут до int32 и врут на 1.5 и 3 * 2 ** 32, а тут ТЗ побитовые не требует
    if (n < 1) return false;
    while (n % 2 === 0) n /= 2;
    return n === 1;
}

/**
 * Напишите функцию, которая находит N-е число Фибоначчи
 * @param {*} n
 */
function fibonacci(n) {
    let a = 0,
        b = 1;
    for (let i = 0; i < n; i++) [a, b] = [b, a + b];
    return a;
}

/** Напишите функцию, которая принимает начальное значение и функцию операции
 * и возвращает функцию - выполняющую эту операцию.
 * Если функция операции (operatorFn) не задана - по умолчанию всегда
 * возвращается начальное значение (initialValue)
 * @param initialValue
 * @param operatorFn - (storedValue, newValue) => {operation}
 * @example
 * const sumFn =  getOperationFn(10, (a,b) => a + b);
 * console.log(sumFn(5)) - 15
 * console.log(sumFn(3)) - 18
 */
function getOperationFn(initialValue, operatorFn) {
    let stored = initialValue;
    return function (newValue) {
        // без operatorFn stored никто не меняет, так что это и есть initialValue
        if (typeof operatorFn !== 'function') return stored;
        stored = operatorFn(stored, newValue);
        return stored;
    };
}

/**
 * Напишите функцию создания генератора арифметической последовательности.
 * При ее вызове, она возвращает новую функцию генератор - generator().
 * Каждый вызов функции генератора возвращает следующий элемент последовательности.
 * Если начальное значение не передано, то оно равно 0.
 * Если шаг не указан, то по дефолту он равен 1.
 * Генераторов можно создать сколько угодно - они все независимые.
 *
 * @param {number} start - число с которого начинается последовательность
 * @param {number} step  - число шаг последовательности
 * @example
 * const generator = sequence(5, 2);
 * console.log(generator()); // 5
 * console.log(generator()); // 7
 * console.log(generator()); // 9
 */
function sequence(start = 0, step = 1) {
    let current = start;
    // "генератор" тут по смыслу, не function*: по примеру из ТЗ generator() сразу отдаёт число, а не {value, done}
    return () => {
        const value = current;
        current += step;
        return value;
    };
}

/**
 * Напишите функцию deepEqual, которая принимает два значения
 * и возвращает true только в том случае, если они имеют одинаковое значение
 * или являются объектами с одинаковыми свойствами,
 * значения которых также равны при сравнении с рекурсивным вызовом deepEqual.
 * Учитывать специфичные объекты(такие как Date, RegExp и т.п.) не обязательно
 *
 * @param {object} firstObject - первый объект
 * @param {object} secondObject - второй объект
 * @returns {boolean} - true если объекты равны(по содержанию) иначе false
 * @example
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 33], text: 'text'}) // true
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 3], text: 'text2'}) // false
 */
function deepEqual(firstObject, secondObject) {
    if (firstObject === secondObject) return true;
    // одинаковое значение = как в Set/Map (SameValueZero): NaN равен NaN, 0 равен -0
    if (firstObject !== firstObject && secondObject !== secondObject)
        return true;
    if (
        typeof firstObject !== 'object' ||
        firstObject === null ||
        typeof secondObject !== 'object' ||
        secondObject === null
    ) {
        return false;
    }
    if (Array.isArray(firstObject) !== Array.isArray(secondObject))
        return false;
    const keysA = Object.keys(firstObject);
    const keysB = Object.keys(secondObject);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(
        (key) =>
            Object.prototype.hasOwnProperty.call(secondObject, key) &&
            deepEqual(firstObject[key], secondObject[key])
    );
}

module.exports = {
    isInteger,
    even,
    sumTo,
    recSumTo,
    factorial,
    isBinary,
    fibonacci,
    getOperationFn,
    sequence,
    deepEqual,
};
