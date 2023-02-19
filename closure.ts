import { tester } from './util';

/**
 * Challenge 1
 *
 * Create a function createFunction that creates and returns a function.
 * When that created function is called, it should print "hello". When
 * you think you completed createFunction, un-comment out those lines
 * in the code and run it to see if it works.
 */
function createFunction() {
  return function () {
    console.log('hello');
  };
}

const function1 = createFunction();

tester('Challenge 1', [[function1(), undefined]]);

/**
 * Challenge 2
 *
 * Create a function createFunctionPrinter that accepts one input and
 * returns a function. When that created function is called, it should
 * print out the input that was used when the function was created.
 */
function createFunctionPrinter(input: any) {
  return function () {
    console.log(input);
  };
}

const printSample = createFunctionPrinter('sample');
const printHello = createFunctionPrinter('hello');

tester('Challenge 2', [
  [printSample(), undefined],
  [printHello(), undefined],
]);

/**
 * Challenge 3
 *
 * Examine the code for the outer function. Notice that we are returning a
 * function and that function is using variables that are outside of its scope.
 *
 * Uncomment those lines of code. Try to deduce the output before executing.
 * Now we are going to create a function addByX that returns a function that
 * will add an input by x.
 *
 * Uncomment each of these lines one by one.
 * Before your do, guess what will be logged from each function call.
 */
function outer() {
  let counter = 0; // this variable is outside incrementCounter's scope
  function incrementCounter() {
    counter++;
    console.log('counter', counter);
  }
  return incrementCounter;
}

const willCounter = outer();
const jasCounter = outer();

tester(
  'Challenge 3 - Preview',
  [
    [willCounter(), undefined],
    [willCounter(), undefined],
    [willCounter(), undefined],

    [jasCounter(), undefined],
    [willCounter(), undefined],
  ],
  true,
);

function addByX(x: number) {
  return function (num: number) {
    return num + x;
  };
}

const addByTwo = addByX(2);
const addByThree = addByX(3);
const addByFour = addByX(4);

tester('Challenge 3', [
  [addByTwo(1), 3],
  [addByTwo(2), 4],
  [addByTwo(3), 5],

  [addByThree(1), 4],
  [addByThree(2), 5],

  [addByFour(4), 8],
  [addByFour(5), 9],
]);

/**
 * Challenge 4
 *
 * Write a function once that accepts a callback as input and returns a function.
 * When the returned function is called the first time, it should call the callback
 * and return that output. If it is called any additional times, instead of calling
 * the callback again it will simply return the output value from the first time it
 * was called.
 */
function once<T, U>(cb: (...args: U[]) => T) {
  const list: T[] = [];

  return function (...args: Parameters<typeof cb>) {
    if (list.length > 0) return list[0];

    const value = cb(...args);

    list.push(value);

    return value;
  };
}

const onceFunc = once(addByTwo);

tester('Challenge 4', [
  [onceFunc(4), 6],
  [onceFunc(10), 6],
  [onceFunc(9001), 6],
]);

/**
 * Challenge 5
 *
 * Write a function after that takes the number of times the callback
 * needs to be called before being executed as the first parameter and
 * the callback as the second parameter.
 */
function after(count: number, func: () => void) {
  let innerCnt = 0;
  return function () {
    innerCnt++;

    if (innerCnt === count) func();
  };
}

const called = function () {
  console.log('hello');
};
const afterCalled = after(3, called);

tester('Challenge 5', [
  [afterCalled(), undefined],
  [afterCalled(), undefined],
  [afterCalled(), undefined],
]);

/**
 * Challenge 6
 *
 * Write a function delay that accepts a callback as the first parameter
 * and the wait in milliseconds before allowing the callback to be invoked
 * as the second parameter. Any additional arguments after wait are provided
 * to func when it is invoked. HINT: research setTimeout();
 */
function delay(func: () => void, wait: number) {
  return function () {
    console.log('started');
    setTimeout(func, wait);
  };
}

tester('Challenge 6', []);

/**
 * Challenge 7
 *
 * Write a function rollCall that accepts an array of names and returns a function.
 * The first time the returned function is invoked, it should log the first name to
 * the console. The second time it is invoked, it should log the second name to the
 * console, and so on, until all names have been called. Once all names have been
 * called, it should log 'Everyone accounted for'.
 */
function rollCall(names: ReadonlyArray<string>) {
  let counter = 0;
  return function () {
    if (names.length === counter) return 'Everyone accounted for';
    counter++;

    return names[counter - 1];
  };
}

const rollCaller = rollCall(['Victoria', 'Juan', 'Ruth'] as const);

tester('Challenge 7', [
  [rollCaller(), 'Victoria'],
  [rollCaller(), 'Juan'],
  [rollCaller(), 'Ruth'],
  [rollCaller(), 'Everyone accounted for'],
]);

/**
 * Challenge 8
 *
 * Create a function saveOutput that accepts a function (that will accept one argument),
 * and a string (that will act as a password). saveOutput will then return a function
 * that behaves exactly like the passed-in function, except for when the password string
 * is passed in as an argument. When this happens, the returned function will return an
 * object with all previously passed-in arguments as keys, and the corresponding outputs
 * as values.
 */
function saveOutput<T extends string | number | symbol>(
  func: (val: T) => T,
  password: string,
) {
  type P = Parameters<typeof func>[0];
  type R = ReturnType<typeof func>;
  type StoreType = Record<P, R>;

  let store: StoreType = {} as StoreType;

  return (value: T | typeof password) => {
    if (value === password) return store;

    // this is very wrong but i am very lazy
    const input = value as T;

    const result = func(input);

    store = {
      ...store,
      [input]: result,
    };

    return result;
  };
}

const multiplyBy2 = function (num: number) {
  return num * 2;
};
const multBy2AndLog = saveOutput(multiplyBy2, 'boo');

tester('Challenge 8', [
  [multBy2AndLog(2), 4],
  [multBy2AndLog(9), 18],
  [multBy2AndLog('boo'), { 2: 4, 9: 18 }],
]);

/**
 * Challenge 9
 *
 * Create a function cycleIterator that accepts an array, and returns a function.
 * The returned function will accept zero arguments. When first invoked, the returned
 * function will return the first element of the array. When invoked a second time,
 * the returned function will return the second element of the array, and so forth.
 * After returning the last element of the array, the next invocation will return the
 * first element of the array again, and continue on with the second after that, and so forth.
 */
function cycleIterator<T>(array: ReadonlyArray<T>) {
  let counter = 0;

  return function () {
    const retVal = array[counter];

    counter++;
    if (counter >= array.length) counter = 0;

    return retVal;
  };
}

const threeDayWeekend = ['Fri', 'Sat', 'Sun'] as const;
const getDay = cycleIterator(threeDayWeekend);

tester('Challenge 9', [
  [getDay(), 'Fri'],
  [getDay(), 'Sat'],
  [getDay(), 'Sun'],
  [getDay(), 'Fri'],
]);

/**
 * Challenge 10
 *
 * Create a function defineFirstArg that accepts a function and an argument.
 * Also, the function being passed in will accept at least one argument.
 * defineFirstArg will return a new function that invokes the passed-in function
 * with the passed-in argument as the passed-in function's first argument. Additional
 * arguments needed by the passed-in function will need to be passed into the
 * returned function.
 */
function defineFirstArg<U, T>(func: (...args: T[]) => U, arg: any) {
  return function (...replacement: Parameters<typeof func>): U {
    return func(arg, ...replacement);
  };
}

const subtract = function (big: number, small: number) {
  return big - small;
};
const subFrom20 = defineFirstArg(subtract, 20);
tester('Challenge 10', [[subFrom20(5), 15]]);

/**
 * Challenge 11
 *
 * Create a function dateStamp that accepts a function and returns a function.
 * The returned function will accept however many arguments the passed-in function accepts,
 * and return an object with a date key that contains a timestamp with the time of
 * invocation, and an output key that contains the result from invoking the passed-in function.
 * HINT: You may need to research how to access information on Date objects.
 */
function dateStamp<U, T>(func: (...args: T[]) => U) {
  return function (...args: Parameters<typeof func>) {
    return {
      date: new Date(),
      output: func(...args),
    };
  };
}

const stampedMultBy2 = dateStamp((n: number) => n * 2);

tester('Challenge 11', [
  [stampedMultBy2(4), { date: new Date(), output: 8 }],
  [stampedMultBy2(6), { date: new Date(), output: 12 }],
]);

/**
 * Challenge 12
 *
 * Create a function censor that accepts no arguments. censor will return a function
 * that will accept either two strings, or one string. When two strings are given, the
 * returned function will hold onto the two strings as a pair, for future use. When one
 * string is given, the returned function will return the same string, except all
 * instances of first strings (of saved pairs) will be replaced with their corresponding
 * second strings (of those saved pairs).
 */
function censor() {
  const pairs: [string, string][] = [];

  return function (first: string, second?: string) {
    if (second !== undefined) {
      pairs.push([first, second]);

      return;
    }

    let replaced = first;

    pairs.forEach(([x, y]) => {
      replaced = replaced.replaceAll(x, y);
    });

    return replaced;
  };
}

const changeScene = censor();
changeScene('dogs', 'cats');
changeScene('quick', 'slow');

tester('Challenge 12', [
  [
    changeScene('The quick, brown fox jumps over the lazy dogs.'),
    'The slow, brown fox jumps over the lazy cats.',
  ],
]);

/**
 * CHALLENGE 13
 *
 * There's no such thing as private properties on a JavaScript object! But, maybe there are?
 * Implement a function createSecretHolder(secret) which accepts any value as secret and
 * returns an object with ONLY two methods. getSecret() which returns the secret setSecret()
 * which sets the secret
 */
function createSecretHolder<T>(secret: T) {
  let currentSecret = secret;

  return {
    getSecret: (): T => currentSecret,
    setSecret: (newSecret: T) => {
      currentSecret = newSecret;
    },
  };
}

const obj = createSecretHolder(5);

tester<number | void>('Challenge 13', [
  [obj.getSecret(), 5],
  [obj.setSecret(2), undefined],
  [obj.getSecret(), 2],
]);

/**
 * CHALLENGE 14
 *
 * Write a function, callTimes, that returns a new function. The new function should
 * return the number of times it’s been called.
 */
function callTimes() {
  let counter = 0;
  return function () {
    return ++counter;
  };
}

let myNewFunc1 = callTimes();
let myNewFunc2 = callTimes();

tester('Challenge 14', [
  [myNewFunc1(), 1],
  [myNewFunc1(), 2],
  [myNewFunc2(), 1],
  [myNewFunc2(), 2],
]);

/**
 * CHALLENGE 15
 *
 * Create a function roulette that accepts a number (let us call it n), and returns a function.
 * The returned function will take no arguments, and will return the string 'spin' the first
 * n - 1 number of times it is invoked. On the very next invocation (the nth invocation), the
 * returned function will return the string 'win'. On every invocation after that, the returned
 * function returns the string 'pick a number to play again'.
 */
function roulette(num: number) {
  let counter = 0;

  return function () {
    counter++;

    if (counter === num) {
      return 'win';
    }

    if (counter < num) {
      return 'spin';
    }

    return 'pick a number to play again';
  };
}

const play = roulette(3);

tester('Challenge 15', [
  [play(), 'spin'],
  [play(), 'spin'],
  [play(), 'win'],
  [play(), 'pick a number to play again'],
  [play(), 'pick a number to play again'],
]);

/**
 * Challenge 16
 *
 * Create a function average that accepts no arguments, and returns a function
 * (that will accept either a number as its lone argument, or no arguments at all).
 * When the returned function is invoked with a number, the output should be average
 * of all the numbers have ever been passed into that function (duplicate numbers
 * count just like any other number). When the returned function is invoked with no
 * arguments, the current average is outputted. If the returned function is invoked
 * with no arguments before any numbers are passed in, then it should return 0.
 */
function average() {
  let sum = 0;
  let cnt = 0;

  return function (num?: number) {
    sum += num ?? 0;

    if (num) cnt++;

    if (cnt < 1) return 0;

    return sum / cnt;
  };
}

const avgSoFar = average();

tester('Challenge 16', [
  [avgSoFar(), 0],
  [avgSoFar(4), 4],
  [avgSoFar(8), 6],
  [avgSoFar(), 6],
  [avgSoFar(12), 8],
  [avgSoFar(), 8],
]);

/**
 * CHALLENGE 17
 *
 * Create a function makeFuncTester that accepts an array (of two-element sub-arrays),
 * and returns a function (that will accept a callback). The returned function should
 * return true if the first elements (of each sub-array) being passed into the callback
 * all yield the corresponding second elements (of the same sub-array). Otherwise, the
 * returned function should return false.
 */
function makeFuncTester<U>(arr: [U, U][]) {
  return function (cb: (val: U) => U) {
    return arr.some(curr => cb(curr[0]) === curr[1]);
  };
}

const capLastTestCases: [string, string][] = [];
capLastTestCases.push(['hello', 'hellO']);
capLastTestCases.push(['goodbye', 'goodbyE']);
capLastTestCases.push(['howdy', 'howdY']);
const shouldCapitalizeLast = makeFuncTester(capLastTestCases);
const capLastAttempt1 = (str: string) => str.toUpperCase();
const capLastAttempt2 = (str: string) =>
  str.slice(0, -1) + str.slice(-1).toUpperCase();

tester('Challenge 17', [
  [shouldCapitalizeLast(capLastAttempt1), false],
  [shouldCapitalizeLast(capLastAttempt2), true],
]);

/**
 * CHALLENGE 18
 *
 * Create a function makeHistory that accepts a number (which will serve as a limit),
 * and returns a function (that will accept a string). The returned function will save
 * a history of the most recent "limit" number of strings passed into the returned function
 * (one per invocation only). Every time a string is passed into the function, the function
 * should return that same string with the word 'done' after it (separated by a space). However,
 * if the string 'undo' is passed into the function, then the function should delete the last action
 * saved in the history, and return that deleted string with the word 'undone' after (separated by a space).
 * If 'undo' is passed into the function and the function's history is empty, then the function should
 * return the string 'nothing to undo'.
 */
function makeHistory(limit: number) {
  const history: string[] = [];

  return function (str: 'undo' | string): string {
    if (str === 'undo') {
      if (history.length === 0) {
        return 'nothing to undo';
      }

      return `${history.pop()} undone`;
    }

    if (history.length === limit) {
      history.shift();
    }

    history.push(str);
    return `${str} done`;
  };
}

const myActions = makeHistory(2);

tester('Challenge 18', [
  [myActions('jump'), 'jump done'],
  [myActions('undo'), 'jump undone'],
  [myActions('walk'), 'walk done'],
  [myActions('code'), 'code done'],
  [myActions('pose'), 'pose done'],
  [myActions('undo'), 'pose undone'],
  [myActions('undo'), 'code undone'],
  [myActions('undo'), 'nothing to undo'],
]);

/**
 * CHALLENGE 19
 *
 * Create a function blackjack that accepts an array (which will contain numbers
 * ranging from 1 through 11), and returns a DEALER function. The DEALER function
 * will take two arguments (both numbers), and then return yet ANOTHER function,
 * which we will call the PLAYER function.
 *
 * On the FIRST invocation of the PLAYER function, it will return the sum of the
 * two numbers passed into the DEALER function.
 *
 * On the SECOND invocation of the PLAYER function, it will return either:
 * 1. the first number in the array that was passed into blackjack PLUS the sum
 * of the two numbers passed in as arguments into the DEALER function, IF that sum
 * is 21 or below, OR
 * 2. the string 'bust' if that sum is over 21.
 *
 * If it is 'bust', then every invocation of the PLAYER function AFTER THAT will
 * return the string 'you are done!' (but unlike 'bust', the 'you are done!'
 * output will NOT use a number in the array). If it is NOT 'bust', then the next
 * invocation of the PLAYER function will return either:
 *
 * 1. the most recent sum plus the next number in the array (a new sum)
 * if that new sum is 21 or less, OR
 * 2. the string 'bust' if the new sum is over 21.
 *
 * And again, if it is 'bust', then every subsequent invocation of the PLAYER
 * function will return the string 'you are done!'. Otherwise, it can continue
 * on to give the next sum with the next number in the array, and so forth.
 *
 * You may assume that the given array is long enough to give a 'bust'
 * before running out of numbers.
 *
 * BONUS: Implement blackjack so the DEALER function can return more PLAYER
 * functions that will each continue to take the next number in the array after
 * the previous PLAYER function left off. You will just need to make sure the
 * array has enough numbers for all the PLAYER functions.
 */
function blackjack(array: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11)[]) {
  let playerCnt = -1;

  return function (...deals: [number, number]) {
    const dealSum = deals[0] + deals[1];

    let invocationCnt = -1;
    let playerLastSum = 0;
    let busted = false;

    return function (): number | 'bust' | 'you are done!' {
      if (busted) return 'you are done!';

      invocationCnt++;

      if (invocationCnt === 0) return dealSum;

      playerCnt++;

      if (invocationCnt === 1) {
        const sum = array[playerCnt] + dealSum;
        playerLastSum = sum;

        if (sum <= 21) return sum;

        busted = true;
        return 'bust';
      }

      const sum = playerLastSum + array[playerCnt];
      playerLastSum = sum;

      if (sum <= 21) return sum;

      busted = true;
      return 'bust';
    };
  };
}

const deal = blackjack([
  2, 6, 1, 7, 11, 4, 6, 3, 9, 8, 9, 3, 10, 4, 5, 3, 7, 4, 9, 6, 10, 11,
]);

/*** PLAYER 1 ***/
const i_like_to_live_dangerously = deal(4, 5);
tester('Challenge 19 - Player 1', [
  [i_like_to_live_dangerously(), 9],
  [i_like_to_live_dangerously(), 11],
  [i_like_to_live_dangerously(), 17],
  [i_like_to_live_dangerously(), 18],
  [i_like_to_live_dangerously(), 'bust'],
  [i_like_to_live_dangerously(), 'you are done!'],
  [i_like_to_live_dangerously(), 'you are done!'],
]);

/*** BELOW LINES ARE FOR THE BONUS ***/

/*** PLAYER 2 ***/
const i_TOO_like_to_live_dangerously = deal(2, 2);
tester('Challenge 19 - Player 2', [
  [i_TOO_like_to_live_dangerously(), 4],
  [i_TOO_like_to_live_dangerously(), 15],
  [i_TOO_like_to_live_dangerously(), 19],
  [i_TOO_like_to_live_dangerously(), 'bust'],
  [i_TOO_like_to_live_dangerously(), 'you are done!'],
  [i_TOO_like_to_live_dangerously(), 'you are done!'],
]);

/*** PLAYER 3 ***/
const i_ALSO_like_to_live_dangerously = deal(3, 7);
tester('Challenge 19 - Player 3', [
  [i_ALSO_like_to_live_dangerously(), 10],
  [i_ALSO_like_to_live_dangerously(), 13],
  [i_ALSO_like_to_live_dangerously(), 'bust'],
  [i_ALSO_like_to_live_dangerously(), 'you are done!'],
  [i_ALSO_like_to_live_dangerously(), 'you are done!'],
]);
