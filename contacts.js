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

async function addContact(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

module.exports = { listContacts, addContact, removeContact, getContactById };
