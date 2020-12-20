const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
require("dotenv").config();

const contactRouter = require("./api/contacts/contactRouters");

const ContactServer = require("./api/server");

new ContactServer().start();
