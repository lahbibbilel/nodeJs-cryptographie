const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const app = express();
const port = 3000;
const cors = require("cors"); // Importez le module cors
app.use(express.json());
const User = require("./models/user"); //< Correct the variable name to User
const Reclamation = require("./models/reclamation"); // Correct the variable name to User
app.use(cors()); // Activez le middleware cors

app.post("/user", async (req, res) => {
  try {
    const newUser = new User(req.body); // Créez une instance de l'utilisateur
    await newUser.hashPassword(); // Hachez le mot de passe
    await newUser.save(); // Enregistrez l'utilisateur
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

function encryptReclamation(reclamation) {
  const encryptionKey =
    "98232bac1c8ecb4af5c704a6636c671da65bde195e5ef38bbe1b6feadd60e3f0";
  const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
  let encryptedReclamation = cipher.update(reclamation, "utf8", "hex");
  encryptedReclamation += cipher.final("hex");
  return encryptedReclamation;
}
//cryptage symetrique
app.post("/reclamation", async (req, res) => {
  try {
    // Assuming req.body contains the reclamation and other user data
    const { reclamation, firstnameUser, lastnameUser, emailUser } = req.body;

    // Encrypt the reclamation data
    const encryptedReclamation = encryptReclamation(reclamation);
    const encryptedfirstname = encryptReclamation(firstnameUser);
    const encryptedlastname = encryptReclamation(lastnameUser);
    const encryptedemail = encryptReclamation(emailUser);

    // Create a new Reclamation instance with the encrypted data and other user data
    const newRec = new Reclamation({
      reclamation: encryptedReclamation,
      firstnameUser: encryptedfirstname,
      lastnameUser: encryptedlastname,
      emailUser: encryptedemail,
    });

    // Save the new Reclamation to the database
    await newRec.save();

    res.status(201).json({ message: "Reclamation created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//decryptage

app.get("/reclamation/:id", async (req, res) => {
  try {
    // Retrieve the reclamation document by its ID (assuming you have a unique ID for each reclamation)
    const reclamationId = req.params.id;
    const reclamation = await Reclamation.findById(reclamationId);

    if (!reclamation) {
      return res.status(404).json({ message: "Reclamation not found" });
    }

    // Decrypt the reclamation data
    const decryptedReclamation = decryptReclamation(reclamation.reclamation);

    // You can also decrypt other fields like firstname, lastname, and email in a similar way
    const decryptedFirstname = decryptReclamation(reclamation.firstnameUser);
    const decryptedLastname = decryptReclamation(reclamation.lastnameUser);
    const decryptedEmail = decryptReclamation(reclamation.emailUser);

    res.status(200).json({
      reclamation: decryptedReclamation,
      firstnameUser: decryptedFirstname,
      lastnameUser: decryptedLastname,
      emailUser: decryptedEmail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function decryptReclamation(encryptedReclamation) {
  const encryptionKey =
    "98232bac1c8ecb4af5c704a6636c671da65bde195e5ef38bbe1b6feadd60e3f0";
  const decipher = crypto.createDecipher("aes-256-cbc", encryptionKey);
  let decryptedReclamation = decipher.update(
    encryptedReclamation,
    "hex",
    "utf8"
  );
  decryptedReclamation += decipher.final("utf8");
  return decryptedReclamation;
}

mongoose
  .connect(
    "mongodb+srv://lahbibbilel:lahbibbilel@back-node.kmuw3yj.mongodb.net/security-project?retryWrites=true&w=majority"
  )

  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    console.log("connected to mongoDb");
  })
  .catch((error) => {
    console.log("error");
  });
