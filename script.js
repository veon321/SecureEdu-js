const users = [
  { id: 1, name: "Jan Kowalski", role: "admin" },
  { id: 2, name: "Anna Nowak", role: "teacher" },
  { id: 3, name: "Piotr Gryz", role: "student", grades: [3, 4, 5] },
  { id: 4, name: "Marta Żak", role: "guest" },
  { id: 5, name: "test", role: "student", grades: [3, 4, 5] },
];

const roles = ["admin", "teacher", "student", "guest"];

const populateRoleOptions = (selectEl, selectedRole = null) => {
  selectEl.replaceChildren();
  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    if (role === selectedRole) option.selected = true;
    selectEl.appendChild(option);
  });
};

const admin = () => {
  const listUser = document.getElementById("user-list");
  listUser.replaceChildren();

  users.forEach(({ id, name, role, grades }) => {
    const gradesDisplay =
      Array.isArray(grades) && grades.length > 0 ? grades.join(", ") : "Brak";

    const divUser = document.createElement("div");
    divUser.classList.add("user-card");
    divUser.dataset.id = `${id}`;

    divUser.setHTMLUnsafe(`
      <div class="user-info">
        <p class="u-id"></p>
        <p class="u-name"></p>
        <p class="u-role"></p>
        <p class="u-grades"></p>
        <button class="edit-btn">edit</button>
        <button class="remove-btn">remove</button>
      </div>
    `);

    divUser.querySelector(".u-id").textContent = `ID: ${id}`;
    divUser.querySelector(".u-name").textContent = `Imię: ${name}`;
    divUser.querySelector(".u-role").textContent = `Rola: ${role}`;
    divUser.querySelector(".u-grades").textContent = `Oceny: ${gradesDisplay}`;

    listUser.appendChild(divUser);
  });

  populateRoleOptions(document.getElementById("user-role"));

  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) =>
    button.addEventListener("click", removeUser),
  );

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", editUser);
  });
};

const teacher = () => {
  const uczniowie = users.filter((user) => user.role === "student");

  const uczniowieDiv = document.getElementById("uczniowie");
  const panelTeacher = document.getElementById("teacher-panel");
  const wyborUcznia = document.getElementById("uczenSelect");
  const wyborOceny = document.getElementById("ocena");

  uczniowieDiv.innerHTML = "";
  wyborUcznia.innerHTML = "";

  uczniowieDiv.classList.add("uczniowieDiv");
  panelTeacher.classList.remove("hidden");

  uczniowie.forEach((uczen) => {
    const uczenDiv = document.createElement("div");
    uczenDiv.classList.add("uczen");
    uczenDiv.innerHTML = `
      ID: ${uczen.id} | Imię: ${uczen.name} | Rola: ${uczen.role} | Oceny: ${uczen.grades}
    `;
    uczniowieDiv.appendChild(uczenDiv);

    const opcja = document.createElement("option");
    opcja.text = uczen.name;
    wyborUcznia.appendChild(opcja);
  });

  if (wyborOceny.options.length === 0) {
    const ocenyDoWyboru = [1, 2, 3, 4, 5, 6];
    ocenyDoWyboru.forEach((ocena) => {
      const opcja = document.createElement("option");
      opcja.text = ocena;
      wyborOceny.appendChild(opcja);
    });
  }
};

const buttonDodajOcene = document.getElementById("dodaj");

buttonDodajOcene.addEventListener("click", () => {
  const wyborOceny = document.getElementById("ocena");
  const wyborUcznia = document.getElementById("uczenSelect");
  const wybranaOpcja = wyborUcznia.options[wyborUcznia.selectedIndex].text;

  const user = users.find((u) => u.name === wybranaOpcja);
  if (user && wyborOceny.value) {
    user.grades.push(wyborOceny.value);
    teacher();
  }
});

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

  const userIndex = users.findIndex(
    (user) => user.id === Number(parent.dataset.id),
  );

  editDiv.setHTMLUnsafe(`
    Panel edycji
    <label>Nazwa użytkownika: <input type="text" class="name-edit" id="name-edit" value="" /></label>
    <label>Oceny: <input type="text" class="grade-edit" id="grade-edit" value="" /></label>
    <label>Rola: <select class="role-edit" id="role-edit"></select></label>
    <button type="button" id="edit-apply" class="edit-apply">Apply</button>
    <p class="error hidden" id="error"></p>
  `);

  parent.appendChild(editDiv);

  const nameInput = editDiv.querySelector("#name-edit");
  nameInput.value = users[userIndex].name;

  const gradeInput = editDiv.querySelector("#grade-edit");
  const currentGrades = users[userIndex].grades;
  gradeInput.value = Array.isArray(currentGrades)
    ? currentGrades.join(" ")
    : "";

  gradeInput.addEventListener("input", (e) => {
    let digits = e.target.value.replace(/[^1-6]/g, "");
    e.target.value = digits.split("").join(" ");
  });

  populateRoleOptions(
    editDiv.querySelector("#role-edit"),
    users[userIndex].role,
  );

  const applyButton = editDiv.querySelector("#edit-apply");

  applyButton.addEventListener("click", () => {
    const nameField = editDiv.querySelector("#name-edit");

    if (nameField.value.trim() === "") {
      const error = editDiv.querySelector("#error");
      error.textContent = "Wprowadź wszystkie wartości!";
      error.classList.remove("hidden");
      return;
    }

    const newName = nameField.value;
    const newRole = editDiv.querySelector("#role-edit").value;

    const gradesRaw = gradeInput.value.trim();
    const newGradesArray =
      gradesRaw === ""
        ? []
        : gradesRaw.split(" ").map((num) => parseInt(num, 10));

    users[userIndex].name = newName;
    users[userIndex].role = newRole;
    users[userIndex].grades = newGradesArray;

    admin();
  });
};

startButtons.forEach((button) => {
  button.addEventListener("click", showPanel);
});

addUserButton.addEventListener("click", addUser);

const powrotButton = document.querySelectorAll(".powrot");

const glowna = () => {
  const panele = document.querySelectorAll(".panel");
  panele.forEach((panel) => {
    panel.classList.add("hidden");
  });
  const menuContainer = document.getElementById("menu-container");
  menuContainer.classList.remove("hidden");
};

powrotButton.forEach((powrot) => {
  powrot.addEventListener("click", glowna);
});
