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

const admin = function () {
  const listUser = document.getElementById("user-list");

  users.forEach((user) => {
    if (user.grades === undefined) {
      user.grades = "Brak";
    }

    const divuser = document.createElement("div");
    divuser.classList.add("user-card");

    const pId = document.createElement("p");
    pId.textContent = `ID: ${user.id}`;

    const pName = document.createElement("p");
    pName.textContent = `Imię: ${user.name}`;

    const pRole = document.createElement("p");
    pRole.textContent = `Rola: ${user.role}`;

    const pGrades = document.createElement("p");
    pGrades.textContent = `Oceny: ${user.grades}`;

    const edit = document.createElement("button");
    edit.innerHTML = "edit";

    const remove = document.createElement("button");
    remove.innerHTML = "remove";

    divuser.appendChild(pId);
    divuser.appendChild(pName);
    divuser.appendChild(pRole);
    divuser.appendChild(pGrades);
    divuser.appendChild(edit);
    divuser.appendChild(remove);

    listUser.appendChild(divuser);
  });
};

const teacher = function () {
  console.log("teacher");
};

const student = function () {
  console.log("student");
};

const guest = function () {
  console.log("guest");
};

const roleRegistry = {
  admin: admin,
  teacher: teacher,
  student: student,
  guest: guest,
};
