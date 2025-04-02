function twoSum(nums: number[], target: number): number[] {
  let counter = 1;

  for (const num of nums) {
    if (Number(num) + nums[counter] === target) {
      return [counter - 1, counter];
    }
    counter++;
  }
  return [];
}

const array = [3, 2, 3];
const target = 6;

const result = twoSum(array, target);
console.log("🚀 ~ result:", result);
