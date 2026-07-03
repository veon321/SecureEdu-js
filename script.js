const users = [
  { id: 1, name: "Jan Kowalski", role: "admin" },
  { id: 2, name: "Anna Nowak", role: "teacher" },
  { id: 3, name: "Piotr Gryz", role: "student", grades: [3, 4, 5] },
  { id: 4, name: "Marta Żak", role: "guest" },
];

const startButtons = document.querySelectorAll(".user");
const menuContainer = document.getElementById("menu-container");
const optionRole = document.getElementById("option-role");

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
  listUser.innerHTML = "";

  users.forEach((user) => {
    const gradesDisplay = Array.isArray(user.grades)
      ? user.grades.join(", ")
      : "Brak";

    const divuser = document.createElement("div");
    divuser.classList.add("user-card");

    const pId = document.createElement("p");
    pId.textContent = `ID: ${user.id}`;

    const pName = document.createElement("p");
    pName.textContent = `Imię: ${user.name}`;

    const pRole = document.createElement("p");
    pRole.textContent = `Rola: ${user.role}`;

    const pGrades = document.createElement("p");
    pGrades.textContent = `Oceny: ${gradesDisplay}`;

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

  const optionList = document.getElementById("user-role");
  optionList.innerHTML = "";

  const uniqueRoles = [...new Set(users.map((user) => user.role))];

  uniqueRoles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    optionList.appendChild(option);
  });
};

const addUserButton = document.getElementById("addUser-button");

const addUser = function () {
  const usernameInput = document.getElementById("name");
  const username = usernameInput.value.trim(); //
  const role = document.getElementById("user-role").value;

  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  if (username === "") {
    alert("Wprowadź nazwę użytkownika!");
    return;
  }

  users.push({ id: newId, name: username, role: role, grades: [] });

  usernameInput.value = "";

  admin();
};
addUserButton.addEventListener("click", addUser);

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
