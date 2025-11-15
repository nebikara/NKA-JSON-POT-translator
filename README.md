
# NKA Json&pot translator

Welcome to NKA Json&pot translator, a powerful and intuitive web-based tool designed to streamline the translation of JSON files into multiple languages simultaneously. Featuring a sleek, wizard-based user interface, this application helps developers and localization teams manage their translation workflows with unparalleled efficiency and ease.

*Note: You can add a screenshot of the application here.*

## ✨ Key Features

-   **🧙‍♂️ Guided Wizard Workflow:** A step-by-step process (Upload → Select Languages → Fine-Tune → Review → Download) that makes complex translation tasks simple and intuitive.
-   **📂 Advanced File Management:**
    -   Upload multiple JSON files via a large, modern drag & drop area.
    -   Client-side validation for file type (`.json`) and size (max 10MB).
    -   View a clean list of uploaded files with details like size and line count.
    -   Easily remove individual files or clear the entire queue.
-   **🌍 Multi-Language Support:**
    -   Translate your files into 60+ languages.
    -   A searchable, multi-column interface for easy language selection.
    -   Selected languages are clearly displayed as tags for quick review.
    -   "Select All" and "Deselect All" options for quick management.
-   **🛠️ Granular Translation Control:**
    -   **Basic Rules:** Preserve HTML/Markdown formatting, maintain original letter casing, and exclude numbers from translation.
    -   **Advanced Options:** Fine-tune the translation **Style** (e.g., Formal, Informal), **Tone** (e.g., Friendly, Professional), and **Creativity** level with a simple slider.
    -   **Custom Instructions:** Provide the AI model with specific, free-form instructions for nuanced translations.
    -   **Glossary:** Define a list of terms that should not be translated (e.g., brand names) or that require a specific translation.
-   **⚡ Efficient & Robust Processing:**
    -   **Smart Chunking:** Automatically splits large JSON files into smaller chunks to ensure reliable API processing and avoid timeouts.
    -   **Sequential Queue:** Systematically processes each file-and-language combination.
    -   **Automatic Retries:** If an API call fails, the system automatically retries up to 3 times, enhancing the process's reliability.
-   **📊 Real-time Progress Tracking:**
    -   An elegant, full-screen overlay displays the translation progress.
    -   Features a vibrant, animated progress bar and detailed status messages.
-   **✅ Final Review & Confirmation:**
    - A dedicated "Review" step summarizes all your selections—files, languages, and key settings—before you start the translation, preventing accidental errors.
-   **📦 Convenient Output:**
    -   Download all translated files in a single, well-structured `.zip` archive.
    -   The archive organizes files logically: a parent folder for each original file, containing the translated JSONs named by their language code (e.g., `translations/my-file/fr.json`).
-   **🎨 Modern User Experience:**
    -   Sleek, dark-mode UI with vibrant gradients.
    -   Fully responsive design that looks great on any device.
    -   Settings, files, and languages are automatically saved in your browser's local storage.

## 🚀 Tech Stack

-   **Frontend:** React, TypeScript
-   **Styling:** Tailwind CSS
-   **Icons:** Lucide React
-   **File Handling:** React Dropzone, JSZip, FileSaver.js

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   npm, yarn, or pnpm package manager

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/nka-json-pot-translator.git
    cd nka-json-pot-translator
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your Environment Variables:**
    This project requires a Google Gemini API key to function.

    -   Create a new file named `.env` in the root of your project directory.
    -   Add your API key to the `.env` file as follows:
        ```env
        VITE_GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
        ```
    -   You can get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    This project is set up to run in a Vite environment.
    ```sh
    npm run dev
    ```
    The application should now be running on a local server (e.g., `http://localhost:5173`).

## 📋 How to Use

1.  **Step 1: Upload Files:** Drag and drop your `.json` files into the designated area.
2.  **Step 2: Select Languages:** Choose your target languages from the list.
3.  **Step 3: Fine-Tune:** Adjust translation rules, style, tone, and add a glossary if needed.
4.  **Step 4: Review:** Confirm your selections on the summary screen.
5.  **Step 5: Translate:** Click the "Start Translation" button and monitor the progress.
6.  **Download:** Once completed, download your `.zip` archive from the results screen.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
