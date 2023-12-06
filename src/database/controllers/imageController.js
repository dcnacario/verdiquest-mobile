const { upload, deleteFile } = require("../middleware/multerConfig");
const Image = require("../models/image");
const db = require("../database");

const img = new Image(db);

async function updateOrgProfile(request, response) {
  try {
    const filename = request.file.filename; // Assuming this is the path of the uploaded image
    const organizationId = request.body.organizationId;
    const currentImage = await img.getOrganizationImage(organizationId);
    console.log(currentImage);
    if (currentImage) {
      // Delete the current image file
      deleteFile("images/organization/" + currentImage);
    }

    // Update the database record with the new filename
    await img.insertImageOrgProfile(filename, organizationId);

    // Send response with success status and new image URI
    response.send({
      success: true,
      newImageUri: `/${filename}`, // Send the newFilename in the URI
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function uploadTaskImage(request, response) {
  try {
    const filename = request.file.filename; // Assuming this is the path of the uploaded image
    const {
      difficultyId,
      organizationId,
      taskName,
      taskDescription,
      taskDuration,
      taskPoints,
      Status,
    } = request.body;

    const taskData = {
      difficultyId,
      organizationId,
      taskName,
      taskDescription,
      taskDuration,
      taskPoints,
      Status,
    };

    const insertTaskId = await img.insertTaskImage(filename, taskData);

    response.status(200).send({
      message: "Task registered successfully!",
      taskId: insertTaskId,
      success: true,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function updateTaskImage(request, response) {
  try {
    const filename = request.file.filename; // Assuming this is the path of the uploaded image
    const taskId = request.body.taskId;
    const currentImage = await img.getTaskImage(taskId);
    console.log(currentImage);
    if (currentImage) {
      // Delete the current image file
      deleteFile("images/task/" + currentImage);
    }

    // Update the database record with the new filename
    await img.updateTaskImage(filename, taskId);

    // Send response with success status and new image URI
    response.send({
      success: true,
      newImageUri: `/${filename}`, // Send the newFilename in the URI
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function uploadEventImage(request, response) {
  try {
    const filename = request.file.filename;
    const {
      organizationId,
      eventName,
      eventDescription,
      eventVenue,
      eventDate,
      eventPoints,
    } = request.body;

    const eventData = {
      organizationId,
      eventName,
      eventDescription,
      eventVenue,
      eventDate,
      eventPoints,
    };

    const insertEventId = await img.insertEventImage(filename, eventData);

    response.status(200).send({
      message: "Event registered successfully!",
      taskId: insertEventId,
      success: true,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function updateEventImage(request, response) {
  try {
    const eventId = request.body.eventId;
    const newFilename = request.file.filename; // Filename of the new image

    const currentImage = await img.getEventImage(eventId);
    console.log(currentImage);
    if (currentImage) {
      // Delete the current image file
      deleteFile("images/event/" + currentImage);
    }

    // Update the database record with the new filename
    await img.updateEventImage(eventId, newFilename);

    // Send response with success status and new image URI
    response.send({
      success: true,
      newImageUri: `/${newFilename}`, // Send the newFilename in the URI
    });
  } catch (error) {
    console.error("Error updating event image:", error);
    response.status(500).send("Error updating event image");
  }
}

async function uploadProductImage(request, response) {
  try {
    const filename = request.file.filename;
    const {
      organizationId,
      productName,
      productDescription,
      productSize,
      productQuantity,
      pointsRequired,
    } = request.body;

    const productData = {
      organizationId,
      productName,
      productDescription,
      productSize,
      productQuantity,
      pointsRequired,
    };

    const insertProductId = await img.insertProductImage(filename, productData);

    response.status(200).send({
      message: "Product registered successfully!",
      productId: insertProductId,
      success: true,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function updateProductImage(request, response) {
  try {
    const productId = request.body.productId;
    const newFilename = request.file.filename; // Filename of the new image

    const currentImage = await img.getProductImage(productId);
    console.log(currentImage);
    if (currentImage) {
      // Delete the current image file
      deleteFile("images/product/" + currentImage);
    }

    // Update the database record with the new filename
    await img.updateProductImage(productId, newFilename);

    // Send response with success status and new image URI
    response.send({
      success: true,
      newImageUri: `/${newFilename}`, // Send the newFilename in the URI
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    response.status(500).send("Error updating product image");
  }
}

async function updateProfilePicture(request, response) {
  try {
    const filename = request.file.filename;
    const userId = request.body.userId;
    const currentImage = await img.getProfilePicture(userId);
    if (currentImage) {
      deleteFile("images/profilepicture/" + currentImage);
    }

    await img.updateProfilePicture(filename, userId);

    response.send({
      success: true,
      newImageUri: `/${filename}`,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function submitProofImages(request, response) {
  try {
    const userDailyTaskId = request.body.userDailyTaskId;
    const images = request.files; // Assuming this is an array of file objects

    // Delete old images
    const currentImageFiles = await img.getUserDailyTaskProof(userDailyTaskId);
    if (currentImageFiles) {
      Object.keys(currentImageFiles).forEach((key) => {
        const imageFilename = currentImageFiles[key];
        if (imageFilename) {
          deleteFile("images/proof/" + imageFilename);
        }
      });
    }

    // Process and save new images
    const newImageFilenames = images.map((image) => image.filename); // Or whatever property has the filename
    await img.submitProofImages(newImageFilenames, userDailyTaskId);

    // Respond with success and the first new image URI as an example
    response.send({
      success: true,
      newImageUri: `images/proof/${newImageFilenames[0]}`, // Adjust as needed
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

module.exports = {
  updateOrgProfile,
  uploadTaskImage,
  updateTaskImage,
  uploadEventImage,
  updateEventImage,
  uploadProductImage,
  updateProductImage,
  updateProfilePicture,
  submitProofImages,
};
