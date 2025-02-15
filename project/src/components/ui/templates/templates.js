
function daysUntilEndOfMonth() {
    const today = new Date(); 
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const diffTime = lastDay - today; 
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

const template = "Привет, {{name}}! Сегодня {{dayOfWeek}} до зарплаты {{XYZ}} {{Salary}} дней.";
const data = {
  name: () => "Паша",
  dayOfWeek: () => new Date().toLocaleString('ru', { weekday: 'long' }),
  Salary: () => daysUntilEndOfMonth()

};

const result = template.replace(/{{(.*?)}}/g, (_, key) => {
  const func = data[key.trim()];
  return typeof func === "function" ? func() : '';
});

console.log(result);

