const sum_to_n_a = (n) => {
  if (n < 0) {
    return 0;
  }
  return (n * (n + 1)) / 2;
}

const sum_to_n_b = (n) => {
  if (n < 0) {
    return 0;
  }
  return n === 1 ? 1 : n + sum_to_n_b(n - 1);
}

const sum_to_n_c = (n) => {
  if (n < 0) {
    return 0;
  }
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

sum_to_n_a(5);
sum_to_n_b(5);
sum_to_n_c(5);