# Simple Split
Fully local, data stored in browser, one-page simple split calculator.


## Data Schemas

names: ["person 1", "person 2"]

items: [{
    description: "item1",
    cost: "20",
    who_paid: "person 1",
    to_receive_from: ["person 1", "person 2"]
}]

p2p: [{
    payee: "person 1",
    recipient: "person 2",
    cost: "10"
}]

## Adjacency Matrix

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


## To-Dos:
- add logging for items - take from local storage
- add import/export functionality - out to json and back into local storage
- if delete people involved, all data related to the person will have to be removed.
 -> need to show pop-up notification + design that.
- might need to fix the id thingy
- test for breaking changes if user does not use the app linearly (jump between sections)
- table styling
- save screenshot - do an exported img of the important details:
  - who paid for what, who paid who + summary
