import ics from "ics";
import fs from "fs";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createCalendarEvent =  (appointment) => {

    return new Promise((resolve,reject)=> {
        try {
            // Parse the appointment date and time
            const [hour, minute] = appointment.time.split(":"); // Ensure time is in HH:MM format
            const startDate = new Date(appointment.date)
        
            // Validate the date
            if (isNaN(startDate.getTime())) {
              throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
            }
        
            // Set the time on the date
            startDate.setHours(parseInt(hour), parseInt(minute));
        
            console.log("Parsed Date:", startDate); // Debugging
        
            const event = {
              start: [
                startDate.getFullYear(),
                startDate.getMonth() + 1, // Months are 0-indexed
                startDate.getDate(),
                parseInt(hour), // Hour
                parseInt(minute), // Minute
              ],
              duration: { hours: 1 }, // Default duration (adjust as needed)
              title: `Appointment for ${appointment.serviceTitle}`,
              description: `You have an appointment for ${appointment.serviceTitle} at ${appointment.time}.`,
              location: "Palms Beauty Salon, 123 Beauty Street, City, Country",
              url: "https://palmsbeauty.com", // Your website URL
              status: "CONFIRMED",
              organizer: { name: "Palms Beauty", email: "admin@palmsbeauty.com" },
              attendees: [
                {
                  name: appointment.userDetails.name,
                  email: appointment.userDetails.email,
                },
              ],
            };
        
            console.log("Event Data:", event); // Debugging
        
            // Generate the .ics file
            ics.createEvent(event, (error, value) => {
              if (error) {
                console.error("Error generating .ics file:", error);
                reject(error);
                return; // Throw the error to handle it in the calling function
              }
        
              // Save the .ics file to the `calendar` folder
              const folderPath = path.join(__dirname, "..", "calendar");
              if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
              }
        
              const filePath = path.join(folderPath, `event-${appointment._id}.ics`);
              fs.writeFileSync(filePath, value);
        
              console.log("Generated .ics file:", filePath);
              resolve(filePath); // Return the file path for further use
            });
          } catch (error) {
            console.error("Error in createCalendarEvent:", error);
            reject (error); // Propagate the error
          }
    })
 
};

export default createCalendarEvent;