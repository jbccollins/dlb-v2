import { tester } from "@/tests";

function add(a: number, b: number) {
  return a + b;
}

const testAdd = tester('add', add);

testAdd({
  name: 'adds two numbers',
  input: [1, 2],
  outputResolver: (output) => {
    expect(output).toBe(3);
  },
});

testAdd({
  name: 'adds two other numbers',
  input: [1, 3],
  outputResolver: (output) => {
    expect(output).toBe(4);
  },
});