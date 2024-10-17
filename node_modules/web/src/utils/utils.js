import Resizer from 'react-image-file-resizer';
import heic2any from 'heic2any';

const changeFileToJPG = async (file) => {
    // If the uploaded image file is in HEIC format, convert it to JPG
    return new Promise((resolve, reject) => {
        try {
            // Check if the file type is HEIC or an empty string (which may happen with HEIC files)
            if (file.type === 'image/heic' || file.type === "") {
                heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 1,
                })
                    .then((result) => {
                        // Create a new File object with the converted image in JPG format
                        let resultFile = new File(
                            [result],
                            file.name.split('.')[0] + '.jpg',
                            {
                                type: 'image/jpeg',
                                lastModified: new Date().getTime(),
                            }
                        );

                        // Resolve with the newly created JPG file
                        resolve(resultFile);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error); // Reject if there's an error during conversion
                    });
            } else {
                // If it's not a HEIC file, just resolve the original file
                resolve(file);
            }
        } catch (error) {
            reject(error); // Catch any unexpected errors and reject the promise
        }
    });
};

const readFileAndResizeImages = async (file) => {
    // Read the image and resize it, keeping the minimum dimension at 512px
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            let image = new Image();
            image.onload = async function () {
                // If the image is wider than it is tall
                if (image.width >= image.height) {
                    // Get the aspect ratio of the image 
                    let proportion = image.width / image.height;
                    // Resize the image while maintaining the aspect ratio
                    Resizer.imageFileResizer(
                        file,
                        512 * proportion, // Set the width based on the proportion
                        512, // Set the height to 512px
                        'JPEG',
                        100,
                        0,
                        (uri) => {
                            resolve(uri); // Return the resized image as a base64 string
                        },
                        'base64'
                    );
                } else {
                    // If the image is taller than it is wide
                    let proportion = image.height / image.width;
                    Resizer.imageFileResizer(
                        file,
                        512, // Set the width to 512px
                        512 * proportion, // Set the height based on the proportion
                        'JPEG',
                        100,
                        0,
                        (uri) => {
                            resolve(uri); // Return the resized image as a base64 string
                        },
                        'base64'
                    );
                }
            };
            // Set the image source to the result from file reader
            image.src = reader.result;
        };
        reader.onerror = reject; // Reject the promise if there’s an error reading the file
        reader.readAsDataURL(file); // Read the file as a Data URL (base64 format)
    });
};

const autoCropImages = async (file) => {
    // Read the image and crop it to a square, centered in the middle of the image
    return new Promise((resolve, reject) => {
        try {
            // Create a canvas and draw the file onto it, cropping the image to a square
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let image = new Image();
            image.onload = function () {
                let base_length = 512;
                canvas.width = base_length;
                canvas.height = base_length;

                // Initialize offsets for centering the image on the canvas
                let offsetX = 0;
                let offsetY = 0;

                // If the image is smaller than the canvas, use the smaller dimension as the base size
                if (image.width < base_length || image.height < base_length) {
                    base_length = image.width > image.height ? image.height : image.width;
                }

                // Calculate the offsets to center the image if it's larger than the base size
                if (image.width > image.height) {
                    offsetX = Math.abs(image.width - base_length) / 2;
                } else {
                    offsetY = Math.abs(image.height - base_length) / 2;
                }

                // Draw the cropped image on the canvas, centered
                ctx.drawImage(
                    image,
                    offsetX,
                    offsetY,
                    base_length,
                    base_length,
                    0,
                    0,
                    512,
                    512
                );

                // Resolve the promise with the cropped image as a base64 string, along with offsets
                resolve({
                    offsetX,
                    offsetY,
                    canvas: canvas.toDataURL('image/jpeg'),
                });
            };

            // Set the image source to the file
            image.src = file;
        } catch (error) {
            console.log(error); // Log and reject if there's an error during cropping
            reject(error);
        }
    });
};

export { readFileAndResizeImages, changeFileToJPG, autoCropImages };
