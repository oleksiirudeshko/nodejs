const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

function listContacts() {
  return fs.readFile(contactsPath, { encoding: "utf-8" }).then((data) => {
    return JSON.parse(data);
  });
}

async function getContactById(contactId) {
  const arr = await listContacts();
  console.log(arr.find((contact) => contact.id === contactId));
}

async function removeContact(contactId) {
  const arr = await listContacts();
  const newArr = arr.filter((contact) => contact.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(newArr, null, 2));
}

async function addContact(name, email, phone) {
  const arr = await listContacts();
  let nextId = 1;
  if (arr.length >= 1) {
    const contactsIds = arr.map((el) => el.id);
    nextId = Math.max(...contactsIds) + 1;
  }

  const newContact = {
    id: nextId,
    name: name,
    email: email,
    phone: phone,
  };
  arr.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(arr, null, 2));
}

module.exports = { listContacts, addContact, removeContact, getContactById };
