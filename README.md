# Bookmarkd

Welcome to **Bookmarkd**, a comprehensive book tracking app that lets you manage your reading habits, track progress, and organize your book collection with ease. Whether you're a casual reader or a book enthusiast, Bookmarkd provides the tools you need to stay on top of your literary journey.

---

## **Why Bookmarkd?**

Bookmarkd was created to address the lack of intuitive, feature-rich tools for book lovers to:
- Track books they are currently reading, want to read, or have already read.
- Join book clubs, share reviews, and connect with other readers. **Coming soon**.
- Track progress and statistics to encourage more reading.
- Maintain a seamless, cross-platform experience for book lovers. **Mobile support coming soon**.

With Bookmarkd, reading isn't just a hobby—it's an experience.

---

## **Features**

- **Reading Progress Tracking**: Keep track of your current reading progress with ease.
- **Customizable Shelves**: Organize books into "Read," "Currently Reading," and "To Be Read" shelves.
- **Book Favorites**: Mark your favorite books for quick access.
- **User Authentication**: Secure user accounts with Firebase Authentication.
- **Data Visualization**: Insights into your reading habits over time. **Coming soon**.
- **Cross-Platform Compatibility**: Accessible from both desktop and mobile **Mobile support coming soon**.

---

## **How to Report Issues**

If you encounter any bugs, issues, or have suggestions for improvement, please report them via our GitHub issue tracker.

### **Issue Reporting Template**

**Title:** [Brief description of the issue]

**Description:**
A detailed description of the issue, including what you were trying to achieve and what happened instead.

**Steps to Reproduce:**
1. Go to [specific page].
2. Click on [specific button/action].
3. Observe [specific issue].

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Environment:**
- What book are you having an issue with? (Title, ISBN, Author)

**Additional Context:**
Include any additional information that might help us resolve the issue.

Submit your issue [here](https://github.com/samersawan/bookmarkd/issues).

---

## **Contributing**

The project is currently not open to contributions, but I am planning on eventually opening it up for contributions from the public. In the mean time, the following section shows you how to install the app if you would like to experiment with it locally.

### **Installation**

Make sure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (version 23 or higher)
- [Go](https://go.dev/) (for backend development)
- [Docker](https://www.docker.com/) (optional, for running in a containerized environment)

### **Getting Started**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/bookmarkd.git
   cd bookmarkd
   ```

2. **Set Up Environment Variables:**
   - Create a `.env` file in the root directory and add the following variables:
     ```env
     DB_URL="postgres://<user>:<password>@localhost:5432/bookmarkd?sslmode=disable"
     API_KEY="<your-firebase-api-key>"
     serviceAccountKey='{"type": "service_account", "project_id": "<your-project-id>", ...}'
     ```

3. **Install Dependencies:**
   For the frontend:
   ```bash
   cd frontend
   npm install
   ```

   For the backend:
   ```bash
   cd backend
   go mod tidy
   ```

4. **Run Locally:**
   - Start the backend:
     ```bash
     go build -o bookmarkd
     ./bookmarkd
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm run dev
     ```

5. **Access the App:**
   Open your browser and go to `http://localhost:3000`.

### **Running with Docker**

To run the app using Docker:

1. **Build the Docker Image:**
   ```bash
   GOOS=linux GOARCH=amd64 go build -o bookmarkd
   docker build -t bookmarkd .
   ```

2. **Run the Docker Container:**
   ```bash
   docker run -p 8080:8080 bookmarkd
   ```

---

## **Acknowledgments**

- Built with love using Typescript, Next.js, TailwindCSS, Go, and Firebase.
- Inspired by the passion of book lovers everywhere.

---

Feel free to share your feedback about Bookmarkd! Together, we can make reading even more enjoyable. 😊

