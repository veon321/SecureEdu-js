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
    divuser.dataset.id = `${id}`;

    divuser.innerHTML = `
      <div class="user-info">
        <p>ID: ${id}</p>
        <p>Imię: ${name}</p>
        <p>Rola: ${role}</p>
        <p>Oceny: ${gradesDisplay}</p>
        <button class="edit-btn">edit</button>
        <button class="remove-btn">remove</button>
      </div>
    `;

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

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", editUser);
  });
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
  const parent = event.target.closest(".user-card");
  const id = Number(parent.dataset.id);

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }

  admin();
};

const editUser = function (event) {
  const parent = event.target.closest(".user-card");
  const divEdit = parent ? parent.querySelector(".edit-div") : null;
  if (divEdit) {
    divEdit.remove();
    return;
  }
  const editDiv = document.createElement("div");
  editDiv.classList.add("edit-div");

  editDiv.innerHTML = `
  Panel edycji
      <label
        >Nazwa użytkownika: <input type="text" class="name-edit" id="name-edit" />
      </label>

      <label
        >Oceny: <input type="number" class="grade-edit" id="grade-edit" />
      </label>

      <label>Rola: <select class="role-edit" id="role-edit"></select></label>

      <button type="button" id="edit-apply" class="edit-apply">Apply</button>

  `;

  parent.appendChild(editDiv);

  const optionList = document.getElementById("role-edit");

  roles.forEach(({ role }) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    optionList.appendChild(option);
  });

  const applyButton = document.getElementById("edit-apply");

  applyButton.addEventListener("click", () => {
    const newName = document.getElementById("name-edit").value;
    const gradeInput = document.getElementById("grade-edit");
    const newGrade = parseInt(gradeInput.value);
    const newRole = document.getElementById("role-edit").value;

    const parent = event.target.closest(".user-card");
    const userIndex = users.findIndex(
      (user) => user.id === Number(parent.dataset.id),
    );
    users[userIndex].name = newName;
    users[userIndex].role = newRole;
    users[userIndex].grades = newGrade;
    admin();
  });
};

startButtons.forEach((button) => {
  button.addEventListener("click", showPanel);
});

addUserButton.addEventListener("click", addUser);
