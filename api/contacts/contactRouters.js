const { Router } = require("express");
const ContactController = require("./contactsController");

const ContactRouter = Router();

ContactRouter.get("/", ContactController.getContacts);

ContactRouter.get("/:id", ContactController.getById);

ContactRouter.post(
  "/",
  ContactController.validateAddContact,
  ContactController.addContact
);

ContactRouter.delete("/:id", ContactController.deleteContact);

ContactRouter.patch(
  "/:id",
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

module.exports = ContactRouter;
