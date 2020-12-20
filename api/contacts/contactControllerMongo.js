const Joi = require("joi");
const ContactDb = require("./contactsModel");

class ContactController {
  getContactsController = async (req, res, next) => {
    try {
      const contacts = await ContactDb.getContacts();
      res.json(contacts);
    } catch (e) {
      next(e);
    }
  };

  getContactByIdController = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      console.log("params req ", req.params);
      const contact = await ContactDb.getContactById(contactId);
      console.log("contact", contact);
      res.json(contact);
    } catch (e) {
      next(e);
    }
  };

  createContactController = async (req, res, next) => {
    try {
      const { body } = req;
      const newContact = await ContactDb.createContact(body);
      res.status(201).json(newContact);
    } catch (e) {
      next(e);
    }
  };

  deleteContactController = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      await ContactDb.deleteContact(contactId);
      res.end();
    } catch (e) {
      next(e);
    }
  };

  updateContactController = async (req, res, next) => {
    try {
      const { id, ...data } = req.body;
      const updateContact = await ContactDb.updateContact(id, data);
      res.status(200).json(updateContact);
    } catch (e) {
      next(e);
    }
  };

  validateAddContact = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validationRes = schema.validate(req.body);
    if (validationRes.error) {
      return res
        .status(400)
        .send('"message": "missing required name field"', validationRes.error);
    }
    next();
  };

  validateUpdateContact = (req, res, next) => {
    const schema = Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      password: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const validationRes = schema.validate(req.body);
    if (validationRes.error) {
      return res.status(400).send(body, "missing fields", validationRes.error);
    }
    next();
  };
}

module.exports = new ContactController();
