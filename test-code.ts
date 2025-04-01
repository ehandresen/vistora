function formatNumberWithDecimal(num: number): string {
  //   // 49.99 <– split on the dot
  //   const [int, decimal] = num.toString().split(".");

  //   return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
  return num.toFixed(2);
}

const result = formatNumberWithDecimal(10);
console.log("🚀 ~ result:", result);

const result2 = formatNumberWithDecimal(19.555555);
console.log("🚀 ~ result2:", result2);
