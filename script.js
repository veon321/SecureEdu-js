const users = [
  { id: 1, name: "Jan Kowalski", role: "admin" },
  { id: 2, name: "Anna Nowak", role: "teacher" },
  { id: 3, name: "Piotr Gryz", role: "student", grades: [3, 4, 5] },
  { id: 4, name: "Marta Żak", role: "guest" },
];

const roles = [
  { role: "admin" },
  { role: "teacher" },
  { role: "student" },
  { role: "guest" },
];

const admin = () => {
  const listUser = document.getElementById("user-list");
  listUser.innerHTML = "";

  users.forEach(({ id, name, role, grades }) => {
    const gradesDisplay = Array.isArray(grades) ? grades.join(", ") : "Brak";

    const divuser = document.createElement("div");
    divuser.classList.add("user-card");

    divuser.innerHTML = `
      <p>ID: ${id}</p>
      <p>Imię: ${name}</p>
      <p>Rola: ${role}</p>
      <p>Oceny: ${gradesDisplay}</p>
      <button class="edit-btn">edit</button>
      <button class="remove-btn">remove</button>
    `;

    divuser.dataset.id = `${id}`;
    listUser.appendChild(divuser);
  });

  const optionList = document.getElementById("user-role");
  optionList.innerHTML = "";

  roles.forEach(({ role }) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    optionList.appendChild(option);
  });

  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) =>
    button.addEventListener("click", removeUser),
  );
};

const teacher = () => console.log("teacher");
const student = () => console.log("student");
const guest = () => console.log("guest");

const roleRegistry = { admin, teacher, student, guest };

const startButtons = document.querySelectorAll(".user");
const menuContainer = document.getElementById("menu-container");
const addUserButton = document.getElementById("addUser-button");

const showPanel = function (event) {
  const userRole = event.target.dataset.role;
  const panel = document.querySelector(`.panel.${userRole}`);

  if (panel) panel.classList.remove("hidden");
  menuContainer.classList.add("hidden");

  const runRoleMechanics = roleRegistry[userRole];
  if (runRoleMechanics) {
    runRoleMechanics();
  } else {
    console.error(`Nie znaleziono mechanik dla roli: ${userRole}`);
  }
};

const addUser = function () {
  const usernameInput = document.getElementById("name");
  const username = usernameInput.value.trim();
  const role = document.getElementById("user-role").value;

  if (username === "") {
    alert("Wprowadź nazwę użytkownika!");
    return;
  }

  const lastUser = users[users.length - 1];
  const newId = lastUser ? lastUser.id + 1 : 1;

  users.push({ id: newId, name: username, role, grades: [] });
  usernameInput.value = "";

  admin();
};

const removeUser = function (event) {
  const parent = event.target.parentElement;
  const id = Number(parent.dataset.id);

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }

  admin();
};

startButtons.forEach((button) => button.addEventListener("click", showPanel));
addUserButton.addEventListener("click", addUser);
