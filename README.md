# split-money-calculator
like a splitwise app - budget dumb down version without data persistence


todo:
- add logging for items - take from local storage
- finish up the who paid who structure
- think about datastructure for the calculation and tabulation logic | need to include the offsetting logic
- add import/export functionality - out to json and back into local storage

- add section to say: who should pay who and what is left for the total up balance.

- if delete people involved, all data related to the person will have to be removed.
 -> need to show pop-up notification + design that.

- might need to fix the id thingy


- need to create a 'contra' feature to net off the pay and receive
- need to handle overpayment ?
- who paid who feature not done
- who owe who summary under who paid for items - logs not rendered

# Adjacency Matrix

Use this to track and tally up balances.

- Use the names arr as index reference
e.g:
names = ["person 1", "person 2", "person 3"]
idx = 0, 1, 2

We then create a matrix to represent the r/s
x: represents "owing" r/s. e.g person 1 have to pay person 2
y: represents "to receive" r/s. e.g person 1 have to receive from person 2

Example:
            1    2    3
1(idx 0)    0    10   5
2(idx 1)    3    0    5
3(idx 2)    6    8    0

1 owes 2 $10 and 3 $5
1 to receive $3 from 2 and $6 from 3

Contra - meaning offset
do this by taking the difference and applying absolute to it (remove negative)
[1][2] offset with [2][1]:
abs(10 - 3) = 7
the other way also works:
abs(3 - 10) = 7
