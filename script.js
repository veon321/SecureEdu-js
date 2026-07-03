const users = [
  { id: 1, name: "Jan Kowalski", role: "admin" },
  { id: 2, name: "Anna Nowak", role: "teacher" },
  { id: 3, name: "Piotr Gryz", role: "student", grades: [3, 4, 5] },
  { id: 4, name: "Marta Żak", role: "guest" },
];

const startButtons = document.querySelectorAll(".user");
const menuContainer = document.getElementById("menu-container");

const showPanel = function (event) {
  const user = event.target.classList[1];
  const panel = document.querySelector(`.panel.${user}`);

  panel.classList.remove("hidden");
  menuContainer.classList.add("hidden");

  const runRoleMechanics = roleRegistry[user];

  if (runRoleMechanics) {
    runRoleMechanics(user);
  } else {
    console.error(`Nie znaleziono mechanik dla roli: ${user}`);
  }
};

startButtons.forEach((button) => {
  button.addEventListener("click", showPanel);
});

const admin = function (user) {
  console.log(user);
};

const teacher = function (user) {
  console.log(user);
};

const student = function (user) {
  console.log(user);
};

const guest = function (user) {
  console.log(user);
};

const roleRegistry = {
  admin: admin,
  teacher: teacher,
  student: student,
  guest: guest,
};
