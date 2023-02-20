import chalk from 'chalk';

export function tester<T extends [any, any]>(
  name: string,
  tests: T[],
  skip = false,
) {
  if (skip) return;

  let passed = 0;
  let failed = 0;

  console.log(chalk.underline(name));

  tests.forEach(([test, answer], index) => {
    if (answer === undefined) return;

    if (typeof test === 'object' || typeof answer === 'object') {
      if (JSON.stringify(test) === JSON.stringify(answer)) return ++passed;
    }

    if (test === answer) return ++passed;

    failed++;

    console.log(
      chalk.bgYellow(
        `Test '${name}[${index}]' failed, expected ${answer} ${chalk.underline(
          'but got',
        )} ${test}`,
      ),
    );
  });

  console.log(`${chalk.bgGreen('Passed:')} ${passed}
${chalk.bgRed('Failed:')} ${failed}
`);
}
