# My Next.js App

This is a Next.js app that allows users to fill out a form and generate a completed document using the OpenAI API.

## Getting Started

To get started, clone this repository and run `npm install` to install the dependencies. Then, run `npm run dev` to start the development server.

## Components

### Header

The `Header` component displays the header of the page.

### Form

The `Form` component displays the form on the left side of the page. The form contains fields for firstname, lastname, cnp, and date of birth.

### DocumentTextArea

The `DocumentTextArea` component displays the big text area on the right side of the page.

### SubmitButton

The `SubmitButton` component displays the submit button below the form and text area.

### OpenAIResponse

The `OpenAIResponse` component displays the response from the OpenAI API below the form and text area.

## Pages

### IndexPage

The `IndexPage` component renders the `Header`, `Form`, `DocumentTextArea`, `SubmitButton`, and `OpenAIResponse` components.

## Utils

### openai.ts

The `openai.ts` file exports a function `getOpenAIResponse` which makes a request to the OpenAI API with the form data and text area content.

## Public

The `public` folder contains images used in the project.

## Styles

### globals.css

The `globals.css` file contains global styles for the project.

### tailwind.css

The `tailwind.css` file contains Tailwind CSS styles for the project.

## Configuration

### package.json

The `package.json` file is the configuration file for npm. It lists the dependencies and scripts for the project.

### tailwind.config.js

The `tailwind.config.js` file is the configuration file for Tailwind CSS. It specifies the theme and variants for the project.

### tsconfig.json

The `tsconfig.json` file is the configuration file for TypeScript. It specifies the compiler options and the files to include in the compilation.

### next.config.js

The `next.config.js` file is the configuration file for Next.js. It specifies the webpack configuration and other settings for the project.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- This project was created using Next.js, Mantine, Tailwind CSS, and the OpenAI API.
- Thanks to the developers of these tools and technologies for making this project possible.