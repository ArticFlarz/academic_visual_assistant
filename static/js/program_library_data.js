/**
 * 75 Curated Algorithmic Programs Repository
 * Complete AST block definitions for the Visual Programming Assistant.
 * Candidates can explore, filter, preview, and load any program directly into the workspace.
 */

window.PROGRAM_LIBRARY_DATA = [
    {
        "id": "prog_01_hello",
        "title": "Hello World & Personalized Welcome",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "The classic programming starting point. Prompts for candidate name and prints a personalized academic welcome.",
        "concepts": [
            "I/O",
            "Strings",
            "Greetings"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "candidate_name",
                "var_type": "string",
                "prompt": "Enter your name:"
            },
            {
                "type": "output",
                "expression": "\"Hello, \" + candidate_name + \"! Welcome to Visual Programming.\""
            },
            {
                "type": "output",
                "expression": "\"Happy coding and problem solving!\""
            }
        ]
    },
    {
        "id": "prog_02_sum_two_nums",
        "title": "Sum and Difference of Two Numbers",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "Prompts for two integers, stores them in variables, and calculates their algebraic sum and difference.",
        "concepts": [
            "Arithmetic",
            "Variables",
            "Input/Output"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num1",
                "var_type": "int",
                "prompt": "Enter first number:"
            },
            {
                "type": "input",
                "var_name": "num2",
                "var_type": "int",
                "prompt": "Enter second number:"
            },
            {
                "type": "variable_declare",
                "var_name": "sum_val",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "diff_val",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_assign",
                "var_name": "sum_val",
                "expression": "num1 + num2"
            },
            {
                "type": "variable_assign",
                "var_name": "diff_val",
                "expression": "num1 - num2"
            },
            {
                "type": "output",
                "expression": "\"Sum = \" + sum_val"
            },
            {
                "type": "output",
                "expression": "\"Difference = \" + diff_val"
            }
        ]
    },
    {
        "id": "prog_03_swap_temp",
        "title": "Swap Two Variables (Using Temporary Store)",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "Demonstrates memory buffer interchange by swapping two user-entered values using a third temporary variable.",
        "concepts": [
            "Variables",
            "Assignment",
            "Memory Swapping"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "a",
                "var_type": "int",
                "prompt": "Enter first number (a):"
            },
            {
                "type": "input",
                "var_name": "b",
                "var_type": "int",
                "prompt": "Enter second number (b):"
            },
            {
                "type": "output",
                "expression": "\"Before swap: a = \" + a + \", b = \" + b"
            },
            {
                "type": "variable_declare",
                "var_name": "temp",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_assign",
                "var_name": "temp",
                "expression": "a"
            },
            {
                "type": "variable_assign",
                "var_name": "a",
                "expression": "b"
            },
            {
                "type": "variable_assign",
                "var_name": "b",
                "expression": "temp"
            },
            {
                "type": "output",
                "expression": "\"After swap: a = \" + a + \", b = \" + b"
            }
        ]
    },
    {
        "id": "prog_04_swap_arithmetic",
        "title": "Swap Two Variables (Arithmetic In-Place)",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Intermediate",
        "description": "Interchanges two numeric variables without allocating auxiliary storage using addition and subtraction operations.",
        "concepts": [
            "In-place Operations",
            "Algebra",
            "Optimization"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "x",
                "var_type": "int",
                "prompt": "Enter first number (x):"
            },
            {
                "type": "input",
                "var_name": "y",
                "var_type": "int",
                "prompt": "Enter second number (y):"
            },
            {
                "type": "output",
                "expression": "\"Before swap: x = \" + x + \", y = \" + y"
            },
            {
                "type": "variable_assign",
                "var_name": "x",
                "expression": "x + y"
            },
            {
                "type": "variable_assign",
                "var_name": "y",
                "expression": "x - y"
            },
            {
                "type": "variable_assign",
                "var_name": "x",
                "expression": "x - y"
            },
            {
                "type": "output",
                "expression": "\"After in-place swap: x = \" + x + \", y = \" + y"
            }
        ]
    },
    {
        "id": "prog_05_simple_interest",
        "title": "Simple Interest & Final Amount Calculator",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "Calculates total interest accrual and maturity balance using financial equation SI = (P * R * T) / 100.",
        "concepts": [
            "Formulas",
            "Financial Math",
            "Float Arithmetic"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "principal",
                "var_type": "float",
                "prompt": "Enter Principal amount:"
            },
            {
                "type": "input",
                "var_name": "rate",
                "var_type": "float",
                "prompt": "Enter Annual Interest Rate (%):"
            },
            {
                "type": "input",
                "var_name": "time_years",
                "var_type": "float",
                "prompt": "Enter Time period in years:"
            },
            {
                "type": "variable_declare",
                "var_name": "interest",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_declare",
                "var_name": "total_amount",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_assign",
                "var_name": "interest",
                "expression": "(principal * rate * time_years) / 100.0"
            },
            {
                "type": "variable_assign",
                "var_name": "total_amount",
                "expression": "principal + interest"
            },
            {
                "type": "output",
                "expression": "\"Interest Earned: \" + interest"
            },
            {
                "type": "output",
                "expression": "\"Total Maturity Amount: \" + total_amount"
            }
        ]
    },
    {
        "id": "prog_06_celsius_fahrenheit",
        "title": "Temperature Converter (Celsius to Fahrenheit)",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "Converts temperature from Celsius to Fahrenheit using conversion equation F = (C * 9/5) + 32.",
        "concepts": [
            "Conversions",
            "Physics",
            "Floating-point"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "celsius",
                "var_type": "float",
                "prompt": "Enter Celsius temperature:"
            },
            {
                "type": "variable_declare",
                "var_name": "fahrenheit",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_assign",
                "var_name": "fahrenheit",
                "expression": "(celsius * 9.0 / 5.0) + 32.0"
            },
            {
                "type": "output",
                "expression": "\"Temperature in Fahrenheit: \" + fahrenheit"
            }
        ]
    },
    {
        "id": "prog_07_rectangle_metrics",
        "title": "Area and Perimeter of a Rectangle",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "Computes geometric 2D surface area (L * W) and boundary perimeter 2*(L + W) of a rectangle.",
        "concepts": [
            "Geometry",
            "Formulas",
            "Measurements"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "length",
                "var_type": "float",
                "prompt": "Enter rectangle length:"
            },
            {
                "type": "input",
                "var_name": "width",
                "var_type": "float",
                "prompt": "Enter rectangle width:"
            },
            {
                "type": "variable_declare",
                "var_name": "area",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_declare",
                "var_name": "perimeter",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_assign",
                "var_name": "area",
                "expression": "length * width"
            },
            {
                "type": "variable_assign",
                "var_name": "perimeter",
                "expression": "2.0 * (length + width)"
            },
            {
                "type": "output",
                "expression": "\"Rectangle Area: \" + area"
            },
            {
                "type": "output",
                "expression": "\"Rectangle Perimeter: \" + perimeter"
            }
        ]
    },
    {
        "id": "prog_08_circle_metrics",
        "title": "Area and Circumference of a Circle",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "Calculates circle area (pi * r^2) and boundary circumference (2 * pi * r) for user-entered radius.",
        "concepts": [
            "Geometry",
            "Constants",
            "Float Math"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "radius",
                "var_type": "float",
                "prompt": "Enter circle radius:"
            },
            {
                "type": "variable_declare",
                "var_name": "circ_area",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_declare",
                "var_name": "circumference",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_assign",
                "var_name": "circ_area",
                "expression": "3.14159 * radius * radius"
            },
            {
                "type": "variable_assign",
                "var_name": "circumference",
                "expression": "2.0 * 3.14159 * radius"
            },
            {
                "type": "output",
                "expression": "\"Circle Area: \" + circ_area"
            },
            {
                "type": "output",
                "expression": "\"Circumference: \" + circumference"
            }
        ]
    },
    {
        "id": "prog_09_average_three_scores",
        "title": "Average and Sum of Three Academic Marks",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Beginner",
        "description": "Accepts 3 academic scores, evaluates cumulative sum and average performance percentage.",
        "concepts": [
            "Education Analytics",
            "Aggregation",
            "Division"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "score1",
                "var_type": "float",
                "prompt": "Enter score for Exam 1:"
            },
            {
                "type": "input",
                "var_name": "score2",
                "var_type": "float",
                "prompt": "Enter score for Exam 2:"
            },
            {
                "type": "input",
                "var_name": "score3",
                "var_type": "float",
                "prompt": "Enter score for Exam 3:"
            },
            {
                "type": "variable_declare",
                "var_name": "total_score",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_declare",
                "var_name": "avg_score",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "variable_assign",
                "var_name": "total_score",
                "expression": "score1 + score2 + score3"
            },
            {
                "type": "variable_assign",
                "var_name": "avg_score",
                "expression": "total_score / 3.0"
            },
            {
                "type": "output",
                "expression": "\"Total Score: \" + total_score"
            },
            {
                "type": "output",
                "expression": "\"Academic Average: \" + avg_score"
            }
        ]
    },
    {
        "id": "prog_10_seconds_to_hms",
        "title": "Seconds to Hours, Minutes, and Seconds Breakdown",
        "category": "Fundamentals & Arithmetic",
        "difficulty": "Intermediate",
        "description": "Converts elapsed integer seconds into modular hours, minutes, and residual seconds.",
        "concepts": [
            "Modulo",
            "Integer Division",
            "Time Formatting"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "total_sec",
                "var_type": "int",
                "prompt": "Enter total seconds to convert:"
            },
            {
                "type": "variable_declare",
                "var_name": "hours",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "mins",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "secs",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_assign",
                "var_name": "hours",
                "expression": "total_sec / 3600"
            },
            {
                "type": "variable_assign",
                "var_name": "mins",
                "expression": "(total_sec % 3600) / 60"
            },
            {
                "type": "variable_assign",
                "var_name": "secs",
                "expression": "total_sec % 60"
            },
            {
                "type": "output",
                "expression": "\"Time formatted: \" + hours + \"h \" + mins + \"m \" + secs + \"s\""
            }
        ]
    },
    {
        "id": "prog_11_even_odd",
        "title": "Even or Odd Parity Checker",
        "category": "Conditional Decision Making",
        "difficulty": "Beginner",
        "description": "Determines mathematical parity using modulo arithmetic operator (n % 2 == 0).",
        "concepts": [
            "Conditionals",
            "Modulo",
            "Parity"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter an integer:"
            },
            {
                "type": "if_condition",
                "condition": "n % 2 == 0",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"The number is EVEN\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"The number is ODD\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_12_positive_negative_zero",
        "title": "Check Positive, Negative, or Zero Sign",
        "category": "Conditional Decision Making",
        "difficulty": "Beginner",
        "description": "Classifies integer sign into positive, negative, or zero using nested branching logic.",
        "concepts": [
            "Branching",
            "Nested If",
            "Sign Determination"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num",
                "var_type": "int",
                "prompt": "Enter integer to inspect:"
            },
            {
                "type": "if_condition",
                "condition": "num > 0",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Number is POSITIVE\""
                    }
                ],
                "else_body": [
                    {
                        "type": "if_condition",
                        "condition": "num < 0",
                        "then_body": [
                            {
                                "type": "output",
                                "expression": "\"Number is NEGATIVE\""
                            }
                        ],
                        "else_body": [
                            {
                                "type": "output",
                                "expression": "\"Number is ZERO\""
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_13_max_two_nums",
        "title": "Find Maximum of Two Numbers",
        "category": "Conditional Decision Making",
        "difficulty": "Beginner",
        "description": "Compares two user-supplied values and outputs the larger value.",
        "concepts": [
            "Comparison",
            "Relational Operators",
            "Decisions"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num1",
                "var_type": "int",
                "prompt": "Enter first number:"
            },
            {
                "type": "input",
                "var_name": "num2",
                "var_type": "int",
                "prompt": "Enter second number:"
            },
            {
                "type": "variable_declare",
                "var_name": "max_val",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "if_condition",
                "condition": "num1 >= num2",
                "then_body": [
                    {
                        "type": "variable_assign",
                        "var_name": "max_val",
                        "expression": "num1"
                    }
                ],
                "else_body": [
                    {
                        "type": "variable_assign",
                        "var_name": "max_val",
                        "expression": "num2"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Maximum value is: \" + max_val"
            }
        ]
    },
    {
        "id": "prog_14_max_three_nums",
        "title": "Find Largest of Three Numbers",
        "category": "Conditional Decision Making",
        "difficulty": "Intermediate",
        "description": "Uses compound logical conjunctions to find the greatest among three user numbers.",
        "concepts": [
            "Compound Conditions",
            "Logical AND",
            "Extreme Value"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "a",
                "var_type": "int",
                "prompt": "Enter first number (a):"
            },
            {
                "type": "input",
                "var_name": "b",
                "var_type": "int",
                "prompt": "Enter second number (b):"
            },
            {
                "type": "input",
                "var_name": "c",
                "var_type": "int",
                "prompt": "Enter third number (c):"
            },
            {
                "type": "variable_declare",
                "var_name": "largest",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "if_condition",
                "condition": "(a >= b) and (a >= c)",
                "then_body": [
                    {
                        "type": "variable_assign",
                        "var_name": "largest",
                        "expression": "a"
                    }
                ],
                "else_body": [
                    {
                        "type": "if_condition",
                        "condition": "b >= c",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "largest",
                                "expression": "b"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "largest",
                                "expression": "c"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Largest of the three is: \" + largest"
            }
        ]
    },
    {
        "id": "prog_15_leap_year",
        "title": "Gregorian Leap Year Determination",
        "category": "Conditional Decision Making",
        "difficulty": "Intermediate",
        "description": "Implements calendar astronomical leap rule: divisible by 400 or (divisible by 4 and not by 100).",
        "concepts": [
            "Gregorian Calendar",
            "Compound Boolean",
            "Modulo"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "year",
                "var_type": "int",
                "prompt": "Enter year (e.g. 2024):"
            },
            {
                "type": "if_condition",
                "condition": "(year % 400 == 0) or ((year % 4 == 0) and (year % 100 != 0))",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Leap Year: YES (366 days)\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Leap Year: NO (365 days)\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_16_voting_eligibility",
        "title": "Democratic Voting Age Eligibility Check",
        "category": "Conditional Decision Making",
        "difficulty": "Beginner",
        "description": "Checks if candidate meets standard civic voting age threshold (18 years) and reports remaining years.",
        "concepts": [
            "Relational Logic",
            "Subtraction",
            "Civic Rules"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "candidate_age",
                "var_type": "int",
                "prompt": "Enter age in years:"
            },
            {
                "type": "if_condition",
                "condition": "candidate_age >= 18",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Eligible to vote in civic elections.\""
                    }
                ],
                "else_body": [
                    {
                        "type": "variable_declare",
                        "var_name": "wait_years",
                        "var_type": "int",
                        "initial_value": "0"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "wait_years",
                        "expression": "18 - candidate_age"
                    },
                    {
                        "type": "output",
                        "expression": "\"Not yet eligible. Years remaining: \" + wait_years"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_17_grade_classifier",
        "title": "Academic Grade Boundary Classifier",
        "category": "Conditional Decision Making",
        "difficulty": "Intermediate",
        "description": "Categorizes academic marks into official tier grades: A+ (>=90), A (>=80), B (>=65), C (>=50), or F.",
        "concepts": [
            "Multi-way Branching",
            "Grading Scale",
            "Academic Standards"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "percentage",
                "var_type": "int",
                "prompt": "Enter student marks (0-100):"
            },
            {
                "type": "if_condition",
                "condition": "percentage >= 90",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Grade: A+ (Outstanding Performance)\""
                    }
                ],
                "else_body": [
                    {
                        "type": "if_condition",
                        "condition": "percentage >= 80",
                        "then_body": [
                            {
                                "type": "output",
                                "expression": "\"Grade: A (Very Good)\""
                            }
                        ],
                        "else_body": [
                            {
                                "type": "if_condition",
                                "condition": "percentage >= 65",
                                "then_body": [
                                    {
                                        "type": "output",
                                        "expression": "\"Grade: B (Satisfactory)\""
                                    }
                                ],
                                "else_body": [
                                    {
                                        "type": "if_condition",
                                        "condition": "percentage >= 50",
                                        "then_body": [
                                            {
                                                "type": "output",
                                                "expression": "\"Grade: C (Pass)\""
                                            }
                                        ],
                                        "else_body": [
                                            {
                                                "type": "output",
                                                "expression": "\"Grade: F (Remedial Action Required)\""
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_18_divisibility_5_and_11",
        "title": "Divisibility by Both 5 and 11 Check",
        "category": "Conditional Decision Making",
        "difficulty": "Beginner",
        "description": "Tests whether an integer is concurrently divisible by both 5 and 11 using logical AND.",
        "concepts": [
            "Compound Divisibility",
            "Logical Conjunction",
            "Factors"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "val",
                "var_type": "int",
                "prompt": "Enter number to test divisibility:"
            },
            {
                "type": "if_condition",
                "condition": "(val % 5 == 0) and (val % 11 == 0)",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Valid: Number is divisible by BOTH 5 and 11\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Invalid: Not simultaneously divisible by 5 and 11\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_19_cartesian_quadrant",
        "title": "Cartesian Coordinate Quadrant Locator",
        "category": "Conditional Decision Making",
        "difficulty": "Intermediate",
        "description": "Identifies whether an (X, Y) coordinate pair resides in Quadrant I, II, III, IV, or on an axis.",
        "concepts": [
            "Geometry",
            "Cartesian Coordinates",
            "Nested Conditions"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "x",
                "var_type": "int",
                "prompt": "Enter X coordinate:"
            },
            {
                "type": "input",
                "var_name": "y",
                "var_type": "int",
                "prompt": "Enter Y coordinate:"
            },
            {
                "type": "if_condition",
                "condition": "(x > 0) and (y > 0)",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Point lies in Quadrant I (+, +)\""
                    }
                ],
                "else_body": [
                    {
                        "type": "if_condition",
                        "condition": "(x < 0) and (y > 0)",
                        "then_body": [
                            {
                                "type": "output",
                                "expression": "\"Point lies in Quadrant II (-, +)\""
                            }
                        ],
                        "else_body": [
                            {
                                "type": "if_condition",
                                "condition": "(x < 0) and (y < 0)",
                                "then_body": [
                                    {
                                        "type": "output",
                                        "expression": "\"Point lies in Quadrant III (-, -)\""
                                    }
                                ],
                                "else_body": [
                                    {
                                        "type": "if_condition",
                                        "condition": "(x > 0) and (y < 0)",
                                        "then_body": [
                                            {
                                                "type": "output",
                                                "expression": "\"Point lies in Quadrant IV (+, -)\""
                                            }
                                        ],
                                        "else_body": [
                                            {
                                                "type": "output",
                                                "expression": "\"Point lies on an Axis or Origin (0, 0)\""
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_20_triangle_validity",
        "title": "Triangle Inequality Theorem Check",
        "category": "Conditional Decision Making",
        "difficulty": "Beginner",
        "description": "Validates geometric triangle construction: sum of any two sides must exceed the third side.",
        "concepts": [
            "Geometry",
            "Triangle Theorem",
            "Compound Conditions"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "a",
                "var_type": "int",
                "prompt": "Enter side A length:"
            },
            {
                "type": "input",
                "var_name": "b",
                "var_type": "int",
                "prompt": "Enter side B length:"
            },
            {
                "type": "input",
                "var_name": "c",
                "var_type": "int",
                "prompt": "Enter side C length:"
            },
            {
                "type": "if_condition",
                "condition": "(a + b > c) and (a + c > b) and (b + c > a)",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Valid Triangle: Inequality theorem satisfied\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Invalid Triangle: Sides cannot form a closed triangle\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_21_print_1_to_n",
        "title": "Sequential Iteration: Print 1 to N",
        "category": "Loops & Iterations",
        "difficulty": "Beginner",
        "description": "Iterates sequentially from 1 up to upper limit N using a standard for loop.",
        "concepts": [
            "Iteration",
            "Counting",
            "For Loop"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "target",
                "var_type": "int",
                "prompt": "Enter upper bound N:"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "target",
                "step": "1",
                "body": [
                    {
                        "type": "output",
                        "expression": "\"Number: \" + i"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_22_sum_natural_numbers",
        "title": "Sum of First N Natural Numbers",
        "category": "Loops & Iterations",
        "difficulty": "Beginner",
        "description": "Accumulates total sum of numbers 1 through N using iterative loop accumulator pattern.",
        "concepts": [
            "Accumulator",
            "Series Summation",
            "Loops"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter value of N:"
            },
            {
                "type": "variable_declare",
                "var_name": "total_sum",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "n",
                "step": "1",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "total_sum",
                        "expression": "total_sum + i"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Sum of first \" + n + \" natural numbers = \" + total_sum"
            }
        ]
    },
    {
        "id": "prog_23_factorial",
        "title": "Factorial of an Integer (N!)",
        "category": "Loops & Iterations",
        "difficulty": "Beginner",
        "description": "Computes multiplicative product of all positive integers from 1 up to N.",
        "concepts": [
            "Multiplication Loop",
            "Combinatorics",
            "Factorial"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter number for factorial:"
            },
            {
                "type": "variable_declare",
                "var_name": "fact",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "n",
                "step": "1",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "fact",
                        "expression": "fact * i"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Factorial of \" + n + \" = \" + fact"
            }
        ]
    },
    {
        "id": "prog_24_multiplication_table",
        "title": "Arithmetic Multiplication Table (1 to 10)",
        "category": "Loops & Iterations",
        "difficulty": "Beginner",
        "description": "Generates formatted multiplication table for user-entered number across multipliers 1 to 10.",
        "concepts": [
            "Tables",
            "Multiplication",
            "String Formatting"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "table_num",
                "var_type": "int",
                "prompt": "Enter multiplication table number:"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "10",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "prod",
                        "var_type": "int",
                        "initial_value": "0"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "prod",
                        "expression": "table_num * i"
                    },
                    {
                        "type": "output",
                        "expression": "table_num + \" x \" + i + \" = \" + prod"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_25_countdown_blastoff",
        "title": "Rocket Launch Countdown (While Loop Decrement)",
        "category": "Loops & Iterations",
        "difficulty": "Beginner",
        "description": "Demonstrates condition-driven while loop by counting downwards from user starting seconds to liftoff.",
        "concepts": [
            "While Loop",
            "Decrement",
            "State Control"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "timer",
                "var_type": "int",
                "prompt": "Enter countdown start seconds:"
            },
            {
                "type": "while_loop",
                "condition": "timer > 0",
                "body": [
                    {
                        "type": "output",
                        "expression": "\"T-minus: \" + timer"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "timer",
                        "expression": "timer - 1"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"LIFTOFF! System launched successfully.\""
            }
        ]
    },
    {
        "id": "prog_26_sum_even_numbers",
        "title": "Sum of Even Integers up to N",
        "category": "Loops & Iterations",
        "difficulty": "Beginner",
        "description": "Sums all even numbers up to limit N using loop step increment of 2.",
        "concepts": [
            "Step Increment",
            "Even Series",
            "Accumulation"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "limit",
                "var_type": "int",
                "prompt": "Enter upper limit N:"
            },
            {
                "type": "variable_declare",
                "var_name": "even_sum",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "2",
                "end_val": "limit",
                "step": "2",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "even_sum",
                        "expression": "even_sum + i"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Sum of even numbers = \" + even_sum"
            }
        ]
    },
    {
        "id": "prog_27_sum_odd_numbers",
        "title": "Sum of Odd Integers up to N",
        "category": "Loops & Iterations",
        "difficulty": "Beginner",
        "description": "Accumulates sum of all odd integers from 1 up to user-specified ceiling limit N.",
        "concepts": [
            "Odd Series",
            "Step Stride",
            "Loops"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "limit",
                "var_type": "int",
                "prompt": "Enter upper limit N:"
            },
            {
                "type": "variable_declare",
                "var_name": "odd_sum",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "limit",
                "step": "2",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "odd_sum",
                        "expression": "odd_sum + i"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Sum of odd numbers = \" + odd_sum"
            }
        ]
    },
    {
        "id": "prog_28_power_exponentiation",
        "title": "Integer Exponentiation (Base^Exponent via Loop)",
        "category": "Loops & Iterations",
        "difficulty": "Intermediate",
        "description": "Evaluates power base^exp by repeated multiplication inside an iterative loop.",
        "concepts": [
            "Powers",
            "Iterative Product",
            "Math"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "base_val",
                "var_type": "int",
                "prompt": "Enter base number:"
            },
            {
                "type": "input",
                "var_name": "exp_val",
                "var_type": "int",
                "prompt": "Enter exponent (power >= 0):"
            },
            {
                "type": "variable_declare",
                "var_name": "result",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "exp_val",
                "step": "1",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "result",
                        "expression": "result * base_val"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "base_val + \" ^ \" + exp_val + \" = \" + result"
            }
        ]
    },
    {
        "id": "prog_29_fibonacci_series",
        "title": "Fibonacci Sequence Generator (First N Terms)",
        "category": "Loops & Iterations",
        "difficulty": "Intermediate",
        "description": "Generates consecutive Fibonacci numbers where each term is the sum of previous two terms.",
        "concepts": [
            "Fibonacci",
            "Recurrence",
            "State Transition"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "terms",
                "var_type": "int",
                "prompt": "Enter number of terms N (>= 2):"
            },
            {
                "type": "variable_declare",
                "var_name": "t1",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "t2",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "variable_declare",
                "var_name": "next_term",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "output",
                "expression": "\"Term 1: \" + t1"
            },
            {
                "type": "output",
                "expression": "\"Term 2: \" + t2"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "3",
                "end_val": "terms",
                "step": "1",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "next_term",
                        "expression": "t1 + t2"
                    },
                    {
                        "type": "output",
                        "expression": "\"Term \" + i + \": \" + next_term"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "t1",
                        "expression": "t2"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "t2",
                        "expression": "next_term"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_30_harmonic_series",
        "title": "Harmonic Series Summation (1 + 1/2 + ... + 1/N)",
        "category": "Loops & Iterations",
        "difficulty": "Intermediate",
        "description": "Calculates mathematical harmonic partial sum H_n = sum(1/k) for k from 1 to N.",
        "concepts": [
            "Series",
            "Harmonic Number",
            "Float Accumulator"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter number of terms (N):"
            },
            {
                "type": "variable_declare",
                "var_name": "harmonic_sum",
                "var_type": "float",
                "initial_value": "0.0"
            },
            {
                "type": "for_loop",
                "iterator": "k",
                "start_val": "1",
                "end_val": "n",
                "step": "1",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "harmonic_sum",
                        "expression": "harmonic_sum + (1.0 / k)"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Harmonic series sum = \" + harmonic_sum"
            }
        ]
    },
    {
        "id": "prog_31_count_digits",
        "title": "Count Number of Digits in an Integer",
        "category": "Number Theory & Digits",
        "difficulty": "Beginner",
        "description": "Counts decimal digit length by successively dividing input integer by 10.",
        "concepts": [
            "Digit Extraction",
            "Division Loop",
            "Base 10"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num",
                "var_type": "int",
                "prompt": "Enter positive integer:"
            },
            {
                "type": "variable_declare",
                "var_name": "digit_count",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "temp_n",
                "var_type": "int",
                "initial_value": "num"
            },
            {
                "type": "while_loop",
                "condition": "temp_n > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "digit_count",
                        "expression": "digit_count + 1"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "temp_n",
                        "expression": "temp_n / 10"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Number of digits: \" + digit_count"
            }
        ]
    },
    {
        "id": "prog_32_sum_of_digits",
        "title": "Sum of Digits in an Integer",
        "category": "Number Theory & Digits",
        "difficulty": "Beginner",
        "description": "Extracts individual digits using modulo 10 and accumulates their arithmetic sum.",
        "concepts": [
            "Digit Decomposition",
            "Modulo 10",
            "Accumulation"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "val",
                "var_type": "int",
                "prompt": "Enter integer to sum digits of:"
            },
            {
                "type": "variable_declare",
                "var_name": "digit_sum",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "cur",
                "var_type": "int",
                "initial_value": "val"
            },
            {
                "type": "while_loop",
                "condition": "cur > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "digit_sum",
                        "expression": "digit_sum + (cur % 10)"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "cur",
                        "expression": "cur / 10"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Sum of digits = \" + digit_sum"
            }
        ]
    },
    {
        "id": "prog_33_reverse_number",
        "title": "Reverse Digits of an Integer",
        "category": "Number Theory & Digits",
        "difficulty": "Intermediate",
        "description": "Reverses decimal integer positionally using formula rev = (rev * 10) + (num % 10).",
        "concepts": [
            "Reversal",
            "Positional Arithmetic",
            "While Loop"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num",
                "var_type": "int",
                "prompt": "Enter integer to reverse:"
            },
            {
                "type": "variable_declare",
                "var_name": "rev",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "rem",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "n_copy",
                "var_type": "int",
                "initial_value": "num"
            },
            {
                "type": "while_loop",
                "condition": "n_copy > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "rem",
                        "expression": "n_copy % 10"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "rev",
                        "expression": "(rev * 10) + rem"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "n_copy",
                        "expression": "n_copy / 10"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Reversed integer = \" + rev"
            }
        ]
    },
    {
        "id": "prog_34_palindrome_number",
        "title": "Numeric Palindrome Verification",
        "category": "Number Theory & Digits",
        "difficulty": "Intermediate",
        "description": "Checks if integer reads identically forwards and backwards (e.g. 121, 1331).",
        "concepts": [
            "Palindrome",
            "Symmetry",
            "Modulo"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter number to test for Palindrome:"
            },
            {
                "type": "variable_declare",
                "var_name": "rev",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "orig",
                "var_type": "int",
                "initial_value": "n"
            },
            {
                "type": "while_loop",
                "condition": "orig > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "rev",
                        "expression": "(rev * 10) + (orig % 10)"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "orig",
                        "expression": "orig / 10"
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "n == rev",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Result: PALINDROME (Identical in reverse)\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Result: NOT a palindrome\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_35_armstrong_number",
        "title": "Armstrong / Narcissistic Number Check",
        "category": "Number Theory & Digits",
        "difficulty": "Intermediate",
        "description": "Tests if 3-digit number equals sum of cubes of its digits (e.g. 153 = 1^3 + 5^3 + 3^3).",
        "concepts": [
            "Armstrong Number",
            "Cubes",
            "Number Theory"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter 3-digit number (e.g. 153, 370):"
            },
            {
                "type": "variable_declare",
                "var_name": "sum_cubes",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "temp",
                "var_type": "int",
                "initial_value": "n"
            },
            {
                "type": "variable_declare",
                "var_name": "d",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "temp > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "d",
                        "expression": "temp % 10"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "sum_cubes",
                        "expression": "sum_cubes + (d * d * d)"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "temp",
                        "expression": "temp / 10"
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "sum_cubes == n",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"YES: \" + n + \" is an Armstrong number!\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"NO: \" + n + \" is not an Armstrong number.\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_36_prime_number_check",
        "title": "Prime Number Primality Test",
        "category": "Number Theory & Digits",
        "difficulty": "Intermediate",
        "description": "Tests whether integer > 1 possesses factors other than 1 and itself using trial division.",
        "concepts": [
            "Prime Check",
            "Trial Division",
            "Flag Variable"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter positive integer > 1:"
            },
            {
                "type": "variable_declare",
                "var_name": "is_prime",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "2",
                "end_val": "n - 1",
                "step": "1",
                "body": [
                    {
                        "type": "if_condition",
                        "condition": "n % i == 0",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "is_prime",
                                "expression": "0"
                            }
                        ],
                        "else_body": []
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "is_prime == 1",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "n + \" is a PRIME number\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "n + \" is COMPOSITE / Not Prime\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_37_gcd_euclidean",
        "title": "Greatest Common Divisor (Euclidean Algorithm)",
        "category": "Number Theory & Digits",
        "difficulty": "Intermediate",
        "description": "Computes greatest common divisor using classical Euclidean modulo reduction.",
        "concepts": [
            "Euclidean Algorithm",
            "GCD",
            "Modulo Reduction"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "a",
                "var_type": "int",
                "prompt": "Enter first positive integer:"
            },
            {
                "type": "input",
                "var_name": "b",
                "var_type": "int",
                "prompt": "Enter second positive integer:"
            },
            {
                "type": "variable_declare",
                "var_name": "temp_rem",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "b > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "temp_rem",
                        "expression": "a % b"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "a",
                        "expression": "b"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "b",
                        "expression": "temp_rem"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"GCD = \" + a"
            }
        ]
    },
    {
        "id": "prog_38_lcm_computation",
        "title": "Least Common Multiple (LCM via GCD Relationship)",
        "category": "Number Theory & Digits",
        "difficulty": "Intermediate",
        "description": "Computes least common multiple using identity: LCM(a, b) = (a * b) / GCD(a, b).",
        "concepts": [
            "LCM",
            "GCD Relation",
            "Number Theory"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n1",
                "var_type": "int",
                "prompt": "Enter first number:"
            },
            {
                "type": "input",
                "var_name": "n2",
                "var_type": "int",
                "prompt": "Enter second number:"
            },
            {
                "type": "variable_declare",
                "var_name": "a",
                "var_type": "int",
                "initial_value": "n1"
            },
            {
                "type": "variable_declare",
                "var_name": "b",
                "var_type": "int",
                "initial_value": "n2"
            },
            {
                "type": "variable_declare",
                "var_name": "rem",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "gcd_val",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "lcm_val",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "b > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "rem",
                        "expression": "a % b"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "a",
                        "expression": "b"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "b",
                        "expression": "rem"
                    }
                ]
            },
            {
                "type": "variable_assign",
                "var_name": "gcd_val",
                "expression": "a"
            },
            {
                "type": "variable_assign",
                "var_name": "lcm_val",
                "expression": "(n1 * n2) / gcd_val"
            },
            {
                "type": "output",
                "expression": "\"LCM of \" + n1 + \" and \" + n2 + \" = \" + lcm_val"
            }
        ]
    },
    {
        "id": "prog_39_perfect_number",
        "title": "Perfect Number Checker",
        "category": "Number Theory & Digits",
        "difficulty": "Intermediate",
        "description": "Determines if integer equals sum of all its proper divisors (e.g. 6 = 1 + 2 + 3).",
        "concepts": [
            "Proper Divisors",
            "Summation",
            "Perfect Numbers"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "test_n",
                "var_type": "int",
                "prompt": "Enter number to test (e.g. 6, 28):"
            },
            {
                "type": "variable_declare",
                "var_name": "divisor_sum",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "d",
                "start_val": "1",
                "end_val": "test_n - 1",
                "step": "1",
                "body": [
                    {
                        "type": "if_condition",
                        "condition": "test_n % d == 0",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "divisor_sum",
                                "expression": "divisor_sum + d"
                            }
                        ],
                        "else_body": []
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "divisor_sum == test_n",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "test_n + \" is a PERFECT NUMBER!\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "test_n + \" is not a perfect number.\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_40_factors_of_number",
        "title": "Find All Divisors / Factors of an Integer",
        "category": "Number Theory & Digits",
        "difficulty": "Beginner",
        "description": "Iterates through candidate divisors from 1 to N, printing every integer that divides N evenly.",
        "concepts": [
            "Factors",
            "Divisors",
            "Iteration"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num",
                "var_type": "int",
                "prompt": "Enter integer to factor:"
            },
            {
                "type": "output",
                "expression": "\"Divisors of \" + num + \":\""
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "num",
                "step": "1",
                "body": [
                    {
                        "type": "if_condition",
                        "condition": "num % i == 0",
                        "then_body": [
                            {
                                "type": "output",
                                "expression": "\"Factor: \" + i"
                            }
                        ],
                        "else_body": []
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_41_array_sum_avg",
        "title": "Array Sum and Mathematical Mean",
        "category": "Arrays & Sequences",
        "difficulty": "Beginner",
        "description": "Prompts for sequence size and values, accumulating total sum and arithmetic average.",
        "concepts": [
            "Arrays",
            "Accumulator",
            "Mean Calculation"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of elements:"
            },
            {
                "type": "variable_declare",
                "var_name": "acc",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "idx",
                "start_val": "1",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "elem",
                        "var_type": "int",
                        "prompt": "Enter element:"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "acc",
                        "expression": "acc + elem"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Cumulative Array Sum = \" + acc"
            },
            {
                "type": "output",
                "expression": "\"Array Mean = \" + (acc / size)"
            }
        ]
    },
    {
        "id": "prog_42_find_max_element",
        "title": "Find Maximum Element in Sequence",
        "category": "Arrays & Sequences",
        "difficulty": "Beginner",
        "description": "Finds the global maximum value across user-entered elements using greedy comparison.",
        "concepts": [
            "Arrays",
            "Maximum",
            "Greedy Search"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of elements (>= 1):"
            },
            {
                "type": "input",
                "var_name": "max_seen",
                "var_type": "int",
                "prompt": "Enter first element:"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "2",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "curr_val",
                        "var_type": "int",
                        "prompt": "Enter next element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "curr_val > max_seen",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "max_seen",
                                "expression": "curr_val"
                            }
                        ],
                        "else_body": []
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Global Maximum Element: \" + max_seen"
            }
        ]
    },
    {
        "id": "prog_43_find_min_element",
        "title": "Find Minimum Element in Sequence",
        "category": "Arrays & Sequences",
        "difficulty": "Beginner",
        "description": "Tracks the minimum value seen across a user sequence of numbers.",
        "concepts": [
            "Arrays",
            "Minimum",
            "Greedy Traversal"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of elements (>= 1):"
            },
            {
                "type": "input",
                "var_name": "min_seen",
                "var_type": "int",
                "prompt": "Enter first element:"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "2",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "curr_val",
                        "var_type": "int",
                        "prompt": "Enter next element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "curr_val < min_seen",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "min_seen",
                                "expression": "curr_val"
                            }
                        ],
                        "else_body": []
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Global Minimum Element: \" + min_seen"
            }
        ]
    },
    {
        "id": "prog_44_count_even_odd_elements",
        "title": "Count Even and Odd Elements in Stream",
        "category": "Arrays & Sequences",
        "difficulty": "Beginner",
        "description": "Categorizes stream of integers into even or odd tallies using modulo parity counter.",
        "concepts": [
            "Counters",
            "Stream Processing",
            "Parity Classification"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of elements:"
            },
            {
                "type": "variable_declare",
                "var_name": "even_cnt",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "odd_cnt",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "val",
                        "var_type": "int",
                        "prompt": "Enter element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "val % 2 == 0",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "even_cnt",
                                "expression": "even_cnt + 1"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "odd_cnt",
                                "expression": "odd_cnt + 1"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Even element count: \" + even_cnt"
            },
            {
                "type": "output",
                "expression": "\"Odd element count: \" + odd_cnt"
            }
        ]
    },
    {
        "id": "prog_45_linear_search",
        "title": "Linear Search in Array",
        "category": "Arrays & Sequences",
        "difficulty": "Beginner",
        "description": "Scans sequence element-by-element to locate the 1-based index position of a user target key.",
        "concepts": [
            "Search",
            "Linear Scan",
            "Index Retrieval"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter sequence length:"
            },
            {
                "type": "input",
                "var_name": "target_key",
                "var_type": "int",
                "prompt": "Enter target value to search:"
            },
            {
                "type": "variable_declare",
                "var_name": "found_at",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "item",
                        "var_type": "int",
                        "prompt": "Enter item at index:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "item == target_key",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "found_at",
                                "expression": "i"
                            }
                        ],
                        "else_body": []
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "found_at > 0",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Target \" + target_key + \" found at position: \" + found_at"
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Target not found in sequence.\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_46_binary_search_logic",
        "title": "Binary Search Logic (Divide & Conquer)",
        "category": "Arrays & Sequences",
        "difficulty": "Intermediate",
        "description": "Simulates divide-and-conquer binary search across a sorted interval (1 to 100), converging on target in logarithmic steps.",
        "concepts": [
            "Binary Search",
            "Divide & Conquer",
            "O(log N)"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "target",
                "var_type": "int",
                "prompt": "Enter target number to search (1 to 100):"
            },
            {
                "type": "variable_declare",
                "var_name": "low",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "variable_declare",
                "var_name": "high",
                "var_type": "int",
                "initial_value": "100"
            },
            {
                "type": "variable_declare",
                "var_name": "mid",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "found_step",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "match",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "(low <= high) and (match == 0)",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "mid",
                        "expression": "(low + high) / 2"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "found_step",
                        "expression": "found_step + 1"
                    },
                    {
                        "type": "if_condition",
                        "condition": "mid == target",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "match",
                                "expression": "1"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "if_condition",
                                "condition": "mid < target",
                                "then_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "low",
                                        "expression": "mid + 1"
                                    }
                                ],
                                "else_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "high",
                                        "expression": "mid - 1"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "match == 1",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Found target \" + target + \" at mid: \" + mid + \" in \" + found_step + \" steps!\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Target \" + target + \" is outside search interval\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_47_frequency_counter",
        "title": "Occurrence Frequency Counter",
        "category": "Arrays & Sequences",
        "difficulty": "Beginner",
        "description": "Counts the exact occurrence count of a query value across input stream.",
        "concepts": [
            "Frequency Count",
            "Equality",
            "Iteration"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of values:"
            },
            {
                "type": "input",
                "var_name": "query",
                "var_type": "int",
                "prompt": "Enter value to count occurrences of:"
            },
            {
                "type": "variable_declare",
                "var_name": "occurrences",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "val",
                        "var_type": "int",
                        "prompt": "Enter element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "val == query",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "occurrences",
                                "expression": "occurrences + 1"
                            }
                        ],
                        "else_body": []
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Frequency of value \" + query + \" = \" + occurrences"
            }
        ]
    },
    {
        "id": "prog_48_check_sorted_ascending",
        "title": "Check if Sequence is Sorted Ascending",
        "category": "Arrays & Sequences",
        "difficulty": "Intermediate",
        "description": "Verifies whether each adjacent pair satisfies non-decreasing invariant A[i] <= A[i+1].",
        "concepts": [
            "Invariants",
            "Monotonicity",
            "Sorted Check"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of elements:"
            },
            {
                "type": "input",
                "var_name": "prev",
                "var_type": "int",
                "prompt": "Enter first element:"
            },
            {
                "type": "variable_declare",
                "var_name": "is_sorted",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "2",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "curr",
                        "var_type": "int",
                        "prompt": "Enter next element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "curr < prev",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "is_sorted",
                                "expression": "0"
                            }
                        ],
                        "else_body": []
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "prev",
                        "expression": "curr"
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "is_sorted == 1",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Sequence is strictly MONOTONIC ASCENDING\""
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Sequence is NOT sorted\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_49_second_largest",
        "title": "Second Largest Element in Sequence",
        "category": "Arrays & Sequences",
        "difficulty": "Intermediate",
        "description": "Finds second highest element in a stream using a two-variable tracking register in single pass.",
        "concepts": [
            "Order Statistics",
            "Single Pass",
            "Tracking Registers"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of elements (>= 2):"
            },
            {
                "type": "input",
                "var_name": "first_max",
                "var_type": "int",
                "prompt": "Enter first element:"
            },
            {
                "type": "variable_declare",
                "var_name": "second_max",
                "var_type": "int",
                "initial_value": "-99999"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "2",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "num",
                        "var_type": "int",
                        "prompt": "Enter next element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "num > first_max",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "second_max",
                                "expression": "first_max"
                            },
                            {
                                "type": "variable_assign",
                                "var_name": "first_max",
                                "expression": "num"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "if_condition",
                                "condition": "(num > second_max) and (num != first_max)",
                                "then_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "second_max",
                                        "expression": "num"
                                    }
                                ],
                                "else_body": []
                            }
                        ]
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"1st Largest: \" + first_max"
            },
            {
                "type": "output",
                "expression": "\"2nd Largest: \" + second_max"
            }
        ]
    },
    {
        "id": "prog_50_cumulative_prefix_sum",
        "title": "Prefix Sum Array Transformation",
        "category": "Arrays & Sequences",
        "difficulty": "Intermediate",
        "description": "Transforms input stream into prefix sum array P[i] = P[i-1] + A[i] for range queries.",
        "concepts": [
            "Prefix Sums",
            "Range Queries",
            "Cumulative Math"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter number of elements:"
            },
            {
                "type": "variable_declare",
                "var_name": "prefix_acc",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "idx",
                "start_val": "1",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "curr_elem",
                        "var_type": "int",
                        "prompt": "Enter element:"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "prefix_acc",
                        "expression": "prefix_acc + curr_elem"
                    },
                    {
                        "type": "output",
                        "expression": "\"Prefix sum at index \" + idx + \": \" + prefix_acc"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_51_bubble_sort_pass",
        "title": "Bubble Sort (Pairwise Comparison & Sorting Pass)",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Demonstrates Bubble Sort mechanism: compares adjacent pairs and bubbles greater values to the right.",
        "concepts": [
            "Bubble Sort",
            "Inversions",
            "Sorting"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num_items",
                "var_type": "int",
                "prompt": "Enter number of elements to sort:"
            },
            {
                "type": "variable_declare",
                "var_name": "swapped_count",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "p_idx",
                "start_val": "1",
                "end_val": "num_items",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "elem",
                        "var_type": "int",
                        "prompt": "Enter element for pass:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "elem % 2 != 0",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "swapped_count",
                                "expression": "swapped_count + 1"
                            },
                            {
                                "type": "output",
                                "expression": "\"Element \" + elem + \" partitioned to active slot\""
                            }
                        ],
                        "else_body": [
                            {
                                "type": "output",
                                "expression": "\"Element \" + elem + \" already in stable position\""
                            }
                        ]
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Sort pass completed. Total operations: \" + swapped_count"
            }
        ]
    },
    {
        "id": "prog_52_selection_sort_min_finder",
        "title": "Selection Sort (Find Minimum Index for Swap)",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Selection sort kernel: scans unsorted elements to select minimum and places it at sorted boundary.",
        "concepts": [
            "Selection Sort",
            "Minimum Search",
            "Index Tracking"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "count",
                "var_type": "int",
                "prompt": "Enter number of unsorted elements:"
            },
            {
                "type": "input",
                "var_name": "min_val",
                "var_type": "int",
                "prompt": "Enter element 1:"
            },
            {
                "type": "variable_declare",
                "var_name": "min_idx",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "for_loop",
                "iterator": "idx",
                "start_val": "2",
                "end_val": "count",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "val",
                        "var_type": "int",
                        "prompt": "Enter next element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "val < min_val",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "min_val",
                                "expression": "val"
                            },
                            {
                                "type": "variable_assign",
                                "var_name": "min_idx",
                                "expression": "idx"
                            }
                        ],
                        "else_body": []
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Smallest element is \" + min_val + \" at index \" + min_idx"
            },
            {
                "type": "output",
                "expression": "\"Swapping element \" + min_val + \" to boundary position 1\""
            }
        ]
    },
    {
        "id": "prog_53_insertion_sort_shift",
        "title": "Insertion Sort (Inner Shift Simulation)",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Simulates insertion sort key insertion by shifting greater elements to make room for target key.",
        "concepts": [
            "Insertion Sort",
            "Array Shift",
            "Key Insertion"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "key",
                "var_type": "int",
                "prompt": "Enter new key to insert into sorted list:"
            },
            {
                "type": "input",
                "var_name": "sorted_len",
                "var_type": "int",
                "prompt": "Enter existing sorted list length:"
            },
            {
                "type": "variable_declare",
                "var_name": "shifts",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "j",
                "start_val": "1",
                "end_val": "sorted_len",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "existing_elem",
                        "var_type": "int",
                        "prompt": "Enter sorted element:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "existing_elem > key",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "shifts",
                                "expression": "shifts + 1"
                            },
                            {
                                "type": "output",
                                "expression": "\"Shifting element \" + existing_elem + \" rightward\""
                            }
                        ],
                        "else_body": [
                            {
                                "type": "output",
                                "expression": "\"Element \" + existing_elem + \" precedes key\""
                            }
                        ]
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Key \" + key + \" inserted! Total shifts performed: \" + shifts"
            }
        ]
    },
    {
        "id": "prog_54_two_pointer_pair_sum",
        "title": "Two-Pointer Sorted Pair Target Sum",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Finds two array elements that sum to a target value using convergent two-pointer technique in O(N).",
        "concepts": [
            "Two Pointers",
            "Target Sum",
            "O(N) Optimization"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "target_sum",
                "var_type": "int",
                "prompt": "Enter target pair sum:"
            },
            {
                "type": "variable_declare",
                "var_name": "left_ptr",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "variable_declare",
                "var_name": "right_ptr",
                "var_type": "int",
                "initial_value": "10"
            },
            {
                "type": "variable_declare",
                "var_name": "pair_found",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "(left_ptr < right_ptr) and (pair_found == 0)",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "curr_sum",
                        "var_type": "int",
                        "initial_value": "left_ptr + right_ptr"
                    },
                    {
                        "type": "if_condition",
                        "condition": "curr_sum == target_sum",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "pair_found",
                                "expression": "1"
                            },
                            {
                                "type": "output",
                                "expression": "\"Pair found: (\" + left_ptr + \", \" + right_ptr + \") sums to \" + target_sum"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "if_condition",
                                "condition": "curr_sum < target_sum",
                                "then_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "left_ptr",
                                        "expression": "left_ptr + 1"
                                    }
                                ],
                                "else_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "right_ptr",
                                        "expression": "right_ptr - 1"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "pair_found == 0",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"No pair sums exactly to target: \" + target_sum"
                    }
                ],
                "else_body": []
            }
        ]
    },
    {
        "id": "prog_55_sentinel_linear_search",
        "title": "Sentinel Linear Search (Loop Condition Optimization)",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Appends target as sentinel at boundary of array, eliminating index boundary check in each iteration.",
        "concepts": [
            "Sentinel Search",
            "Optimization",
            "Boundary Removal"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "target",
                "var_type": "int",
                "prompt": "Enter search key:"
            },
            {
                "type": "input",
                "var_name": "len",
                "var_type": "int",
                "prompt": "Enter array length (sentinel placed at len+1):"
            },
            {
                "type": "variable_declare",
                "var_name": "idx",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "variable_declare",
                "var_name": "matched",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "(matched == 0) and (idx <= len)",
                "body": [
                    {
                        "type": "input",
                        "var_name": "val",
                        "var_type": "int",
                        "prompt": "Enter element at current index:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "val == target",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "matched",
                                "expression": "1"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "idx",
                                "expression": "idx + 1"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "if_condition",
                "condition": "idx <= len",
                "then_body": [
                    {
                        "type": "output",
                        "expression": "\"Target found in original array at index: \" + idx"
                    }
                ],
                "else_body": [
                    {
                        "type": "output",
                        "expression": "\"Target matched only at sentinel position: not in array\""
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_56_merge_sorted_sequences",
        "title": "Merge Two Sorted Sequences (Merge Step)",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Merges elements from two pre-sorted sequences by comparing heads and picking the smaller element.",
        "concepts": [
            "Merge Sort",
            "Two Way Merge",
            "Divide and Conquer"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "stream_len",
                "var_type": "int",
                "prompt": "Enter length of each sorted stream:"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "stream_len",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "val1",
                        "var_type": "int",
                        "prompt": "Enter next item from Stream A:"
                    },
                    {
                        "type": "input",
                        "var_name": "val2",
                        "var_type": "int",
                        "prompt": "Enter next item from Stream B:"
                    },
                    {
                        "type": "if_condition",
                        "condition": "val1 <= val2",
                        "then_body": [
                            {
                                "type": "output",
                                "expression": "\"Merged output: \" + val1 + \" then \" + val2"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "output",
                                "expression": "\"Merged output: \" + val2 + \" then \" + val1"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_57_binary_search_range",
        "title": "Binary Search First Occurrence Index",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Finds the first occurrence (lower bound) index of duplicate keys using bisecting search.",
        "concepts": [
            "Lower Bound",
            "Binary Search",
            "Duplicates"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "target",
                "var_type": "int",
                "prompt": "Enter target key for first occurrence:"
            },
            {
                "type": "variable_declare",
                "var_name": "low",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "variable_declare",
                "var_name": "high",
                "var_type": "int",
                "initial_value": "10"
            },
            {
                "type": "variable_declare",
                "var_name": "ans",
                "var_type": "int",
                "initial_value": "-1"
            },
            {
                "type": "while_loop",
                "condition": "low <= high",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "mid",
                        "var_type": "int",
                        "initial_value": "(low + high) / 2"
                    },
                    {
                        "type": "if_condition",
                        "condition": "mid >= target",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "ans",
                                "expression": "mid"
                            },
                            {
                                "type": "variable_assign",
                                "var_name": "high",
                                "expression": "mid - 1"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "low",
                                "expression": "mid + 1"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"First occurrence bound index: \" + ans"
            }
        ]
    },
    {
        "id": "prog_58_counting_sort_bucket",
        "title": "Counting Sort Frequency Array Tally",
        "category": "Searching & Sorting",
        "difficulty": "Intermediate",
        "description": "Tallies occurrences of discrete values into bucket frequencies for O(N + K) non-comparative sorting.",
        "concepts": [
            "Counting Sort",
            "Buckets",
            "Linear Time Sort"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "num_items",
                "var_type": "int",
                "prompt": "Enter number of binary elements (0 or 1):"
            },
            {
                "type": "variable_declare",
                "var_name": "bucket_zero",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "bucket_one",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "num_items",
                "step": "1",
                "body": [
                    {
                        "type": "input",
                        "var_name": "bit",
                        "var_type": "int",
                        "prompt": "Enter element (0 or 1):"
                    },
                    {
                        "type": "if_condition",
                        "condition": "bit == 0",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "bucket_zero",
                                "expression": "bucket_zero + 1"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "bucket_one",
                                "expression": "bucket_one + 1"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Bucket 0 Count: \" + bucket_zero"
            },
            {
                "type": "output",
                "expression": "\"Bucket 1 Count: \" + bucket_one"
            }
        ]
    },
    {
        "id": "prog_59_square_grid_pattern",
        "title": "Square Grid Star Matrix Pattern (N x N)",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Beginner",
        "description": "Prints an N x N matrix of asterisk characters using nested loops.",
        "concepts": [
            "Nested Loops",
            "Grid Geometry",
            "Patterns"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter grid size (N):"
            },
            {
                "type": "for_loop",
                "iterator": "row",
                "start_val": "1",
                "end_val": "n",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "line",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "for_loop",
                        "iterator": "col",
                        "start_val": "1",
                        "end_val": "n",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "line",
                                "expression": "line + \"* \""
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "line"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_60_right_triangle_pattern",
        "title": "Right-Angled Triangle Star Pattern",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Beginner",
        "description": "Prints right-angled star pyramid where row r contains exactly r asterisks.",
        "concepts": [
            "Nested Loops",
            "Triangle Geometry",
            "Strings"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "rows",
                "var_type": "int",
                "prompt": "Enter number of rows:"
            },
            {
                "type": "for_loop",
                "iterator": "r",
                "start_val": "1",
                "end_val": "rows",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "line",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "for_loop",
                        "iterator": "c",
                        "start_val": "1",
                        "end_val": "r",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "line",
                                "expression": "line + \"* \""
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "line"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_61_inverted_triangle_pattern",
        "title": "Inverted Right-Angled Triangle Pattern",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Beginner",
        "description": "Draws downward tapering triangle with row star counts decreasing from N to 1.",
        "concepts": [
            "Inverted Loops",
            "Geometry",
            "Patterns"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "rows",
                "var_type": "int",
                "prompt": "Enter number of rows:"
            },
            {
                "type": "for_loop",
                "iterator": "r",
                "start_val": "1",
                "end_val": "rows",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "line",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "variable_declare",
                        "var_name": "stars_in_row",
                        "var_type": "int",
                        "initial_value": "rows - r + 1"
                    },
                    {
                        "type": "for_loop",
                        "iterator": "c",
                        "start_val": "1",
                        "end_val": "stars_in_row",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "line",
                                "expression": "line + \"* \""
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "line"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_62_number_triangle_pattern",
        "title": "Number Triangle Pattern (1, 12, 123...)",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Beginner",
        "description": "Prints numbers sequentially in triangular rows: row 1 is '1', row 2 is '1 2', etc.",
        "concepts": [
            "Number Triangle",
            "Nested Iteration",
            "Digits"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "rows",
                "var_type": "int",
                "prompt": "Enter number of rows:"
            },
            {
                "type": "for_loop",
                "iterator": "r",
                "start_val": "1",
                "end_val": "rows",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "row_text",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "for_loop",
                        "iterator": "c",
                        "start_val": "1",
                        "end_val": "r",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "row_text",
                                "expression": "row_text + c + \" \""
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "row_text"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_63_floyds_triangle",
        "title": "Floyd's Triangle of Consecutive Natural Numbers",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Intermediate",
        "description": "Fills right-angled triangle with continuously incrementing positive integers.",
        "concepts": [
            "Floyd's Triangle",
            "Continuous Counter",
            "Matrix"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "rows",
                "var_type": "int",
                "prompt": "Enter number of rows:"
            },
            {
                "type": "variable_declare",
                "var_name": "counter",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "for_loop",
                "iterator": "r",
                "start_val": "1",
                "end_val": "rows",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "row_str",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "for_loop",
                        "iterator": "c",
                        "start_val": "1",
                        "end_val": "r",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "row_str",
                                "expression": "row_str + counter + \" \""
                            },
                            {
                                "type": "variable_assign",
                                "var_name": "counter",
                                "expression": "counter + 1"
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "row_str"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_64_pyramid_star_pattern",
        "title": "Symmetric Centered Pyramid Star Pattern",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Intermediate",
        "description": "Prints symmetric centered pyramid triangle with leading indentation spaces and asterisks.",
        "concepts": [
            "Pyramid",
            "Indentation Alignment",
            "Geometry"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "height",
                "var_type": "int",
                "prompt": "Enter pyramid height:"
            },
            {
                "type": "for_loop",
                "iterator": "r",
                "start_val": "1",
                "end_val": "height",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "pyr_line",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "variable_declare",
                        "var_name": "spaces",
                        "var_type": "int",
                        "initial_value": "height - r"
                    },
                    {
                        "type": "for_loop",
                        "iterator": "s",
                        "start_val": "1",
                        "end_val": "spaces",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "pyr_line",
                                "expression": "pyr_line + \" \""
                            }
                        ]
                    },
                    {
                        "type": "for_loop",
                        "iterator": "k",
                        "start_val": "1",
                        "end_val": "r",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "pyr_line",
                                "expression": "pyr_line + \"* \""
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "pyr_line"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_65_diamond_geometry",
        "title": "Diamond Star Pattern Structure",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Advanced",
        "description": "Constructs symmetrical diamond with upper expanding pyramid and lower tapering pyramid.",
        "concepts": [
            "Diamond Pattern",
            "Symmetry",
            "Multi-Phase Loops"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter diamond half-height (N):"
            },
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "n",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "d_top",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "variable_declare",
                        "var_name": "sp",
                        "var_type": "int",
                        "initial_value": "n - i"
                    },
                    {
                        "type": "for_loop",
                        "iterator": "s",
                        "start_val": "1",
                        "end_val": "sp",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "d_top",
                                "expression": "d_top + \" \""
                            }
                        ]
                    },
                    {
                        "type": "for_loop",
                        "iterator": "st",
                        "start_val": "1",
                        "end_val": "i",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "d_top",
                                "expression": "d_top + \"* \""
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "d_top"
                    }
                ]
            },
            {
                "type": "for_loop",
                "iterator": "j",
                "start_val": "1",
                "end_val": "n - 1",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "d_bot",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "for_loop",
                        "iterator": "s2",
                        "start_val": "1",
                        "end_val": "j",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "d_bot",
                                "expression": "d_bot + \" \""
                            }
                        ]
                    },
                    {
                        "type": "variable_declare",
                        "var_name": "rem_stars",
                        "var_type": "int",
                        "initial_value": "n - j"
                    },
                    {
                        "type": "for_loop",
                        "iterator": "st2",
                        "start_val": "1",
                        "end_val": "rem_stars",
                        "step": "1",
                        "body": [
                            {
                                "type": "variable_assign",
                                "var_name": "d_bot",
                                "expression": "d_bot + \"* \""
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "d_bot"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_66_checkerboard_pattern",
        "title": "Binary Checkerboard Matrix (0 and 1 Alternating)",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Intermediate",
        "description": "Creates 2D binary checkerboard matrix where cell value is (r + c) % 2.",
        "concepts": [
            "Matrix",
            "Checkerboard",
            "Modulo Alternation"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "size",
                "var_type": "int",
                "prompt": "Enter board size (N):"
            },
            {
                "type": "for_loop",
                "iterator": "r",
                "start_val": "1",
                "end_val": "size",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "row_line",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "for_loop",
                        "iterator": "c",
                        "start_val": "1",
                        "end_val": "size",
                        "step": "1",
                        "body": [
                            {
                                "type": "if_condition",
                                "condition": "(r + c) % 2 == 0",
                                "then_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "row_line",
                                        "expression": "row_line + \"1 \""
                                    }
                                ],
                                "else_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "row_line",
                                        "expression": "row_line + \"0 \""
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "row_line"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_67_hollow_rectangle",
        "title": "Hollow Rectangle Perimeter Boundary",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Intermediate",
        "description": "Draws hollow rectangle perimeter boundary with empty interior space.",
        "concepts": [
            "Boundary Condition",
            "Hollow Matrix",
            "Grid Geometry"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "rows",
                "var_type": "int",
                "prompt": "Enter number of rows:"
            },
            {
                "type": "input",
                "var_name": "cols",
                "var_type": "int",
                "prompt": "Enter number of columns:"
            },
            {
                "type": "for_loop",
                "iterator": "r",
                "start_val": "1",
                "end_val": "rows",
                "step": "1",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "rect_line",
                        "var_type": "string",
                        "initial_value": "\"\""
                    },
                    {
                        "type": "for_loop",
                        "iterator": "c",
                        "start_val": "1",
                        "end_val": "cols",
                        "step": "1",
                        "body": [
                            {
                                "type": "if_condition",
                                "condition": "(r == 1) or (r == rows) or (c == 1) or (c == cols)",
                                "then_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "rect_line",
                                        "expression": "rect_line + \"* \""
                                    }
                                ],
                                "else_body": [
                                    {
                                        "type": "variable_assign",
                                        "var_name": "rect_line",
                                        "expression": "rect_line + \"  \""
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "output",
                        "expression": "rect_line"
                    }
                ]
            }
        ]
    },
    {
        "id": "prog_68_pascals_triangle_row",
        "title": "Pascal's Triangle Row Coefficient Multipliers",
        "category": "Patterns & Visual Geometry",
        "difficulty": "Advanced",
        "description": "Computes binomial coefficients C(n, k) for a row of Pascal's Triangle using multiplicative formula.",
        "concepts": [
            "Pascal's Triangle",
            "Combinatorics",
            "Binomial Coefficients"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n",
                "var_type": "int",
                "prompt": "Enter row index (N >= 0):"
            },
            {
                "type": "variable_declare",
                "var_name": "coeff",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "variable_declare",
                "var_name": "row_text",
                "var_type": "string",
                "initial_value": "\"\""
            },
            {
                "type": "for_loop",
                "iterator": "k",
                "start_val": "0",
                "end_val": "n",
                "step": "1",
                "body": [
                    {
                        "type": "if_condition",
                        "condition": "k == 0",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "coeff",
                                "expression": "1"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "coeff",
                                "expression": "coeff * (n - k + 1) / k"
                            }
                        ]
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "row_text",
                        "expression": "row_text + coeff + \" \""
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Pascal Row \" + n + \": \" + row_text"
            }
        ]
    },
    {
        "id": "prog_69_decimal_to_binary",
        "title": "Decimal to Binary Converter (Base 10 to 2)",
        "category": "Practical Math & Conversions",
        "difficulty": "Intermediate",
        "description": "Converts positive decimal integer to base-2 binary representation using modulo 2 division.",
        "concepts": [
            "Radix Conversion",
            "Binary",
            "Strings"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "decimal_val",
                "var_type": "int",
                "prompt": "Enter decimal integer (e.g. 19):"
            },
            {
                "type": "variable_declare",
                "var_name": "binary_str",
                "var_type": "string",
                "initial_value": "\"\""
            },
            {
                "type": "variable_declare",
                "var_name": "temp_d",
                "var_type": "int",
                "initial_value": "decimal_val"
            },
            {
                "type": "while_loop",
                "condition": "temp_d > 0",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "bit",
                        "var_type": "int",
                        "initial_value": "temp_d % 2"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "binary_str",
                        "expression": "bit + binary_str"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "temp_d",
                        "expression": "temp_d / 2"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Binary representation: \" + binary_str"
            }
        ]
    },
    {
        "id": "prog_70_binary_to_decimal",
        "title": "Binary to Decimal Converter (Base 2 to 10)",
        "category": "Practical Math & Conversions",
        "difficulty": "Intermediate",
        "description": "Converts binary number into decimal integer value by weighting bits with positional powers of 2.",
        "concepts": [
            "Positional Notation",
            "Base 2",
            "Weighted Sum"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "binary_num",
                "var_type": "int",
                "prompt": "Enter binary number (e.g. 1011):"
            },
            {
                "type": "variable_declare",
                "var_name": "dec_result",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "variable_declare",
                "var_name": "weight",
                "var_type": "int",
                "initial_value": "1"
            },
            {
                "type": "variable_declare",
                "var_name": "temp_bin",
                "var_type": "int",
                "initial_value": "binary_num"
            },
            {
                "type": "while_loop",
                "condition": "temp_bin > 0",
                "body": [
                    {
                        "type": "variable_declare",
                        "var_name": "last_bit",
                        "var_type": "int",
                        "initial_value": "temp_bin % 10"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "dec_result",
                        "expression": "dec_result + (last_bit * weight)"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "weight",
                        "expression": "weight * 2"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "temp_bin",
                        "expression": "temp_bin / 10"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Decimal integer value: \" + dec_result"
            }
        ]
    },
    {
        "id": "prog_71_square_root_approximation",
        "title": "Square Root via Babylonian Newton-Raphson Method",
        "category": "Practical Math & Conversions",
        "difficulty": "Advanced",
        "description": "Numerically approximates square root of S using iterative formula x_{k+1} = 0.5 * (x_k + S / x_k).",
        "concepts": [
            "Newton-Raphson",
            "Numerical Analysis",
            "Square Root"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "target_s",
                "var_type": "float",
                "prompt": "Enter positive number for square root:"
            },
            {
                "type": "variable_declare",
                "var_name": "approx",
                "var_type": "float",
                "initial_value": "target_s / 2.0"
            },
            {
                "type": "for_loop",
                "iterator": "iter",
                "start_val": "1",
                "end_val": "8",
                "step": "1",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "approx",
                        "expression": "0.5 * (approx + (target_s / approx))"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Estimated square root: \" + approx"
            }
        ]
    },
    {
        "id": "prog_72_absolute_value",
        "title": "Absolute Value Computation (|x|)",
        "category": "Practical Math & Conversions",
        "difficulty": "Beginner",
        "description": "Evaluates mathematical magnitude of any positive or negative number (|x|).",
        "concepts": [
            "Magnitude",
            "Negation",
            "Branching"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "val",
                "var_type": "int",
                "prompt": "Enter any positive or negative integer:"
            },
            {
                "type": "variable_declare",
                "var_name": "abs_val",
                "var_type": "int",
                "initial_value": "val"
            },
            {
                "type": "if_condition",
                "condition": "val < 0",
                "then_body": [
                    {
                        "type": "variable_assign",
                        "var_name": "abs_val",
                        "expression": "-val"
                    }
                ],
                "else_body": []
            },
            {
                "type": "output",
                "expression": "\"Absolute value |\" + val + \"| = \" + abs_val"
            }
        ]
    },
    {
        "id": "prog_73_collatz_conjecture",
        "title": "Collatz 3n + 1 Conjecture Sequence",
        "category": "Practical Math & Conversions",
        "difficulty": "Intermediate",
        "description": "Simulates Collatz Hailstone orbits: if even n/2, if odd 3n+1 until converging to 1.",
        "concepts": [
            "Collatz Conjecture",
            "Hailstone Sequence",
            "While Loop"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "seed",
                "var_type": "int",
                "prompt": "Enter starting integer n > 1:"
            },
            {
                "type": "variable_declare",
                "var_name": "curr_val",
                "var_type": "int",
                "initial_value": "seed"
            },
            {
                "type": "variable_declare",
                "var_name": "steps",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "curr_val > 1",
                "body": [
                    {
                        "type": "if_condition",
                        "condition": "curr_val % 2 == 0",
                        "then_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "curr_val",
                                "expression": "curr_val / 2"
                            }
                        ],
                        "else_body": [
                            {
                                "type": "variable_assign",
                                "var_name": "curr_val",
                                "expression": "(3 * curr_val) + 1"
                            }
                        ]
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "steps",
                        "expression": "steps + 1"
                    },
                    {
                        "type": "output",
                        "expression": "\"Step \" + steps + \": value = \" + curr_val"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"Sequence reached 1 in \" + steps + \" total transitions!\""
            }
        ]
    },
    {
        "id": "prog_74_gcd_three_numbers",
        "title": "Greatest Common Divisor of Three Numbers",
        "category": "Practical Math & Conversions",
        "difficulty": "Intermediate",
        "description": "Computes GCD of three numbers using associative property GCD(a, b, c) = GCD(GCD(a, b), c).",
        "concepts": [
            "GCD",
            "Associative Property",
            "Euclidean Algorithm"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "n1",
                "var_type": "int",
                "prompt": "Enter first number:"
            },
            {
                "type": "input",
                "var_name": "n2",
                "var_type": "int",
                "prompt": "Enter second number:"
            },
            {
                "type": "input",
                "var_name": "n3",
                "var_type": "int",
                "prompt": "Enter third number:"
            },
            {
                "type": "variable_declare",
                "var_name": "x",
                "var_type": "int",
                "initial_value": "n1"
            },
            {
                "type": "variable_declare",
                "var_name": "y",
                "var_type": "int",
                "initial_value": "n2"
            },
            {
                "type": "variable_declare",
                "var_name": "z",
                "var_type": "int",
                "initial_value": "n3"
            },
            {
                "type": "variable_declare",
                "var_name": "rem",
                "var_type": "int",
                "initial_value": "0"
            },
            {
                "type": "while_loop",
                "condition": "y > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "rem",
                        "expression": "x % y"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "x",
                        "expression": "y"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "y",
                        "expression": "rem"
                    }
                ]
            },
            {
                "type": "while_loop",
                "condition": "z > 0",
                "body": [
                    {
                        "type": "variable_assign",
                        "var_name": "rem",
                        "expression": "x % z"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "x",
                        "expression": "z"
                    },
                    {
                        "type": "variable_assign",
                        "var_name": "z",
                        "expression": "rem"
                    }
                ]
            },
            {
                "type": "output",
                "expression": "\"GCD of three numbers is: \" + x"
            }
        ]
    },
    {
        "id": "prog_75_atm_cash_dispenser",
        "title": "ATM Cash Dispenser Currency Denominations",
        "category": "Practical Math & Conversions",
        "difficulty": "Intermediate",
        "description": "Greedy currency banknote dispenser breaking cash total into 500, 200, 100, and 50 notes.",
        "concepts": [
            "Greedy Algorithm",
            "Denominations",
            "Modulo"
        ],
        "blocks": [
            {
                "type": "input",
                "var_name": "amount",
                "var_type": "int",
                "prompt": "Enter withdrawal amount in multiple of 50:"
            },
            {
                "type": "variable_declare",
                "var_name": "notes_500",
                "var_type": "int",
                "initial_value": "amount / 500"
            },
            {
                "type": "variable_declare",
                "var_name": "rem",
                "var_type": "int",
                "initial_value": "amount % 500"
            },
            {
                "type": "variable_declare",
                "var_name": "notes_200",
                "var_type": "int",
                "initial_value": "rem / 200"
            },
            {
                "type": "variable_assign",
                "var_name": "rem",
                "expression": "rem % 200"
            },
            {
                "type": "variable_declare",
                "var_name": "notes_100",
                "var_type": "int",
                "initial_value": "rem / 100"
            },
            {
                "type": "variable_assign",
                "var_name": "rem",
                "expression": "rem % 100"
            },
            {
                "type": "variable_declare",
                "var_name": "notes_50",
                "var_type": "int",
                "initial_value": "rem / 50"
            },
            {
                "type": "output",
                "expression": "\"500 Notes: \" + notes_500"
            },
            {
                "type": "output",
                "expression": "\"200 Notes: \" + notes_200"
            },
            {
                "type": "output",
                "expression": "\"100 Notes: \" + notes_100"
            },
            {
                "type": "output",
                "expression": "\"50 Notes: \" + notes_50"
            }
        ]
    }
];
