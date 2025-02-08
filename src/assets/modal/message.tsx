// messages.js
export interface MessageObject {
    [key: string]: string; // Index signature
  }
export const successMessages = {
    userCreated: "User created successfully!",
    itemSaved: "Item saved successfully!",
    // ... more success messages
  };
  
  export const errorMessages = {
    invalidInput: "Invalid input. Please check your data.",
    networkError: "Network error. Please try again later.",
    // ... more error messages
  };
  
  // confirmations.js
  export const confirmationMessages = {
    deleteItem: "Are you sure you want to delete this item?",
    submitForm: "Are you sure you want to submit this form?",
    // ... more confirmation messages
  };