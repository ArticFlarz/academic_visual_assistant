/**
 * Pre-loaded standard algorithmic templates for novice computer science students.
 * Matches foundational algorithms taught in 1st/2nd year undergraduate coursework.
 */

const ALGORITHM_TEMPLATES = {
    factorial: {
        title: "Factorial of N",
        description: "Computes the factorial (n!) of a non-negative integer using an iterative for loop.",
        blocks: [
            { type: 'comment', text: 'Step 1: Input target number n' },
            { type: 'input', var_name: 'n', var_type: 'int', prompt: 'Enter a positive integer n:' },
            { type: 'comment', text: 'Step 2: Initialize factorial accumulator to 1' },
            { type: 'variable_declare', var_name: 'fact', var_type: 'int', initial_value: '1' },
            {
                type: 'for_loop',
                iterator: 'i',
                start_val: '1',
                end_val: 'n',
                step: '1',
                body: [
                    { type: 'variable_assign', var_name: 'fact', expression: 'fact * i' }
                ]
            },
            { type: 'output', expression: '"Factorial of " + n + " is " + fact' }
        ]
    },

    fibonacci: {
        title: "Fibonacci Sequence",
        description: "Generates the first N terms of the Fibonacci sequence using two pointer variables.",
        blocks: [
            { type: 'input', var_name: 'terms', var_type: 'int', prompt: 'How many terms to generate?' },
            { type: 'variable_declare', var_name: 'a', var_type: 'int', initial_value: '0' },
            { type: 'variable_declare', var_name: 'b', var_type: 'int', initial_value: '1' },
            { type: 'variable_declare', var_name: 'next_val', var_type: 'int', initial_value: '0' },
            { type: 'output', expression: '"Fibonacci Series:"' },
            {
                type: 'for_loop',
                iterator: 'i',
                start_val: '1',
                end_val: 'terms',
                step: '1',
                body: [
                    { type: 'output', expression: 'a' },
                    { type: 'variable_assign', var_name: 'next_val', expression: 'a + b' },
                    { type: 'variable_assign', var_name: 'a', expression: 'b' },
                    { type: 'variable_assign', var_name: 'b', expression: 'next_val' }
                ]
            }
        ]
    },

    even_odd: {
        title: "Even or Odd Checker",
        description: "Demonstrates conditional branching (IF-ELSE) and modulo arithmetic.",
        blocks: [
            { type: 'input', var_name: 'num', var_type: 'int', prompt: 'Enter an integer to inspect:' },
            {
                type: 'if_condition',
                condition: 'num % 2 == 0',
                then_body: [
                    { type: 'output', expression: 'num + " is an EVEN number."' }
                ],
                else_body: [
                    { type: 'output', expression: 'num + " is an ODD number."' }
                ]
            }
        ]
    },

    prime_check: {
        title: "Prime Number Test",
        description: "Tests whether a number N is prime by counting its divisors.",
        blocks: [
            { type: 'input', var_name: 'n', var_type: 'int', prompt: 'Enter number to test for primality:' },
            { type: 'variable_declare', var_name: 'is_prime', var_type: 'int', initial_value: '1' },
            {
                type: 'if_condition',
                condition: 'n <= 1',
                then_body: [
                    { type: 'variable_assign', var_name: 'is_prime', expression: '0' }
                ],
                else_body: [
                    {
                        type: 'for_loop',
                        iterator: 'd',
                        start_val: '2',
                        end_val: 'n - 1',
                        step: '1',
                        body: [
                            {
                                type: 'if_condition',
                                condition: 'n % d == 0',
                                then_body: [
                                    { type: 'variable_assign', var_name: 'is_prime', expression: '0' }
                                ],
                                else_body: []
                            }
                        ]
                    }
                ]
            },
            {
                type: 'if_condition',
                condition: 'is_prime == 1',
                then_body: [
                    { type: 'output', expression: 'n + " is a PRIME number."' }
                ],
                else_body: [
                    { type: 'output', expression: 'n + " is NOT a prime number."' }
                ]
            }
        ]
    },

    sum_natural: {
        title: "Sum of First N Numbers",
        description: "Calculates the summation 1 + 2 + ... + N using a while loop construct.",
        blocks: [
            { type: 'input', var_name: 'limit', var_type: 'int', prompt: 'Enter N:' },
            { type: 'variable_declare', var_name: 'total', var_type: 'int', initial_value: '0' },
            { type: 'variable_declare', var_name: 'counter', var_type: 'int', initial_value: '1' },
            {
                type: 'while_loop',
                condition: 'counter <= limit',
                body: [
                    { type: 'variable_assign', var_name: 'total', expression: 'total + counter' },
                    { type: 'variable_assign', var_name: 'counter', expression: 'counter + 1' }
                ]
            },
            { type: 'output', expression: '"Total sum is: " + total' }
        ]
    }
};
