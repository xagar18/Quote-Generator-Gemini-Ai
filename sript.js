document
  .getElementById("generate-button")
  .addEventListener("click", async () => {
    const generateButton = document.getElementById("generate-button");
    const promptInput = document.getElementById("prompt");
    const prompt = promptInput.value.trim(); // Trim whitespace from the prompt
    const responseElement = document.getElementById("response");

    // Clear the input box and prepare the container for the response
    promptInput.value = "";
    responseElement.innerHTML = ""; // Clear previous content
    const responseContainer = document.createElement("div");
    const questionElement = document.createElement("h3");
    const newListItem = document.createElement("li");
    responseContainer.appendChild(questionElement);
    responseContainer.appendChild(newListItem);
    responseElement.appendChild(responseContainer);

    // Check if the prompt contains the word "quote"
    if (!prompt.toLowerCase().includes("quote")) {
      questionElement.textContent =
        "Error: The prompt must include the word 'quote'.";
      newListItem.textContent = "Please enter a prompt that includes 'quote'.";
      return;
    }

    // Set the question text
    questionElement.textContent = `Q: ${prompt}`;

    // Disable the generate button
    generateButton.style.pointerEvents = "none";
    generateButton.style.opacity = "0.5";

    // Display searching message
    newListItem.textContent = "Searching...";

    try {
      const bodyContent = {
        prompt: `Generate an inspiring, thoughtful, or creative quote about: ${prompt}.`,
      };

      const result = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyContent),
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json();
      const responseText = data.response;

      // Function to display response one word at a time
      function typeResponse(text, element) {
        let words = text.split(" ");
        let index = 0;
        // Clear "Searching..." message
        element.textContent = "";

        function displayNextWord() {
          if (index < words.length) {
            element.textContent += (index === 0 ? "" : " ") + words[index];
            index++;
            setTimeout(displayNextWord, 100); // Adjust delay between words as needed
          } else {
            // Re-enable the generate button once typing is complete
            generateButton.style.pointerEvents = "auto";
            generateButton.style.opacity = "1";
          }
        }
        displayNextWord();
      }

      // Always clear content before displaying new response
      newListItem.textContent = "";
      typeResponse(responseText, newListItem);
    } catch (error) {
      console.error("Error generating content:", error);
      const errorListItem = document.createElement("li");
      errorListItem.textContent = "An error occurred. Please try again.";
      responseElement.appendChild(errorListItem);
    } finally {
      // Re-enable the generate button
      generateButton.style.pointerEvents = "auto";
      generateButton.style.opacity = "1";
    }
  });

document.getElementById("generate-newchat").addEventListener("click", () => {
  const responseElement = document.getElementById("response");
  responseElement.innerHTML = ""; // Clear all content in the response element
});
