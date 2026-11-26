var contactModal = document.getElementById("contactModal");
var modalBackdrop = document.getElementById("modalBackdrop");
var modalTitle = document.getElementById("modalTitle");
var closeModalBtn = document.getElementById("closeModalBtn");
var cancelModalBtn = document.getElementById("cancelModalBtn");
var contactForm = document.getElementById("contactForm");
var contactName = document.getElementById("contactName");
var contactPhone = document.getElementById("contactPhone");
var contactEmail = document.getElementById("contactEmail");
var contactAddress = document.getElementById("contactAddress");
var contactGroup = document.getElementById("contactGroup");
var contactNotes = document.getElementById("contactNotes");
var contactFavorite = document.getElementById("contactFavorite");
var contactEmergency = document.getElementById("contactEmergency");
var contactId = document.getElementById("contactId");
var avatarInput = document.getElementById("avatarInput");
var avatarPreview = document.getElementById("avatarPreview");
var searchInput = document.getElementById("searchInput");
var addContactBtn = document.getElementById("addContactBtn");

var currentAvatar = "";
var allContacts = JSON.parse(localStorage.getItem("allContacts")) || [];

function openContactModal() {
  contactModal.classList.remove("d-none");
}

function closeContactModal() {
  contactModal.classList.add("d-none");
  clearInputs();
}

function onAddContactClick() {
  modalTitle.innerHTML = "Add New Contact";
  openContactModal();
}

function onSaveContactClick(e) {
  e.preventDefault();

  var nameOk = validate("name", contactName);
  var phoneOk = validate("phone", contactPhone);
  var emailOk = validate("email", contactEmail);
  if (!nameOk || !phoneOk || !emailOk) {
    return;
  }

  var contact = {
    name: contactName.value.trim(),
    phone: contactPhone.value.trim(),
    email: contactEmail.value.trim(),
    address: contactAddress.value.trim(),
    group: contactGroup.value,
    notes: contactNotes.value.trim(),
    isFavorite: contactFavorite.checked,
    isEmergency: contactEmergency.checked,
    avatar: currentAvatar,
  };

  if (contactId.value === "") {
    allContacts.push(contact);
  } else {
    allContacts[contactId.value] = contact;
  }

  searchInput.value = "";
  refreshAll();
  closeContactModal();

  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your contact has been saved",
    showConfirmButton: false,
    timer: 1500,
  });
}

function showAvatarPreview() {
  avatarPreview.innerHTML = `<img src="${currentAvatar}" alt="" class="avatar-img" />`;
}

function onAvatarChange() {
  var file = avatarInput.files[0];
  if (!file) {
    return;
  }

  var reader = new FileReader();
  reader.onload = function () {
    currentAvatar = reader.result;
    showAvatarPreview();
  };
  reader.readAsDataURL(file);
}

function getInitials(name) {
  var parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
}

function getAvatar(contact, size) {
  if (contact.avatar) {
    return `<img src="${contact.avatar}" alt="" class="av ${size}">`;
  }
  var colorNumber = (contact.name.length % 8) + 1;
  return `<div class="av ${size} av-${colorNumber}">${getInitials(contact.name)}</div>`;
}

function getGroupClass(group) {
  if (["family", "friends", "work", "school"].includes(group)) {
    return "grp-" + group;
  }
  return "grp-other";
}

function highlight(text, searchTerm) {
  if (!searchTerm) {
    return text;
  }
  var safe = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp("(" + safe + ")", "gi"), `<span class="bg-warning">$1</span>`);
}

function displayContacts(contactsArr, searchTerm) {
  var temp = "";
  var row = document.querySelector("#contacts-grid .row");

  if (contactsArr.length === 0) {
    row.innerHTML = `<div class="empty-state">
        <div class="bx"><i class="fa-solid fa-address-book"></i></div>
        <p>No contacts found</p>
        <p>Click "Add Contact" to get started</p>
      </div>`;
    return;
  }

  for (var i = 0; i < contactsArr.length; i++) {
    var c = contactsArr[i];
    var index = allContacts.indexOf(c);

    temp += `<div class="col">
      <div class="ccard">
        <div class="ccard-body">
          <div class="d-flex align-items-start gap-3">
            <div class="position-relative flex-shrink-0">
              ${getAvatar(c, "lg")}
              ${c.isEmergency ? `<div class="badge-dot dot-em"><i class="fa-solid fa-heart-pulse"></i></div>` : ""}
              ${c.isFavorite ? `<div class="badge-dot dot-fav"><i class="fa-solid fa-star"></i></div>` : ""}
            </div>
            <div class="flex-fill min-w-0 pt-1">
              <h3>${highlight(c.name, searchTerm)}</h3>
              <div class="d-flex align-items-center gap-2 mt-1">
                <div class="ico-sq s6 ico-phone"><i class="fa-solid fa-phone"></i></div>
                <span class="trunc t-light">${highlight(c.phone, searchTerm)}</span>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex flex-column gap-2">
            ${
              c.email
                ? `<div class="d-flex align-items-center gap-2">
                <div class="ico-sq s7 ico-mail"><i class="fa-solid fa-envelope"></i></div>
                <span class="trunc t-dark">${highlight(c.email, searchTerm)}</span>
              </div>`
                : ""
            }
            ${
              c.address
                ? `<div class="d-flex align-items-center gap-2">
                <div class="ico-sq s7 ico-addr"><i class="fa-solid fa-location-dot"></i></div>
                <span class="trunc t-dark">${c.address}</span>
              </div>`
                : ""
            }
          </div>
          ${
            c.group || c.isEmergency
              ? `<div class="d-flex flex-wrap gap-1 mt-3">
              ${c.group ? `<span class="badge-x cap ${getGroupClass(c.group)}">${c.group}</span>` : ""}
              ${c.isEmergency ? `<span class="badge-x grp-emergency"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>` : ""}
            </div>`
              : ""
          }
        </div>
        <div class="cfoot">
          <div class="d-flex align-items-center gap-1">
            <a href="tel:${c.phone}" class="abtn act-call" title="Call"><i class="fa-solid fa-phone"></i></a>
            ${c.email ? `<a href="mailto:${c.email}" class="abtn" title="Email"><i class="fa-solid fa-envelope"></i></a>` : ""}
          </div>
          <div class="d-flex align-items-center gap-1">
            <button onclick="toggleFavorite(${index})" class="abtn act-fav ${c.isFavorite ? "on" : ""}" title="Favorite"><i class="${c.isFavorite ? "fa-solid" : "fa-regular"} fa-star"></i></button>
            <button onclick="toggleEmergency(${index})" class="abtn act-em ${c.isEmergency ? "on" : ""}" title="Emergency"><i class="${c.isEmergency ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i></button>
            <button onclick="updateContact(${index})" class="abtn act-edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button onclick="deleteContact(${index})" class="abtn act-del" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }

  row.innerHTML = temp;
}

function displaySide() {
  var favs = allContacts.filter(function (c) {
    return c.isFavorite;
  });
  var ems = allContacts.filter(function (c) {
    return c.isEmergency;
  });

  renderSide("favorites-section", "favorites-section-mobile", favs, "fav", "No favorites yet");
  renderSide("emergency-contacts", "emergency-contacts-mobile", ems, "em", "No emergency contacts");
}

function renderSide(id, mobId, list, kind, emptyMsg) {
  var desk = "";
  var mob = "";

  if (list.length === 0) {
    desk = `<div class="empty-cell">${emptyMsg}</div>`;
    mob = desk;
  }

  for (var i = 0; i < list.length; i++) {
    var c = list[i];

    desk += `<div class="mini ${kind}">
        <div class="flex-shrink-0">${getAvatar(c, "sm")}</div>
        <div class="flex-fill min-w-0"><h4>${c.name}</h4><p>${c.phone}</p></div>
        <a href="tel:${c.phone}" class="call"><i class="fa-solid fa-phone"></i></a>
      </div>`;

    mob += `<a href="tel:${c.phone}" class="mini-m ${kind}">
        <div class="flex-shrink-0">${getAvatar(c, "xs")}</div>
        <div class="min-w-0 flex-fill"><h4>${c.name}</h4><p>${c.phone}</p></div>
        <div class="c"><i class="fa-solid fa-phone"></i></div>
      </a>`;
  }

  document.querySelector("#" + id + " .panel-body").innerHTML = desk;
  document.querySelector("#" + mobId + " .panel-body").innerHTML = mob;
}

function displayStats() {
  var favCount = allContacts.filter(function (c) {
    return c.isFavorite;
  }).length;
  var emCount = allContacts.filter(function (c) {
    return c.isEmergency;
  }).length;

  document.querySelector("#quick-stats .row").innerHTML = `
    ${statBox("g-blue", "fa-users", "Total", allContacts.length)}
    ${statBox("g-amber", "fa-star", "Favorites", favCount)}
    ${statBox("g-rose", "fa-heart-pulse", "Emergency", emCount)}`;

  document.querySelector("#contacts-header .subtitle").textContent =
    "Manage and organize your " + allContacts.length + " contacts";
}

function statBox(cls, ico, label, number) {
  return `<div class="col">
      <div class="stat">
        <div class="d-flex align-items-center gap-3 gap-sm-4">
          <div class="stat-ico ${cls}"><i class="fa-solid ${ico}"></i></div>
          <div><p class="lbl">${label}</p><p class="num">${number}</p></div>
        </div>
      </div>
    </div>`;
}

function toggleFavorite(index) {
  allContacts[index].isFavorite = !allContacts[index].isFavorite;
  refreshAll();
}

function toggleEmergency(index) {
  allContacts[index].isEmergency = !allContacts[index].isEmergency;
  refreshAll();
}

function refreshAll() {
  handleLocalStorage();
  filterContacts();
  displayStats();
  displaySide();
}

function deleteContact(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(function (result) {
    if (result.isConfirmed) {
      allContacts.splice(index, 1);
      refreshAll();

      Swal.fire({
        title: "Deleted!",
        text: "Your contact has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function updateContact(index) {
  var c = allContacts[index];

  contactId.value = index;
  modalTitle.innerHTML = "Edit Contact";
  contactName.value = c.name;
  contactPhone.value = c.phone;
  contactEmail.value = c.email;
  contactAddress.value = c.address;
  contactGroup.value = c.group;
  contactNotes.value = c.notes;
  contactFavorite.checked = c.isFavorite;
  contactEmergency.checked = c.isEmergency;

  currentAvatar = c.avatar;
  if (currentAvatar) {
    showAvatarPreview();
  }

  openContactModal();
}

function clearInputs() {
  contactForm.reset();
  contactId.value = "";
  currentAvatar = "";
  avatarPreview.innerHTML = `<i class="fa-solid fa-user"></i>`;

  var inputs = [contactName, contactPhone, contactEmail];
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("is-valid", "is-invalid");
    inputs[i].nextElementSibling.classList.add("d-none");
  }
}

function handleLocalStorage() {
  localStorage.setItem("allContacts", JSON.stringify(allContacts));
}

function filterContacts() {
  var term = searchInput.value.trim();
  var lower = term.toLowerCase();
  var newArr = [];

  for (var i = 0; i < allContacts.length; i++) {
    if (
      allContacts[i].name.toLowerCase().includes(lower) ||
      allContacts[i].phone.includes(term) ||
      allContacts[i].email.toLowerCase().includes(lower)
    ) {
      newArr.push(allContacts[i]);
    }
  }

  displayContacts(newArr, term);
}

var regex = {
  name: /^[a-zA-Z\u0600-\u06FF ]{2,50}$/,
  phone: /^(01|(\+20|0020)1)[0125][0-9]{8}$/,
  email: /^$|^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
};

function validate(regexParam, inputName) {
  var isValid = regex[regexParam].test(inputName.value.trim());

  inputName.classList.toggle("is-valid", isValid);
  inputName.classList.toggle("is-invalid", !isValid);
  inputName.nextElementSibling.classList.toggle("d-none", isValid);
  return isValid;
}

addContactBtn.addEventListener("click", onAddContactClick);
searchInput.addEventListener("input", filterContacts);
contactForm.addEventListener("submit", onSaveContactClick);
closeModalBtn.addEventListener("click", closeContactModal);
cancelModalBtn.addEventListener("click", closeContactModal);
modalBackdrop.addEventListener("click", closeContactModal);
avatarInput.addEventListener("change", onAvatarChange);

contactName.addEventListener("input", function () {
  validate("name", contactName);
});
contactPhone.addEventListener("input", function () {
  validate("phone", contactPhone);
});
contactEmail.addEventListener("input", function () {
  validate("email", contactEmail);
});

displayContacts(allContacts);
displayStats();
displaySide();
