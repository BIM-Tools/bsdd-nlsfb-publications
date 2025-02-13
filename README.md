# NL-SfB Publications on bSDD

This project is a React application that displays NL-SfB publications using the buildingSMART Data Dictionary (bSDD). It allows users to select different dictionaries and view related class details and reverse relations.

## Features

- Select and view different dictionaries from bSDD.
- Display class details including descriptions and related terms.
- Navigate through class hierarchies using breadcrumbs.
- Open class details directly on the bSDD website.

## Technologies Used

- React
- TypeScript
- Vite
- Mantine UI Library
- Swagger-generated API client

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/NLBE-SfB-publicatie.git
   cd NLBE-SfB-publicatie
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Generate the API client:

   ```sh
   npm run generate-api
   # or
   yarn generate-api
   ```

### Running the Application

To start the development server:

```sh
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:5173` to see the application in action.

### Building for Production

To build the application for production:

```sh
npm run build
# or
yarn build
```

The output will be in the `dist` directory.

### Linting

To lint the code:

```sh
npm run lint
# or
yarn lint
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
